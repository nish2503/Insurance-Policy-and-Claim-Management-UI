function StatusBadge({ status }) {
  const normalizedStatus =
    typeof status === "boolean"
      ? status
        ? "ACTIVE"
        : "INACTIVE"
      : String(status).toUpperCase();

  const getBadgeColors = () => {
    switch (normalizedStatus) {
      case "ACTIVE":
      case "APPROVED":
      case "COMPLETED":
        return {
          bg: "rgba(16, 185, 129, 0.12)",
          text: "var(--success)",
          border: "rgba(16, 185, 129, 0.2)",
        };

      case "PENDING":
      case "PENDING_PAYMENT":
        return {
          bg: "rgba(245, 158, 11, 0.12)",
          text: "var(--warning)",
          border: "rgba(245, 158, 11, 0.2)",
        };

      case "REJECTED":
      case "FAILED":
      case "INACTIVE":
      case "DEACTIVATED":
      case "CANCELLED":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          text: "var(--danger)",
          border: "rgba(239, 68, 68, 0.2)",
        };

      case "EXPIRED":
        return {
          bg: "rgba(107, 114, 128, 0.12)",
          text: "#6b7280",
          border: "rgba(107, 114, 128, 0.2)",
        };

      default:
        return {
          bg: "rgba(148, 163, 184, 0.15)",
          text: "#94a3b8",
          border: "rgba(148, 163, 184, 0.2)",
        };
    }
  };

  const { bg, text, border } = getBadgeColors();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderRadius: "8px",
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      {normalizedStatus.replaceAll("_", " ")}
    </span>
  );
}

export default StatusBadge;
