// function Button({
//   children,
//   type = "button",
//   className = "",
//   onClick,
//   disabled,
// }) {
//   // If your code uses standard bootstrap tracking names, we intercept and blend them smoothly
//   const isDanger =
//     className.includes("btn-danger") || className.includes("danger");
//   const isSecondary =
//     className.includes("btn-secondary") ||
//     className.includes("secondary") ||
//     className.includes("outline");

//   const getButtonStyles = () => {
//     if (isDanger) {
//       return `
//         background: rgba(239, 68, 68, 0.1) !important;
//         color: #ef4444 !important;
//         border: 1px solid rgba(239, 68, 68, 0.2) !important;
//       `;
//     }
//     if (isSecondary) {
//       return `
//         background: var(--bg-main) !important;
//         color: var(--text-main) !important;
//         border: 1px solid var(--border-color) !important;
//       `;
//     }
//     // Default FinTech Electric Indigo Primary Style Choice
//     return `
//       background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
//       color: #ffffff !important;
//       border: none !important;
//     `;
//   };

//   return (
//     <button
//       type={type}
//       className={`modern-action-trigger ${className}`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       <style>{`
//         .modern-action-trigger {
//           ${getButtonStyles()}
//           padding: 10px 20px !important;
//           border-radius: 10px !important;
//           font-size: 0.88rem !important;
//           font-weight: 600 !important;
//           cursor: pointer !important;
//           display: inline-flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           gap: 8px !important;
//           font-family: 'Inter', system-ui, sans-serif !important;
//           transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
//         }

//         .modern-action-trigger:hover:not(:disabled) {
//           transform: translateY(-2px) !important;
//           box-shadow: ${isDanger ? "0 10px 15px -3px rgba(239, 68, 68, 0.25)" : "0 10px 15px -3px rgba(37, 99, 235, 0.25)"} !important;
//           filter: brightness(1.05) !important;
//         }

//         .modern-action-trigger:active:not(:disabled) {
//           transform: translateY(0) !important;
//         }

//         .modern-action-trigger:disabled {
//           opacity: 0.5 !important;
//           cursor: not-allowed !important;
//         }
//       `}</style>
//       {children}
//     </button>
//   );
// }

// export default Button;

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
}) {
  const getStyles = () => {
    switch (variant) {
      case "danger":
        return `
          background: rgba(239, 68, 68, 0.12) !important;
          color: var(--danger) !important;
          border: 1px solid rgba(239,68,68,.25) !important;
        `;

      case "success":
        return `
          background: rgba(16, 185, 129, 0.12) !important;
          color: var(--success) !important;
          border: 1px solid rgba(16,185,129,.25) !important;
        `;

      case "secondary":
        return `
          background: var(--panel-bg) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
        `;

      default:
        return `
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-light)
          ) !important;

          color: white !important;

          border: none !important;
        `;
    }
  };

  const padding = size === "sm" ? "6px 12px" : "10px 20px";

  const fontSize = size === "sm" ? "0.8rem" : "0.9rem";

  return (
    <>
      <style>{`

        .modern-btn{

          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;

          ${getStyles()}

          padding:${padding};

          font-size:${fontSize};

          font-weight:600;

          border-radius:10px;

          cursor:pointer;

          transition:.2s;

          font-family:'Inter',sans-serif;

        }

        .modern-btn:hover:not(:disabled){

          transform:translateY(-2px);

          box-shadow:var(--card-shadow);

          filter:brightness(1.05);

        }

        .modern-btn:active:not(:disabled){

          transform:translateY(0);

        }

        .modern-btn:disabled{

          opacity:.5;

          cursor:not-allowed;

        }

      `}</style>

      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`modern-btn ${className}`}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
