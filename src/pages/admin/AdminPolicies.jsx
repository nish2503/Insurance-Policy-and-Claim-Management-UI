import { useEffect, useState } from "react";

import {
  getPolicies,
  getPoliciesByStatus,
  cancelPolicy,
} from "../../api/policyApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Button from "../../components/common/Button";

import PolicyDetailsModal from "../../components/common/PolicyDetailsModal";

function AdminPolicies() {
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, [status]);

  async function loadPolicies() {

    setLoading(true);

    console.log("Status =", status);

    try {
      let res;

      if (status === "ALL") {

  console.log("Calling getPolicies");

  res = await getPolicies();

} else {

  console.log("Calling getPoliciesByStatus", status);

  res = await getPoliciesByStatus(status);

}

      setPolicies(res.data.records || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(policy) {
    if (!window.confirm(`Cancel policy ${policy.policyNumber}?`)) return;

    try {
      await cancelPolicy(policy.policyId);

      loadPolicies();
    } catch (err) {
      console.log(err);

      alert("Unable to cancel policy.");
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
      <Card title="Policies">
        <BackButton />

        <DataTable
          columns={[
            {
              key: "policyNumber",

              label: "Policy No.",
            },

            {
              key: "customerName",

              label: "Customer",
            },

            {
              key: "planName",

              label: "Plan",
            },

            {
              key: "productType",

              label: "Product",
            },

            {
              key: "premiumAmount",

              label: "Premium",
            },

            {
              key: "policyStatus",

              label: "Status",

              render: (policy) => <StatusBadge status={policy.policyStatus} />,
            },

            {
              key: "actions",

              label: "Actions",

              render: (policy) => (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);

                      setShowModal(true);
                    }}
                  >
                    View
                  </Button>

                  {policy.policyStatus !== "CANCELLED" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(policy)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={policies}
          searchKeys={["policyNumber", "customerName", "planName"]}
          searchPlaceholder="Search policies..."
          headerActions={
            <StatusFilter
              value={status}
              onChange={setStatus}
              options={[
                {
                  value: "ALL",

                  label: "All Status",
                },

                {
                  value: "PENDING_PAYMENT",

                  label: "Pending Payment",
                },

                {
                  value: "ACTIVE",

                  label: "Active",
                },

                {
                  value: "EXPIRED",

                  label: "Expired",
                },

                {
                  value: "CANCELLED",

                  label: "Cancelled",
                },
              ]}
            />
          }
        />

        {!policies.length && <EmptyState message="No Policies Found" />}
      </Card>

      <PolicyDetailsModal
        show={showModal}
        policy={selectedPolicy}
        onClose={() => {
          setShowModal(false);

          setSelectedPolicy(null);
        }}
      />
    </DashboardLayout>
  );
}

export default AdminPolicies;
