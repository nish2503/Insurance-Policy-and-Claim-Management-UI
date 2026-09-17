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
import { fetchAllPages } from "../../utils/fetchAllPages";

import PlanDetailsModal from "../../components/common/PlanDetailsModal";
import PlanFormModal from "../../components/common/PlanFormModal";

function Plans() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    setLoading(true);

    try {
      // Fetch the whole dataset once (not just one page) so the status
      // filter, on-screen table, and PDF export are all working from the
      // same complete list — filtering/pagination below is done entirely
      // client-side, the same pattern used by the other admin list pages.
      const records = await fetchAllPages((page, size) =>
        getPlans({ page, size, sortBy: "createdDate", direction: "desc" }),
      );

      setPlans(records);
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
  }

  // Status filtering now runs over the complete fetched list, so it applies
  // across every plan — not just whichever page happened to be showing.
  const visiblePlans =
    status === "ALL" ? plans : plans.filter((p) => p.activeStatus === status);

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
          data={visiblePlans}
          searchKeys={["planId", "planName"]}
          searchPlaceholder="Search plans..."
          headerActions={({ pageRows, filteredRows }) => {
            const columns = [
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
            ];
            const meta = {
              "Status filter": status === "ALL" ? "All" : status ? "Active" : "Inactive",
            };

            return (
              <div className="d-flex gap-2">
                <StatusFilter
                  value={status}
                  onChange={handleStatusChange}
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: true, label: "Active" },
                    { value: false, label: "Inactive" },
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

                <ExportPdfButton title="Plans (This Page)" fileName="plans-page" label="Export Page" rows={pageRows} meta={meta} columns={columns} />
                <ExportPdfButton title="Plans (All)" fileName="plans-all" label="Export All" rows={filteredRows} meta={meta} columns={columns} />
              </div>
            );
          }}
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