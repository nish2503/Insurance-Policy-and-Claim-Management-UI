import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 🛠️ FIX: Added missing link router engine anchor import

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyPolicies } from "../../api/customerApi";
import ExportPdfButton from "../../components/common/ExportPdfButton";

function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const res = await getMyPolicies();
      setPolicies(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      console.error("Failed to re-hydrate customer policies ledger matrix:", error);
    } finally {
      setLoading(false);
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
      <Card title="My Policies">
        <BackButton />

        {policies.length ? (
          <DataTable
            columns={[
              {
                key: "policyNumber",
                label: "Policy Number",
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
                key: "policyStatusCustom",
                label: "Status",
              },
              {
                key: "coverageAmount",
                label: "Coverage",
              },
            ]}
            data={policies.map((p) => ({
              ...p,
              coverageAmount: `₹${Number(p.coverageAmount).toLocaleString()}`,
              premiumAmount: `₹${Number(p.premiumAmount).toLocaleString()} (${p.premiumType || "Annual"})`,
              policyStatusCustom: <StatusBadge status={p.policyStatus} />
            }))}
            searchKeys={[
              "policyNumber",
              "planName",
              "productType",
              "policyStatus",
            ]}
            headerActions={
              <ExportPdfButton
                title="My Policies"
                rows={policies}
                columns={[
                  { label: "Policy Number", key: "policyNumber" },
                  { label: "Plan", key: "planName" },
                  { label: "Product", key: "productType" },
                  {
                    label: "Premium",
                    value: (row) => `₹${row.premiumAmount} (${row.premiumType || "Annual"})`,
                  },
                  { label: "Status", key: "policyStatus" },
                  { label: "Coverage", value: (row) => `₹${row.coverageAmount}` },
                ]}
              />
            }
          />
        ) : (
          <EmptyState 
            message={
              <div className="text-center p-4 d-flex flex-column align-items-center justify-content-center">
                <div className="mb-2 text-muted fs-2">📄</div>
                <p className="text-muted mb-3 font-weight-medium">
                  You don't have any active insurance policies protecting your assets yet.
                </p>
                <Link to="/customer/products" className="btn btn-primary font-weight-bold shadow-sm px-4 py-2">
                  🛡️ Explore Available Insurance Plans
                </Link>
              </div>
            } 
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default MyPolicies;
