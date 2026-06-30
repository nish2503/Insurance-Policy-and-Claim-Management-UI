function StatusBadge({ status }) {
  const normalizedStatus =
    typeof status === "boolean"
      ? status
        ? "ACTIVE"
        : "INACTIVE"
      : String(status).toUpperCase();

  // --- Suggestion: Convert raw enum codes into clean, spaced human text labels ---
  const getDisplayLabel = () => {
    switch (normalizedStatus) {
      case "UNDER_REVIEW":
        return "Under Review";
      case "RECOMMENDED_APPROVAL":
        return "Recommended Approval";
      case "RECOMMENDED_REJECTION":
        return "Recommended Rejection";
      case "SUBMITTED":
        return "Submitted";
      case "PENDING_PAYMENT":
        return "Pending Payment";
      default:
        // Capitalises first letter for basic formatting fallback
        return normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase();
    }
  };

  const getBadgeColors = () => {
    switch (normalizedStatus) {
      case "ACTIVE":
      case "APPROVED":
      case "COMPLETED":
      case "SUCCESS":
      case "PAID":
        return {
          bg: "rgba(16, 185, 129, 0.12)",
          text: "var(--success, #10b981)",
          border: "rgba(16, 185, 129, 0.2)",
        };

      case "RECOMMENDED_APPROVAL":
        return {
          bg: "rgba(6, 182, 212, 0.12)", // Vibrant Cyan / Info palette
          text: "var(--info, #06b6d4)",
          border: "rgba(6, 182, 212, 0.2)",
        };

      case "PENDING":
      case "SUBMITTED":
      case "PENDING_PAYMENT":
        return {
          bg: "rgba(245, 158, 11, 0.12)",
          text: "var(--warning, #f59e0b)",
          border: "rgba(245, 158, 11, 0.2)",
        };

      case "UNDER_REVIEW":
        return {
          bg: "rgba(59, 130, 246, 0.12)", // Clean Accent Indigo / Blue palette
          text: "var(--primary, #3b82f6)",
          border: "rgba(59, 130, 246, 0.2)",
        };

      case "REJECTED":
      case "RECOMMENDED_REJECTION":
      case "FAILED":
      case "INACTIVE":
      case "DEACTIVATED":
      case "CANCELLED":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          text: "var(--danger, #ef4444)",
          border: "rgba(239, 68, 68, 0.2)",
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
        letterSpacing: "0.03em",
        borderRadius: "8px",
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      {getDisplayLabel()}
    </span>
  );
}

export default StatusBadge;
