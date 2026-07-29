import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/common/DashboardCard";
import Loader from "../../components/common/Loader";
import {
  getMyProfile,
  getMyClaims,
  getMyPolicies,
  getMyPremiumPayments,
} from "../../api/customerApi";

function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const claimRes = await getMyClaims();
      const policyRes = await getMyPolicies();
      const paymentRes = await getMyPremiumPayments();

      // 🛠️ FIXED: Safe sub-object data mapping extracts full name cleanly
      const profileData = profileRes.data;
      setProfile({
        ...profileData,
        fullName: profileData?.user?.fullName || profileData?.fullName || "Valued Customer"
      });
      
     // 3. 🛠️ FIX THE POLICIES: Fallback through standard array structures
      const policyData = policyRes.data;
      const unpackedPolicies = policyData?.records || policyData?.content || (Array.isArray(policyData) ? policyData : []);
      setPolicies(unpackedPolicies);

      // 4. 🛠️ FIX THE CLAIMS: Fallback through standard array structures
      const claimData = claimRes.data;
      const unpackedClaims = claimData?.records || claimData?.content || (Array.isArray(claimData) ? claimData : []);
      setClaims(unpackedClaims);

      // 5. 🛠️ FIX THE PAYMENTS: Fallback through standard array structures
      const paymentData = paymentRes.data;
      const unpackedPayments = paymentData?.records || paymentData?.content || (Array.isArray(paymentData) ? paymentData : []);
      setPayments(unpackedPayments);
    } catch (error) {
      if (error.response?.status === 404) {
         setProfile(null);
      }
      console.error("Dashboard dataset re-hydration error:", error);
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

  const pendingPremiumTotal = payments
    .filter((p) => p.paymentStatus === "PENDING" || p.status === "PENDING")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          {/* 🛠️ HUMANISTIC TEXT TRANSLATION */}
          <h2>Welcome, {profile?.fullName || "Valued Customer"} 👋</h2>
          <p>Here is an overview of your active protection plans and pending claim status history.</p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="Profile Status"
              count="Active Account"
              variant="success"
              onClick={() => navigate("/customer/profile")}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="My Policies"
              count={policies.length}
              variant="primary"
              onClick={() => navigate("/customer/policies")}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="Claims Filed"
              count={claims.length}
              variant="info"
              onClick={() => navigate("/customer/claims")}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard
              title="Premium Due"
              count={`₹${pendingPremiumTotal.toLocaleString()}`}
              variant="warning"
              onClick={() => navigate("/customer/premium-payments")}
            />
          </div>
        </div>

        <h3 className="dashboard-section-title">Quick Portals</h3>
        <div className="dashboard-action-grid">
          <Link to="/customer/products" className="dashboard-action-card">
            <div className="dashboard-action-icon">🛡️</div>
            <h5>Browse Plans</h5>
            <p>Explore comprehensive risk coverage layouts and premium plans.</p>
          </Link>

          <Link to="/customer/policies" className="dashboard-action-card">
            <div className="dashboard-action-icon">📄</div>
            <h5>My Policies</h5>
            <p>View your active insurance plans and check due dates.</p>
          </Link>

          <Link to="/customer/premium-payments" className="dashboard-action-card">
            <div className="dashboard-action-icon">💳</div>
            <h5>Pay Premium</h5>
            <p>Make a fast, secure payment on an outstanding premium cycle.</p>
          </Link>

          <Link to="/customer/claims" className="dashboard-action-card">
            <div className="dashboard-action-icon">📥</div>
            <h5>My Claims</h5>
            <p>Track historical settlement tickets or open a new claim file.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;