function Card({ title, children }) {
  return (
    <div className="custom-system-card">
      {/* 🚀 Maps internal section containers safely to the reactive theme variable array */}
      <style>{`
        .custom-system-card {
          background: var(--panel-bg) !important; /* ☀️ Fixed: Flips from dark panel to white background */
          border: 1px solid var(--border-color) !important;
          border-radius: 16px !important;
          padding: 28px !important;
          box-shadow: var(--card-shadow) !important;
          color: var(--text-main) !important;
          margin-top: 25px !important;
          transition: all 0.25s ease !important;
        }

        .card-heading-title {
          font-size: 1.2rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          margin-bottom: 20px !important;
          letter-spacing: -0.01em !important;
          transition: color 0.25s ease !important;
        }
      `}</style>

      {title && <h4 className="card-heading-title">{title}</h4>}

      <div className="card-body-content">{children}</div>
    </div>
  );
}

export default Card;
