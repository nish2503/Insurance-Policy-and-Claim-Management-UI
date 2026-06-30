import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyClaims } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const res = await getMyClaims();
      setClaims(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      console.log(error);
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
      <Card title="My Claims">
        <BackButton />

        {claims.length ? (
          <DataTable
            columns={[
              {
                key: "claimNumber",
                label: "Claim Number",
              },
              {
                key: "policyNumber",
                label: "Policy",
              },
              {
                key: "claimAmount",
                label: "Amount",
              },
              {
                key: "claimReason",
                label: "Reason",
              },
              {
                key: "claimStatusCustom",
                label: "Status",
              },
            ]}
            data={claims.map((c) => ({
              ...c,
              claimAmount: `₹${c.claimAmount}`,
              claimStatusCustom: <StatusBadge status={c.claimStatus} />,
            }))}
            searchKeys={[
              "claimNumber", 
              "policyNumber", 
              "claimReason",
              "claimStatus" // Embedded Status search filter capability
            ]}
          />
        ) : (
          <EmptyState message="No Claims Found" />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default MyClaims;
