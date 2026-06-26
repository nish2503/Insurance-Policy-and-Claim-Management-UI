import { useNavigate } from "react-router-dom";
import ThemeButton from "../../components/common/ThemeButton"; // Adjust path if needed

function Home() {
  const navigate = useNavigate();

  return (
    <div className="auth-landing-root">
      {/* 🚀 Variables hooked straight into ThemeProvider color maps */}
      <style>{`
        .auth-landing-root {
          min-height: 100vh !important;
          background-color: var(--bg-main) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: relative !important;
          overflow: hidden !important;
          padding: 20px !important;
          transition: background-color 0.3s ease !important;
        }

        /* Accent radial flare depth circle */
        .auth-landing-root::before {
          content: '' !important;
          position: absolute !important;
          top: -20% !important;
          left: -10% !important;
          width: 600px !important;
          height: 600px !important;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, rgba(0,0,0,0) 70%) !important;
          pointer-events: none !important;
        }

        .floating-theme-dock {
          position: absolute !important;
          top: 30px !important;
          right: 30px !important;
          z-index: 1000 !important;
          width: 140px !important;
        }

        .landing-portal-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 24px !important;
          padding: 45px 35px !important;
          width: 100% !important;
          max-width: 460px !important;
          text-align: center !important;
          box-shadow: var(--card-shadow) !important;
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .portal-logo-icon {
          width: 64px !important;
          height: 64px !important;
          background: linear-gradient(135deg, #2563eb, #8b5cf6) !important;
          border-radius: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 28px !important;
          color: white !important;
          margin: 0 auto 24px auto !important;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3) !important;
        }

        .landing-portal-card h1 {
          font-size: 1.8rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 10px !important;
          transition: color 0.25s ease !important;
        }

        .landing-portal-card p {
          color: var(--text-muted) !important;
          font-size: 0.95rem !important;
          line-height: 1.5 !important;
          margin-bottom: 35px !important;
          transition: color 0.25s ease !important;
        }

        .auth-actions-vertical-stack {
          display: flex !important;
          flex-direction: column !important;
          gap: 14px !important;
        }

        .btn-portal-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
          color: #ffffff !important;
          border: none !important;
          padding: 14px !important;
          border-radius: 12px !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          transition: all 0.2s ease !important;
        }

        .btn-portal-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 25px -5px rgba(37, 99, 235, 0.4) !important;
        }

        .btn-portal-secondary {
          background: var(--bg-main) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
          padding: 14px !important;
          border-radius: 12px !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          transition: all 0.2s ease !important;
        }

        .btn-portal-secondary:hover {
          background: var(--border-color) !important;
          transform: translateY(-2px) !important;
        }

        .portal-meta-link {
          font-size: 0.85rem !important;
          color: var(--text-muted) !important;
          text-decoration: none !important;
          margin-top: 20px !important;
          display: inline-block !important;
          font-weight: 500 !important;
          border: none !important;
          background: transparent !important;
          cursor: pointer !important;
          transition: color 0.2s ease !important;
        }

        .portal-meta-link:hover {
          color: #3b82f6 !important;
        }
      `}</style>

      {/* Floating Theme Switch Link Wrapper */}
      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      {/* Main Framework Portal Card */}
      <div className="landing-portal-card">
        <div className="portal-logo-icon">🛡️</div>
        <h1>Insurance Management System</h1>
        <p>
          Welcome to the premium secure claims matrix routing pipeline.
          Authorize access or setup new credentials below.
        </p>

        <div className="auth-actions-vertical-stack">
          {/* Action route handling user entry */}
          <button
            className="btn-portal-primary"
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-box-arrow-in-right"></i> Sign In to Account
          </button>

          {/* Action route handling profile setup registration */}
          <button
            className="btn-portal-secondary"
            onClick={() => navigate("/register")}
          >
            <i className="bi bi-person-plus-fill"></i> Register New Account
          </button>
        </div>

        <button
          className="portal-meta-link"
          onClick={() => navigate("/forgot-password")}
        >
          Need password recovery? Click here
        </button>
      </div>
    </div>
  );
}

export default Home;
