import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/common/DashboardCard";
import Loader from "../../components/common/Loader";
import { getMyProfile, getMyClaims, getMyPolicies, getMyPremiumPayments } from "../../api/customerApi";

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

      setProfile(profileRes.data);
      setClaims(claimRes.data.records || []);
      setPolicies(policyRes.data.records || []);
      setPayments(paymentRes.data || []);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/customer/create-profile");
      }
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

  const pendingPremiumTotal = payments
    .filter(p => p.paymentStatus === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        
        <style>{`
          .dashboard-container {
            padding: 10px 0 !important;
            background-color: var(--bg-main) !important;
            font-family: 'Inter', system-ui, sans-serif !important;
            transition: background-color 0.25s ease !important;
          }

          /* --- High-End Reactive Welcome Banner --- */
          .dashboard-header {
            background: var(--theme-header-gradient) !important;
            padding: 40px !important;
            border-radius: 24px !important;
            margin-bottom: 35px !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: var(--card-shadow) !important;
            transition: all 0.25s ease !important;
          }

          .dashboard-header h2 {
            font-weight: 700 !important;
            font-size: 1.85rem !important;
            letter-spacing: -0.02em !important;
            margin-bottom: 8px !important;
            color: var(--theme-header-text) !important;
            transition: color 0.25s ease !important;
          }

          .dashboard-header p {
            color: var(--theme-header-muted) !important;
            font-size: 1rem !important;
            margin: 0 !important;
            transition: color 0.25s ease !important;
          }

          .dashboard-section h3 {
            font-weight: 700 !important;
            font-size: 1.35rem !important;
            color: var(--text-main) !important;
            letter-spacing: -0.01em !important;
            margin-bottom: 24px !important;
            transition: color 0.25s ease !important;
          }

          .action-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
            gap: 24px !important;
          }

          .action-card {
            background: var(--panel-bg) !important;
            padding: 30px 24px !important;
            border-radius: 16px !important;
            text-decoration: none !important;
            color: var(--text-main) !important;
            box-shadow: var(--card-shadow) !important;
            border: 1px solid var(--border-color) !important;
            display: flex !important;
            flex-direction: column !important;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          .action-card:hover {
            transform: translateY(-6px) !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.15) !important;
          }

          .action-icon-wrapper {
            width: 48px !important;
            height: 48px !important;
            border-radius: 12px !important;
            background: rgba(59, 130, 246, 0.1) !important;
            color: #3b82f6 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            margin-bottom: 20px !important;
            transition: all 0.2s ease !important;
          }

          .action-card:hover .action-icon-wrapper {
            background: #3b82f6 !important;
            color: #ffffff !important;
          }

          .action-card h5 {
            font-weight: 600 !important;
            font-size: 1.15rem !important;
            margin-bottom: 6px !important;
            color: var(--text-main) !important;
          }

          .action-card p {
            color: var(--text-muted) !important;
            font-size: 0.9rem !important;
            margin: 0 !important;
            line-height: 1.4 !important;
          }

          .profile-box {
            background: var(--panel-bg) !important;
            padding: 30px !important;
            border-radius: 16px !important;
            box-shadow: var(--card-shadow) !important;
            border: 1px solid var(--border-color) !important;
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 20px !important;
            transition: background-color 0.25s ease, border-color 0.25s ease !important;
          }

          .profile-field {
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
          }

          .profile-field span {
            font-size: 0.75rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            color: var(--text-muted) !important;
            font-weight: 600 !important;
          }

          .profile-field strong {
            font-size: 1.05rem !important;
            color: var(--text-main) !important;
            font-weight: 500 !important;
          }
        `}</style>

        <div className="dashboard-header">
          <h2>Welcome, {profile?.fullName || "Valued Customer"} 👋</h2>
          <p>Real-time analytics and overview of your active insurance protection asset portfolio.</p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard title="Profile Status" count="Active Account" variant="success" />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard title="My Policies" count={policies.length} variant="primary" />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard title="Claims Filed" count={claims.length} variant="info" />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <DashboardCard title="Premium Due" count={`$${pendingPremiumTotal.toLocaleString()}`} variant="warning" />
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Quick Portals</h3>
          <div className="action-grid">
            <Link to="/customer/products" className="action-card">
              <div className="action-icon-wrapper">🛡️</div>
              <h5>Browse Plans</h5>
              <p>Explore comprehensive risk coverage layouts and instant active solutions.</p>
            </Link>

            <Link to="/customer/policies" className="action-card">
              <div className="action-icon-wrapper">📄</div>
              <h5>My Policies</h5>
              <p>Inspect active policies guidelines, declarations, and coverage tables.</p>
            </Link>

            <Link to="/customer/premium-payments" className="action-card">
              <div className="action-icon-wrapper">💳</div>
              <h5>Pay Premium</h5>
              <p>Execute balance settlements secure via instant transactional pathways.</p>
            </Link>

            <Link to="/customer/raise-claim" className="action-card">
              <div className="action-icon-wrapper">🚑</div>
              <h5>Raise Claim</h5>
              <p>Submit claim assessments directly to the automated verification queue.</p>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Account Information</h3>
          <div className="profile-box">
            <div className="profile-field">
              <span>Full Name</span>
              <strong>{profile?.fullName}</strong>
            </div>
            <div className="profile-field">
              <span>Primary Email</span>
              <strong>{profile?.email}</strong>
            </div>
            <div className="profile-field">
              <span>Contact Number</span>
              <strong>{profile?.mobileNumber}</strong>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;
