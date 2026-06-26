function EmptyState({ message = "No Data Found" }) {
  return (
    <div className="modern-empty-wrapper">
      <style>{`
        .modern-empty-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 60px 40px !important;
          text-align: center !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }

        .empty-graphic-ring {
          width: 56px !important;
          height: 56px !important;
          background: var(--bg-main) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.5rem !important;
          color: var(--text-muted) !important;
          margin-bottom: 16px !important;
          box-shadow: var(--card-shadow) !important;
          transition: all 0.25s ease !important;
        }

        .modern-empty-wrapper h4 {
          font-size: 1rem !important;
          font-weight: 600 !important;
          color: var(--text-main) !important;
          margin: 0 0 6px 0 !important;
          transition: color 0.25s ease !important;
        }

        .modern-empty-wrapper p {
          font-size: 0.85rem !important;
          color: var(--text-muted) !important;
          margin: 0 !important;
          max-width: 280px !important;
          line-height: 1.4 !important;
          transition: color 0.25s ease !important;
        }
      `}</style>

      <div className="empty-graphic-ring">
        <i className="bi bi-folder-x"></i>
      </div>
      <h4>{message}</h4>
      <p>
        The requested directory matrix node currently holds zero verified
        datasets inside this tracking branch queue.
      </p>
    </div>
  );
}

export default EmptyState;
