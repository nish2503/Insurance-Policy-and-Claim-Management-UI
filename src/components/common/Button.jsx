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
  );
}

export default Button;
