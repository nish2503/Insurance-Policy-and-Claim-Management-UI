import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/common/DashboardCard";
import Loader from "../../components/common/Loader";

import { getProducts } from "../../api/productApi";
import { getCustomers } from "../../api/customerApi";
import { getPolicies } from "../../api/policyApi";
import { getClaims } from "../../api/claimApi";
import { getPlans } from "../../api/planApi";

const CLAIM_STAGES = [
  { key: "SUBMITTED", label: "Submitted", color: "var(--warning, #f59e0b)" },
  { key: "UNDER_REVIEW", label: "Under Review", color: "var(--primary, #3b82f6)" },
  { key: "RECOMMENDED_APPROVAL", label: "Recommended", color: "#06b6d4" },
  { key: "RECOMMENDED_REJECTION", label: "Recommended", color: "#06b6d4" },
  { key: "APPROVED", label: "Approved", color: "var(--success, #10b981)" },
  { key: "REJECTED", label: "Rejected", color: "var(--danger, #ef4444)" },
];

const POLICY_STAGES = [
  { key: "ACTIVE", label: "Active", color: "var(--success, #10b981)" },
  { key: "PENDING_PAYMENT", label: "Pending Payment", color: "var(--warning, #f59e0b)" },
  { key: "EXPIRED", label: "Expired", color: "#6b7280" },
  { key: "CANCELLED", label: "Cancelled", color: "var(--danger, #ef4444)" },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productRes, customerRes, policyRes, claimRes, planRes] =
        await Promise.all([
          getProducts(),
          getCustomers(),
          getPolicies(),
          getClaims(),
          getPlans(),
        ]);

      setProducts(productRes.data.records || []);
      setCustomers(customerRes.data.records || []);
      setPolicies(policyRes.data.records || []);
      setClaims(claimRes.data.records || []);
      setPlans(planRes.data.records || []);
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

  const pendingClaimsCount = claims.filter((c) =>
    ["SUBMITTED", "UNDER_REVIEW", "RECOMMENDED_APPROVAL", "RECOMMENDED_REJECTION"].includes(c.claimStatus)
  ).length;

  const claimBreakdown = CLAIM_STAGES.reduce((acc, stage) => {
    const existing = acc.find((s) => s.label === stage.label);
    const count = claims.filter((c) => c.claimStatus === stage.key).length;
    if (existing) {
      existing.count += count;
    } else if (count > 0 || !acc.some((s) => s.label === stage.label)) {
      acc.push({ label: stage.label, color: stage.color, count });
    }
    return acc;
  }, []).filter((s) => s.count > 0);

  const policyBreakdown = POLICY_STAGES.map((stage) => ({
    ...stage,
    count: policies.filter((p) => p.policyStatus === stage.key).length,
  })).filter((s) => s.count > 0);

  const totalClaims = claims.length || 1;
  const totalPolicies = policies.length || 1;

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <h2>Admin Overview 📊</h2>
          <p>
            {pendingClaimsCount > 0
              ? `${pendingClaimsCount} claim${pendingClaimsCount === 1 ? "" : "s"} waiting on a decision.`
              : "All claims are settled — nothing waiting on you right now."}
          </p>
        </div>

        <div className="row g-3">
          <div className="col-md-4 col-lg-2-4">
            <DashboardCard
              title="Products"
              count={products.length}
              variant="primary"
              icon="bi-box-seam"
              onClick={() => navigate("/admin/products")}
            />
          </div>
          <div className="col-md-4 col-lg-2-4">
            <DashboardCard
              title="Customers"
              count={customers.length}
              variant="info"
              icon="bi-people"
              onClick={() => navigate("/admin/customers")}
            />
          </div>
          <div className="col-md-4 col-lg-2-4">
            <DashboardCard
              title="Policies"
              count={policies.length}
              variant="success"
              icon="bi-file-earmark-text"
              onClick={() => navigate("/admin/policies")}
            />
          </div>
          <div className="col-md-4 col-lg-2-4">
            <DashboardCard
              title="Claims"
              count={claims.length}
              variant="warning"
              icon="bi-shield-exclamation"
              onClick={() => navigate("/admin/claims")}
            />
          </div>
          <div className="col-md-4 col-lg-2-4">
            <DashboardCard
              title="Plans"
              count={plans.length}
              variant="danger"
              icon="bi-clipboard-check"
              onClick={() => navigate("/admin/plans")}
            />
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-lg-6">
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h5>Claims Pipeline</h5>
                <span className="dash-panel-total">{claims.length} total</span>
              </div>

              {claimBreakdown.length ? (
                <>
                  <div className="dash-stack-bar">
                    {claimBreakdown.map((s) => (
                      <div
                        key={s.label}
                        style={{
                          width: `${(s.count / totalClaims) * 100}%`,
                          background: s.color,
                        }}
                        title={`${s.label}: ${s.count}`}
                      />
                    ))}
                  </div>
                  <div className="dash-legend">
                    {claimBreakdown.map((s) => (
                      <div className="dash-legend-item" key={s.label}>
                        <span className="dash-legend-dot" style={{ background: s.color }} />
                        {s.label} · {s.count}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="dash-empty-note">No claims submitted yet.</p>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h5>Policy Book</h5>
                <span className="dash-panel-total">{policies.length} total</span>
              </div>

              {policyBreakdown.length ? (
                <>
                  <div className="dash-stack-bar">
                    {policyBreakdown.map((s) => (
                      <div
                        key={s.label}
                        style={{
                          width: `${(s.count / totalPolicies) * 100}%`,
                          background: s.color,
                        }}
                        title={`${s.label}: ${s.count}`}
                      />
                    ))}
                  </div>
                  <div className="dash-legend">
                    {policyBreakdown.map((s) => (
                      <div className="dash-legend-item" key={s.label}>
                        <span className="dash-legend-dot" style={{ background: s.color }} />
                        {s.label} · {s.count}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="dash-empty-note">No policies issued yet.</p>
              )}
            </div>
          </div>
        </div>

        <h3 className="dashboard-section-title">Quick Portals</h3>
        <div className="dashboard-action-grid">
          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/admin/claims")}>
            <div className="dashboard-action-icon">✅</div>
            <h5>Review Claims</h5>
            <p>Make final approve/reject decisions on claims awaiting sign-off.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/admin/internal-staff")}>
            <div className="dashboard-action-icon">🧑‍💼</div>
            <h5>Manage Agents</h5>
            <p>Create, edit, and reassign internal staff to product lines.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/admin/products")}>
            <div className="dashboard-action-icon">➕</div>
            <h5>Add Product</h5>
            <p>Publish a new insurance product to the catalog.</p>
          </div>

          <div className="dashboard-action-card" role="button" tabIndex={0} onClick={() => navigate("/admin/plans")}>
            <div className="dashboard-action-icon">📝</div>
            <h5>Add Plan</h5>
            <p>Create a new coverage plan under an existing product.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;