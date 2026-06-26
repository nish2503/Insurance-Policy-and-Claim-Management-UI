import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="modern-navbar-wrapper">
      {/* 🚀 Sleek glass navbar paneling to override traditional Bootstrap branding */}
      <style>{`
        .modern-navbar-wrapper {
          background: rgba(15, 23, 42, 0.6) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 14px 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 1000 !important;
        }

        .nav-branding-title {
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          letter-spacing: -0.01em !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .nav-controls-box {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
        }

        /* Upgraded premium minimalist logout interactive component */
        .btn-modern-logout {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444 !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          padding: 8px 16px !important;
          border-radius: 10px !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .btn-modern-logout:hover {
          background: #ef4444 !important;
          color: #ffffff !important;
          box-shadow: 0 8px 20px -6px rgba(239, 68, 68, 0.4) !important;
        }
      `}</style>

      {/* Brand Identification Left Block */}
      <div className="nav-branding-title">
        🛡️ Insurance System Terminal
      </div>

      {/* Utility Integration Action Block */}
      <div className="nav-controls-box">
        <ThemeToggle />
        <button className="btn-modern-logout" onClick={handleLogout}>
          Exit System
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
