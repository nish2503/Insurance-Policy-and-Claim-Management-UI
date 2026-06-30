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
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Button from "../../components/common/Button";

import PlanDetailsModal from "../../components/common/PlanDetailsModal";
import PlanFormModal from "../../components/common/PlanFormModal";

function Plans() {
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadPlans();
  }, [status]);

  async function loadPlans() {
    setLoading(true);

    try {
      const res = await getPlans();

      let records = res.data.records || [];

      if (status !== "ALL") {
        records = records.filter((p) => p.activeStatus === status);
      }

      setPlans(records);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlanStatus(plan, activate) {
    try {
      if (activate) {
        await activatePlan(plan.planId);
      } else {
        await deactivatePlan(plan.planId);
      }

      loadPlans();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(form) {
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.planId, form);
      } else {
        await createPlan(form);
      }

      setShowForm(false);

      setEditingPlan(null);

      loadPlans();
    } catch (err) {
      console.log(err);
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
              key: "premiumAmount",
              label: "Premium",
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
          headerActions={
            <div className="d-flex gap-2">
              <StatusFilter
                value={status}
                onChange={setStatus}
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
            </div>
          }
        />

        {!plans.length && <EmptyState message="No Plans Found" />}
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
