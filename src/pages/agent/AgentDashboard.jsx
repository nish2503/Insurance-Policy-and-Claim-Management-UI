import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import { getAgentClaims, reviewClaim } from "../../api/agentApi";

function AgentDashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      setLoading(true);
      const res = await getAgentClaims();
      setClaims(res.data.records || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(id) {
    const data = {
      recommendedStatus: "APPROVED",
      remarks: "Documents verified"
    };

    try {
      await reviewClaim(id, data);
      loadClaims();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const pendingClaims = claims.filter(c => c.status === "PENDING");

  return (
    <DashboardLayout>
      <div className="agent-dashboard-container">
        
        <style>{`
          .agent-dashboard-container {
            font-family: 'Inter', system-ui, sans-serif !important;
            background-color: var(--bg-main) !important;
            transition: background-color 0.25s ease !important;
          }

          /* --- High-End Reactive Agent Welcome Banner --- */
          .agent-header-panel {
            background: var(--theme-header-gradient) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 20px !important;
            padding: 32px !important;
            margin-bottom: 30px !important;
            box-shadow: var(--card-shadow) !important;
            transition: all 0.25s ease !important;
          }

          .agent-header-panel h2 {
            color: var(--theme-header-text) !important;
            font-weight: 700 !important;
            font-size: 1.6rem !important;
            letter-spacing: -0.02em !important;
            margin: 0 0 6px 0 !important;
            transition: color 0.25s ease !important;
          }

          .agent-header-panel p {
            color: var(--theme-header-muted) !important;
            font-size: 0.95rem !important;
            margin: 0 !important;
            transition: color 0.25s ease !important;
          }

          .agent-dashboard-container .card, 
          .agent-dashboard-container div[class*="card"] {
            background: var(--panel-bg) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 16px !important;
            padding: 24px !important;
            box-shadow: var(--card-shadow) !important;
            color: var(--text-main) !important;
            transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease !important;
          }
        `}</style>

        <div className="agent-header-panel">
          <h2>Agent Processing Center ⚡</h2>
          <p>Reviewing and auditing incoming policy claims pending manual security clearance confirmation.</p>
        </div>

        <Card title="Claims Verification Queue">
          {pendingClaims.length > 0 ? (
            <DataTable
              columns={[
                { key: "id", label: "Claim ID" },
                { key: "customerName", label: "Customer" },
                { key: "policyNumber", label: "Policy" },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => <StatusBadge status={row.status} />
                },
                {
                  key: "action",
                  label: "Action",
                  render: (row) => (
                    <Button onClick={() => handleReview(row.id)}>
                      Review Verification
                    </Button>
                  )
                }
              ]}
              data={pendingClaims}
            />
          ) : (
            <EmptyState message="No Pending Claims in Verification Queue" />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AgentDashboard;
