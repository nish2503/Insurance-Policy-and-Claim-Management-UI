import Sidebar from "../layout/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="app-layout-wrapper">
      <style>{`
        .app-layout-wrapper {
          display: flex !important;
          width: 100% !important;
          min-height: 100vh !important;
          background-color: var(--bg-main) !important; /* ☀️ Handles the main background toggle */
          transition: background-color 0.25s ease !important;
        }

        .main-content-area {
          flex-grow: 1 !important;
          margin-left: 260px !important; 
          padding: 32px !important;
          width: calc(100% - 260px) !important;
          min-width: 0 !important; 
          box-sizing: border-box !important;
        }

        /* 🔄 Clean universal rule mapping any lingering un-styled headings or text elements */
        .main-content-area h1,
        .main-content-area h2,
        .main-content-area h3,
        .main-content-area h4,
        .main-content-area h5,
        .main-content-area h6 {
          color: var(--text-main) !important;
          transition: color 0.25s ease !important;
        }

        .main-content-area p {
          color: var(--text-muted) !important;
          transition: color 0.25s ease !important;
        }
      `}</style>

      <Sidebar />

      <main className="main-content-area">{children}</main>
    </div>
  );
}

export default DashboardLayout;
