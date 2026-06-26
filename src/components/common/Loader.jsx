function Loader() {
  return (
    <div className="modern-loader-wrapper">
      <style>{`
        .modern-loader-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 50px 20px !important;
          width: 100% !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }

        .fintech-spinner-circle {
          width: 40px !important;
          height: 40px !important;
          border: 3px solid rgba(59, 130, 246, 0.1) !important;
          border-top: 3px solid #3b82f6 !important; /* Premium electric blue spinner head */
          border-radius: 50% !important;
          animation: spin-matrix 0.8s linear infinite !important;
          margin-bottom: 16px !important;
        }

        .modern-loader-wrapper p {
          font-size: 0.88rem !important;
          font-weight: 600 !important;
          color: var(--text-muted) !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          margin: 0 !important;
          transition: color 0.25s ease !important;
        }

        @keyframes spin-matrix {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="fintech-spinner-circle"></div>
      <p>Syncing Ledger...</p>
    </div>
  );
}

export default Loader;
