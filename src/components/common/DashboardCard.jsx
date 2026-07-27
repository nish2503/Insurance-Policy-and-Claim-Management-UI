import { useNavigate } from "react-router-dom";

function DashboardCard({ title, count, variant, icon, onClick }) {
  const getAccentColor = () => {
    switch (variant) {
      case "success":
        return "var(--success, #10b981)";
      case "primary":
        return "var(--primary, #3b82f6)";
      case "info":
        return "#06b6d4";
      case "warning":
        return "var(--warning, #f59e0b)";
      case "danger":
        return "var(--danger, #ef4444)";
      default:
        return "var(--primary, #3b82f6)";
    }
  };

  const accent = getAccentColor();

  return (
    <div
      className="modern-metric-card"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
    >
      <style>{`
        .modern-metric-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          padding: 22px 24px !important;
          border-radius: 16px !important;
          box-shadow: var(--card-shadow) !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          min-height: 138px !important;
          position: relative !important;
          overflow: hidden !important;
          cursor: ${onClick ? "pointer" : "default"} !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .modern-metric-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
          border-color: ${accent}55 !important;
        }

        .modern-metric-card:focus-visible {
          outline: 2px solid ${accent} !important;
          outline-offset: 2px !important;
        }

        .metric-top-row {
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
        }

        .metric-icon-badge {
          width: 40px !important;
          height: 40px !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.05rem !important;
          background: ${accent}1a !important;
          color: ${accent} !important;
          flex-shrink: 0 !important;
        }

        .metric-title {
          font-size: 0.78rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          color: var(--text-muted) !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }

        .metric-count {
          font-size: 1.9rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          margin-top: 14px !important;
          margin-bottom: 0 !important;
          letter-spacing: -0.02em !important;
        }

        .metric-indicator-line {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          height: 4px !important;
          width: 100% !important;
          background: ${accent} !important;
        }
      `}</style>

      <div className="metric-top-row">
        <p className="metric-title">{title}</p>
        {icon && <div className="metric-icon-badge"><i className={`bi ${icon}`}></i></div>}
      </div>

      <h4 className="metric-count">{count}</h4>

      <div className="metric-indicator-line" />
    </div>
  );
}

export default DashboardCard;