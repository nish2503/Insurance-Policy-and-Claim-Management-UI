import useTheme from "../../hooks/useTheme"; // 👈 Make sure this path correctly points to your useTheme hook!

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle-trigger" onClick={toggleTheme}>
      <style>{`
        .theme-toggle-trigger {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-main) !important;
          padding: 10px 16px !important;
          border-radius: 12px !important;
          cursor: pointer !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          width: 100% !important;
          box-shadow: var(--card-shadow) !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .theme-toggle-trigger:hover {
          transform: translateY(-1px) !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 8px 15px -4px rgba(59, 130, 246, 0.15) !important;
        }
      `}</style>
      
      {/* Uses your Bootstrap Icons import! */}
      {theme === "dark" ? (
        <>
          <i className="bi bi-sun-fill" style={{ color: "#f59e0b" }}></i>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <i className="bi bi-moon-stars-fill" style={{ color: "#6366f1" }}></i>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}

export default ThemeButton;
