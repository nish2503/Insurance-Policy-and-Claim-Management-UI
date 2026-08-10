import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import DashboardCard from "../../components/common/DashboardCard";
import { getInternalStaffClaims, reviewClaim } from "../../api/internalStaffApi";

function InternalStaffDashboard() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      setLoading(true);
      const res = await getInternalStaffClaims();
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
      remarks: "Documents verified",
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

  const pendingClaims = claims.filter((c) => c.status === "PENDING");

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <h2>Internal Staff Processing Center ⚡</h2>
          <p>
            Reviewing and auditing incoming policy claims pending manual
            security clearance confirmation.
          </p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="Claims in Queue"
              count={claims.length}
              variant="primary"
              icon="bi-inbox"
              onClick={() => navigate("/internal-staff/review-claims")}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="Pending Verification"
              count={pendingClaims.length}
              variant="warning"
              icon="bi-hourglass-split"
              onClick={() => navigate("/internal-staff/review-claims")}
            />
          </div>
        </div>

        <h3 className="dashboard-section-title">Quick Portals</h3>
        <div className="dashboard-action-grid">
          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/internal-staff/review-claims")}>
            <div className="dashboard-action-icon">✅</div>
            <h5>Review Claims</h5>
            <p>Work through the queue of claims awaiting a recommendation.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/internal-staff/customers")}>
            <div className="dashboard-action-icon">👥</div>
            <h5>Customers</h5>
            <p>Look up customer accounts across the system.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/internal-staff/policies")}>
            <div className="dashboard-action-icon">📄</div>
            <h5>Policies</h5>
            <p>View issued policies and their current status.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/internal-staff/payments")}>
            <div className="dashboard-action-icon">💳</div>
            <h5>Premium Payments</h5>
            <p>Track premium payment activity across your policies.</p>
          </div>
        </div>

        <Card title="Claims Verification Queue">
          <DataTable
            emptyMessage="No Pending Claims in Verification Queue"
            columns={[
              { key: "id", label: "Claim ID" },
              { key: "customerName", label: "Customer" },
              { key: "policyNumber", label: "Policy" },
              {
                key: "status",
                label: "Status",
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <Button onClick={() => handleReview(row.id)}>
                    Review Verification
                  </Button>
                ),
              },
            ]}
            data={pendingClaims}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default InternalStaffDashboard;