import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice"; // Adjust if authSlice path differs
import ThemeButton from "../common/ThemeButton";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar-wrapper">
      <style>{`
        .sidebar-wrapper {
          width: 260px !important;
          background: var(--panel-bg) !important;
          min-height: 100vh !important;
          padding: 30px 20px !important;
          display: flex !important;
          flex-direction: column !important;
          border-right: 1px solid var(--border-color) !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          z-index: 1100 !important;
          transition: background-color 0.3s ease, border-color 0.3s ease !important;
        }

        .sidebar-brand {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 24px !important;
          padding-left: 12px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .sidebar-brand span {
          background: linear-gradient(135deg, #2563eb, #8b5cf6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        .sidebar-theme-block {
          padding: 0 4px !important;
          margin-bottom: 28px !important;
        }

        .sidebar-nav-group {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          flex-grow: 1 !important;
          margin-bottom: 80px !important;
          overflow-y: auto !important; /* Ensures long menus remain scrollable */
        }

        .sidebar-link {
          display: flex !important;
          align-items: center !important;
          padding: 12px 16px !important;
          color: var(--text-muted) !important;
          text-decoration: none !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          border-radius: 12px !important;
          transition: all 0.2s ease !important;
          gap: 12px !important;
        }

        .sidebar-link:hover {
          background: rgba(37, 99, 235, 0.05) !important;
          color: var(--text-main) !important;
          transform: translateX(4px) !important;
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3) !important;
        }

        .sidebar-logout-footer {
          position: absolute !important;
          bottom: 25px !important;
          left: 20px !important;
          width: calc(100% - 40px) !important;
          border-top: 1px solid var(--border-color) !important;
          padding-top: 20px !important;
        }

        .btn-sidebar-logout {
          width: 100% !important;
          background: rgba(239, 68, 68, 0.08) !important;
          color: #ef4444 !important;
          border: 1px solid rgba(239, 68, 68, 0.15) !important;
          padding: 12px !important;
          border-radius: 12px !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          transition: all 0.2s ease !important;
        }

        .btn-sidebar-logout:hover {
          background: #ef4444 !important;
          color: #ffffff !important;
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25) !important;
        }
      `}</style>

      <div className="sidebar-brand">
        🛡️ <span>InsurTech UI</span>
      </div>

      <div className="sidebar-theme-block">
        <ThemeButton />
      </div>

      <div className="sidebar-nav-group">
        {/* --- 👑 ADMIN NAVIGATION CHANNELS --- */}
        {role === "ADMIN" && (
          <>
            <Link
              to="/admin"
              className={`sidebar-link ${isActive("/admin") ? "active" : ""}`}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/admin/customers"
              className={`sidebar-link ${isActive("/admin/customers") ? "active" : ""}`}
            >
              👥 Customers
            </Link>

            <Link
              to="/admin/products"
              className={`sidebar-link ${isActive("/admin/products") ? "active" : ""}`}
            >
              📦 Products
            </Link>

            <Link
              to="/admin/plans"
              className={`sidebar-link ${isActive("/admin/plans") ? "active" : ""}`}
            >
              📋 Plans
            </Link>

            <Link
              to="/admin/policies"
              className={`sidebar-link ${isActive("/admin/policies") ? "active" : ""}`}
            >
              📄 Policies
            </Link>

            <Link
              to="/admin/claims"
              className={`sidebar-link ${isActive("/admin/claims") ? "active" : ""}`}
            >
              🚑 Claims
            </Link>

            <Link
              to="/admin/payments"
              className={`sidebar-link ${isActive("/admin/payments") ? "active" : ""}`}
            >
              💳 Payments
            </Link>

            <Link
              to="/admin/agents"
              className={`sidebar-link ${isActive("/admin/agents") ? "active" : ""}`}
            >
              🧑‍💼 Agents
            </Link>
          </>
        )}

        {/* --- ⚡ AGENT NAVIGATION CHANNELS (RESTORED & FIXED) --- */}
        {role === "AGENT" && (
          <>
            <Link
              to="/agent"
              className={`sidebar-link ${isActive("/agent") ? "active" : ""}`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/agent/customers"
              className={`sidebar-link ${isActive("/agent/customers") ? "active" : ""}`}
            >
              👥 Customers
            </Link>
            <Link
              to="/agent/issue-policy"
              className={`sidebar-link ${isActive("/agent/issue-policy") ? "active" : ""}`}
            >
              ✍️ Issue Policy
            </Link>
            <Link
              to="/agent/policies"
              className={`sidebar-link ${isActive("/agent/policies") ? "active" : ""}`}
            >
              📄 Policies
            </Link>
            <Link
              to="/agent/review-claims"
              className={`sidebar-link ${isActive("/agent/review-claims") ? "active" : ""}`}
            >
              🚑 Claims Queue
            </Link>
            <Link
              to="/agent/payments"
              className={`sidebar-link ${isActive("/agent/payments") ? "active" : ""}`}
            >
              💳 Payments
            </Link>
          </>
        )}

        {/* --- 👤 CUSTOMER NAVIGATION CHANNELS --- */}
        {role === "CUSTOMER" && (
          <>
            <Link
              to="/customer"
              className={`sidebar-link ${isActive("/customer") ? "active" : ""}`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/customer/profile"
              className={`sidebar-link ${isActive("/customer/profile") ? "active" : ""}`}
            >
              👤 My Profile
            </Link>
            <Link
              to="/customer/products"
              className={`sidebar-link ${isActive("/customer/products") ? "active" : ""}`}
            >
              🔍 Browse Products
            </Link>
            <Link
              to="/customer/policies"
              className={`sidebar-link ${isActive("/customer/policies") ? "active" : ""}`}
            >
              📄 My Policies
            </Link>
            <Link
              to="/customer/claims"
              className={`sidebar-link ${isActive("/customer/claims") ? "active" : ""}`}
            >
              🩹 My Claims
            </Link>
            <Link
              to="/customer/premium-payments"
              className={`sidebar-link ${isActive("/customer/premium-payments") ? "active" : ""}`}
            >
              💳 Payments
            </Link>
            <Link
              to="/customer/raise-claim"
              className={`sidebar-link ${isActive("/customer/raise-claim") ? "active" : ""}`}
            >
              🚑 Raise Claim
            </Link>
          </>
        )}
      </div>

      <div className="sidebar-logout-footer">
        <button className="btn-sidebar-logout" onClick={handleLogout}>
          🚪 logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
