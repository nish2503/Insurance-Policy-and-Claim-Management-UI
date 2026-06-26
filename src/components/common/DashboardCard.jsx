import { useNavigate } from "react-router-dom";

function DashboardCard({ title, count, variant }) {
  const navigate = useNavigate();

  const getAccentColor = () => {
    switch (variant) {
      case "success":
        return "#10b981";
      case "primary":
        return "#3b82f6";
      case "info":
        return "#06b6d4";
      case "warning":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="modern-metric-card">
      {/* 🚀 Tied directly to var(--panel-bg) to swap colors dynamically */}
      <style>{`
        .modern-metric-card {
          background: var(--panel-bg) !important; /* ☀️ Fixed: Swaps from dark slate to white */
          border: 1px solid var(--border-color) !important;
          padding: 24px !important;
          border-radius: 16px !important;
          box-shadow: var(--card-shadow) !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          min-height: 140px !important;
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .modern-metric-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .metric-title {
          font-size: 0.85rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--text-muted) !important; /* ☀️ Fixed: Shifts readability across modes */
          font-weight: 600 !important;
          margin: 0 !important;
          transition: color 0.25s ease !important;
        }

        .metric-count {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important; /* ☀️ Fixed: Turns charcoal in light mode */
          margin-top: 12px !important;
          margin-bottom: 0 !important;
          letter-spacing: -0.02em !important;
          transition: color 0.25s ease !important;
        }

        .metric-indicator-line {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          height: 4px !important;
          width: 100% !important;
        }
      `}</style>

      <div>
        <p className="metric-title">{title}</p>
        <h4 className="metric-count">{count}</h4>
      </div>

      <div
        className="metric-indicator-line"
        style={{ background: getAccentColor() }}
      />
    </div>
  );
}

export default DashboardCard;
