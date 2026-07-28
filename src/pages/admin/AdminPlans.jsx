import { useEffect, useState } from "react";

import {
  getPlans,
  createPlan,
  updatePlan,
  activatePlan,
  deactivatePlan,
} from "../../api/planApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Button from "../../components/common/Button";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";

import PlanDetailsModal from "../../components/common/PlanDetailsModal";
import PlanFormModal from "../../components/common/PlanFormModal";

function Plans() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  // Server-side pagination state.
  // NOTE: DataTable's pages are 1-based; the backend's `page` param is 0-based.
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, rowsPerPage]);

  async function loadPlans() {
    setLoading(true);

    try {
      const res = await getPlans({
        page: currentPage - 1, // backend is 0-indexed
        size: rowsPerPage,
        sortBy: "createdDate",
        direction: "desc",
      });

      let records = res.data.records || [];

      // activeStatus filtering still happens client-side for now, since the
      // backend endpoint doesn't accept a status filter param. This means
      // "Active"/"Inactive" filters only apply within the current page of
      // results, not across the whole dataset — a known limitation until
      // the backend adds a `status` query param to /api/plans.
      if (status !== "ALL") {
        records = records.filter((p) => p.activeStatus === status);
      }

      setPlans(records);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(newStatus) {
    // <select> elements always emit string values in onChange, even when
    // the <option value={true}> was set with a boolean. So "Active"/
    // "Inactive" arrive here as the strings "true"/"false", not real
    // booleans. Convert back before storing, since plan.activeStatus from
    // the API is an actual boolean and a strict === comparison against a
    // string would never match.
    if (newStatus === "ALL") {
      setStatus("ALL");
    } else {
      setStatus(newStatus === "true");
    }
    setCurrentPage(1); // reset to first page whenever the filter changes
  }

  async function handlePlanStatus(plan, activate) {
    try {
      if (activate) {
        await activatePlan(plan.planId);
      } else {
        await deactivatePlan(plan.planId);
      }

      toast.success(`Plan "${plan.planName}" ${activate ? "activated" : "deactivated"} successfully`);
      loadPlans();
    } catch (err) {
      console.log(err);

      toast.error(getApiErrorMessage(err, `Failed to ${activate ? "activate" : "deactivate"} plan.`));
    }
  }

  async function handleSubmit(form) {
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.planId, form);
        toast.success(`Plan "${form.planName}" updated successfully`);
      } else {
        await createPlan(form);
        toast.success(`Plan "${form.planName}" created successfully`);
      }

      setShowForm(false);

      setEditingPlan(null);

      loadPlans();
    } catch (err) {
      console.log(err);

      toast.error(getApiErrorMessage(err, "Unable to save plan."));
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Plans">
        <BackButton />

        <DataTable
          emptyMessage="No Plans Found"
          columns={[
            {
              key: "planId",
              label: "ID",
            },
            {
              key: "planName",
              label: "Plan",
            },
            {
              key: "coverageRange",
              label: "Coverage Range",
              render: (plan) =>
                `₹${Number(plan.minCoverageAmount).toLocaleString()} – ₹${Number(plan.maxCoverageAmount).toLocaleString()}`,
            },
            {
              key: "ratePerUnit",
              label: "Rate / ₹50,000",
              render: (plan) => `₹${plan.ratePerUnit}`,
            },
            {
              key: "duration",
              label: "Duration",
              render: (plan) => `${plan.duration} Years`,
            },
            {
              key: "activeStatus",
              label: "Status",
              render: (plan) => (
                <StatusBadge
                  status={plan.activeStatus ? "ACTIVE" : "INACTIVE"}
                />
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (plan) => (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowModal(true);
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>

                  {plan.activeStatus ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handlePlanStatus(plan, false)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handlePlanStatus(plan, true)}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={plans}
          searchKeys={["planId", "planName"]}
          searchPlaceholder="Search plans..."
          serverSide
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(size) => {
            setRowsPerPage(size);
            setCurrentPage(1);
          }}
          headerActions={
            <div className="d-flex gap-2">
              <StatusFilter
                value={status}
                onChange={handleStatusChange}
                options={[
                  {
                    value: "ALL",
                    label: "All Status",
                  },
                  {
                    value: true,
                    label: "Active",
                  },
                  {
                    value: false,
                    label: "Inactive",
                  },
                ]}
              />

              <Button
                onClick={() => {
                  setEditingPlan(null);
                  setShowForm(true);
                }}
              >
                + Add Plan
              </Button>

              <ExportPdfButton
                title="Policy Plans"
                rows={plans}
                meta={{ "Status filter": status === "ALL" ? "All" : status ? "Active" : "Inactive" }}
                columns={[
                  { label: "ID", key: "planId" },
                  { label: "Plan", key: "planName" },
                  {
                    label: "Coverage Range",
                    value: (row) =>
                      `₹${Number(row.minCoverageAmount).toLocaleString()} – ₹${Number(row.maxCoverageAmount).toLocaleString()}`,
                  },
                  { label: "Rate / ₹50,000", value: (row) => `₹${row.ratePerUnit ?? "-"}` },
                  { label: "Annual Discount", value: (row) => `${row.annualDiscountPercent ?? 0}%` },
                  { label: "One-Time Discount", value: (row) => `${row.oneTimeDiscountPercent ?? 0}%` },
                  { label: "Duration", value: (row) => `${row.duration} Years` },
                  {
                    label: "Status",
                    value: (row) => (row.activeStatus ? "Active" : "Inactive"),
                  },
                ]}
              />
            </div>
          }
        />
      </Card>

      <PlanDetailsModal
        show={showModal}
        plan={selectedPlan}
        onClose={() => {
          setShowModal(false);
          setSelectedPlan(null);
        }}
      />

      <PlanFormModal
        show={showForm}
        plan={editingPlan}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowForm(false);
          setEditingPlan(null);
        }}
      />
    </DashboardLayout>
  );
}

export default Plans;