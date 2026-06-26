import { useNavigate } from "react-router-dom";
import ThemeButton from "../../components/common/ThemeButton";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="auth-viewport-root">
      <style>{`
        .auth-viewport-root {
          min-height: 100vh !important;
          background-color: var(--bg-main) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: relative !important;
          padding: 20px !important;
          transition: background-color 0.3s ease !important;
        }

        .floating-theme-dock {
          position: absolute !important;
          top: 30px !important;
          right: 30px !important;
          z-index: 1000 !important;
          width: 140px !important;
        }

        .error-panel-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 24px !important;
          padding: 50px 40px !important;
          width: 100% !important;
          max-width: 460px !important;
          text-align: center !important;
          box-shadow: var(--card-shadow) !important;
          transition: all 0.25s ease !important;
        }

        .error-code-badge {
          font-size: 3.5rem !important;
          font-weight: 800 !important;
          line-height: 1 !important;
          background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          margin-bottom: 14px !important;
          letter-spacing: -0.04em !important;
        }

        .error-panel-card h3 {
          font-size: 1.35rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          margin-bottom: 10px !important;
          letter-spacing: -0.01em !important;
        }

        .error-panel-card p {
          color: var(--text-muted) !important;
          font-size: 0.95rem !important;
          line-height: 1.5 !important;
          margin-bottom: 30px !important;
        }

        .btn-return-home {
          background: var(--bg-main) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
          padding: 12px 24px !important;
          border-radius: 12px !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .btn-return-home:hover {
          background: var(--border-color) !important;
          transform: translateY(-1px) !important;
        }
      `}</style>

      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      <div className="error-panel-card">
        <div className="error-code-badge">403</div>
        <h3>Access Blocked</h3>
        <p>Your authentication token layer lacks the security clearance parameters required to access this system panel path.</p>
        
        <button className="btn-return-home" onClick={() => navigate("/")}>
          <i className="bi bi-house-door-fill"></i> Go Back Home
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
