import { useNavigate } from "react-router-dom";
import ThemeButton from "../../components/common/ThemeButton";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="linear-landing-root">
      <style>{`
        .linear-landing-root {
          min-height: 100vh !important;
          background-color: var(--bg-main) !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: relative !important;
          overflow-x: hidden !important;
          padding: 60px 40px !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 40px !important;
          transition: background-color 0.3s ease !important;
        }

        .floating-theme-dock {
          position: absolute !important;
          top: 30px !important;
          right: 30px !important;
          z-index: 1000 !important;
          width: 140px !important;
        }

        /* --- TOP COMPONENT: The Interactive Portal Key Card --- */
        .gateway-auth-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 24px !important;
          padding: 40px 35px !important;
          width: 100% !important;
          max-width: 520px !important;
          text-align: center !important;
          box-shadow: var(--card-shadow) !important;
          z-index: 10 !important;
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .gateway-logo-icon {
          width: 56px !important;
          height: 56px !important;
          background: linear-gradient(135deg, #2563eb, #8b5cf6) !important;
          border-radius: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 24px !important;
          color: white !important;
          margin: 0 auto 20px auto !important;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3) !important;
        }

        .gateway-auth-card h1 {
          font-size: 1.7rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin: 0 0 8px 0 !important;
        }

        .gateway-auth-card p {
          color: var(--text-muted) !important;
          font-size: 0.95rem !important;
          line-height: 1.4 !important;
          margin: 0 0 28px 0 !important;
        }

        .auth-buttons-stack {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
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
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.35) !important;
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
          font-size: 0.82rem !important;
          color: var(--text-muted) !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          margin-top: 20px !important;
          transition: color 0.2s ease !important;
        }

        .portal-meta-link:hover {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        /* --- BOTTOM COMPONENTS ROW: Single Horizontal Line Layout --- */
        .features-horizontal-row {
          max-width: 1200px !important;
          width: 100% !important;
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important; /* Forces 4 cards into 1 horizontal line */
          gap: 20px !important;
          z-index: 10 !important;
          box-sizing: border-box !important;
        }

        @media (max-width: 991px) {
          .features-horizontal-row {
            grid-template-columns: repeat(2, 1fr) !important; /* 2x2 grid stack response for tablet viewports */
          }
        }

        @media (max-width: 575px) {
          .features-horizontal-row {
            grid-template-columns: 1fr !important; /* Single column stack response for narrow mobiles */
          }
        }

        .feature-bento-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 20px !important;
          padding: 24px !important;
          box-shadow: var(--card-shadow) !important;
          display: flex !important;
          flex-direction: column !important;
          transition: all 0.25s ease !important;
        }

        .feature-bento-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(37, 99, 235, 0.2) !important;
        }

        .feature-icon-box {
          width: 44px !important;
          height: 44px !important;
          background: var(--bg-main) !important;
          border: 1px solid var(--border-color) !important;
          color: #2563eb !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.25rem !important;
          margin-bottom: 16px !important;
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .feature-bento-card h3 {
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          margin: 0 0 6px 0 !important;
          transition: color 0.25s ease !important;
        }

        .feature-bento-card p {
          font-size: 0.82rem !important;
          color: var(--text-muted) !important;
          line-height: 1.4 !important;
          margin: 0 !important;
          transition: color 0.25s ease !important;
        }
      `}</style>

      {/* Floating Theme Controller Toggle */}
      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      {/* TOP PORTION: Centered Account Gateway Panel */}
      <div className="gateway-auth-card">
        <div className="gateway-logo-icon">🛡️</div>
        <h1>InsurTech System</h1>
        <p>Secure system access gateway point. Authenticate your network credentials or register an active account node.</p>
        
        <div className="auth-buttons-stack">
          <button className="btn-portal-primary" onClick={() => navigate("/login")}>
            <i className="bi bi-box-arrow-in-right"></i> Sign In to System
          </button>
          <button className="btn-portal-secondary" onClick={() => navigate("/register")}>
            <i className="bi bi-person-plus-fill"></i> Create Profile
          </button>
        </div>

        <button className="portal-meta-link" onClick={() => navigate("/forgot-password")}>
          Forgot password token keys? Recover access
        </button>
      </div>

      {/* BOTTOM PORTION: Single Horizontal Line Grid Layer */}
      <div className="features-horizontal-row">
        
        {/* Card 1: Products */}
        <div className="feature-bento-card">
          <div className="feature-icon-box">
            <i className="bi bi-shield-shaded"></i>
          </div>
          <h3>Products</h3>
          <p>Review comprehensive coverage parameters, explore standard tiers, and track corporate insurance profiles.</p>
        </div>

        {/* Card 2: Plans */}
        <div className="feature-bento-card">
          <div className="feature-icon-box">
            <i className="bi bi-card-checklist"></i>
          </div>
          <h3>Plans</h3>
          <p>Compare algorithmic micro-payment structures, premium variables, and dynamic protective allocations.</p>
        </div>

        {/* Card 3: Claims */}
        <div className="feature-bento-card">
          <div className="feature-icon-box">
            <i className="bi bi-activity"></i>
          </div>
          <h3>Claims Engine</h3>
          <p>Submit incident claim files directly to verification queues for automated auditing processes.</p>
        </div>

        {/* Card 4: Policies */}
        <div className="feature-bento-card">
          <div className="feature-icon-box">
            <i className="bi bi-file-earmark-text"></i>
          </div>
          <h3>Policies</h3>
          <p>Inspect policy indices, declarations, payment status matrices, and active coverage periods.</p>
        </div>

      </div>
    </div>
  );
}

export default Home;
