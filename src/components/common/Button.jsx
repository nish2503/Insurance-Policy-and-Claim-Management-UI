function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
}) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg,var(--primary),var(--primary-light))",
      color: "#fff",
      border: "none",
    },

    secondary: {
      background: "var(--panel-bg)",
      color: "var(--text-main)",
      border: "1px solid var(--border-color)",
    },

    success: {
      background: "rgba(16,185,129,.12)",
      color: "var(--success)",
      border: "1px solid rgba(16,185,129,.25)",
    },

    danger: {
      background: "rgba(239,68,68,.12)",
      color: "var(--danger)",
      border: "1px solid rgba(239,68,68,.25)",
    },
  };

  const buttonStyle = {
    ...(styles[variant] || styles.primary),

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    padding: size === "sm" ? "6px 12px" : "10px 20px",

    fontSize: size === "sm" ? ".8rem" : ".9rem",

    fontWeight: 600,

    borderRadius: "10px",

    cursor: disabled ? "not-allowed" : "pointer",

    transition: ".2s",

    fontFamily: "Inter, sans-serif",

    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      className={className}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";

          e.currentTarget.style.boxShadow = "var(--card-shadow)";

          e.currentTarget.style.filter = "brightness(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";

        e.currentTarget.style.boxShadow = "none";

        e.currentTarget.style.filter = "brightness(1)";
      }}
    >
      {children}
    </button>
    // =======
    // function Button({
    //     children,
    //     type = "submit",
    //     className = "",
    //     onClick,
    //     disabled
    // }) {

    //   const isDanger =
    //     className.includes("btn-danger") ||
    //     className.includes("danger");

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

    //     return `
    //       background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
    //       color: #ffffff !important;
    //       border:none !important;
    //     `;

    //   };

    //   return (

    //     <button

    //       type={type}

    //       className={`modern-action-trigger ${className}`}

    //       onClick={onClick}

    //       disabled={disabled}

    //     >

    //       <style>

    //       {`

    //       .modern-action-trigger {

    //         ${getButtonStyles()}

    //         padding:10px 20px !important;

    //         border-radius:10px !important;

    //         font-size:0.88rem !important;

    //         font-weight:600 !important;

    //         cursor:pointer !important;

    //         display:inline-flex !important;

    //         align-items:center !important;

    //         justify-content:center !important;

    //         gap:8px !important;

    //         font-family:'Inter',system-ui,sans-serif !important;

    //         transition:all .2s ease !important;

    //       }

    //       .modern-action-trigger:hover:not(:disabled){

    //         transform:translateY(-2px)!important;

    //       }

    //       .modern-action-trigger:disabled{

    //         opacity:.5 !important;

    //         cursor:not-allowed !important;

    //       }

    //       `}

    //       </style>

    //       {children}

    //     </button>

    // >>>>>>> 08599d9f0b9d7450522836fa85862dc3c8b6fa0d
  );
}

export default Button;
