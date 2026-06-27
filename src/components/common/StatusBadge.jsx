// function StatusBadge({ status }) {
//   // Define precise color pairs (background capsule and text color) for each status state
//   const getBadgeColors = () => {
//     switch (status) {
//       case "ACTIVE":
//       case "APPROVED":
//       case "COMPLETED":
//         return {
//           bg: "rgba(16, 185, 129, 0.12)", // Soft translucent emerald
//           text: "#10b981", // High-visibility vibrant mint
//           border: "rgba(16, 185, 129, 0.2)",
//         };
//       case "PENDING":
//         return {
//           bg: "rgba(245, 158, 11, 0.12)", // Soft translucent amber
//           text: "#f59e0b", // Rich high-contrast gold
//           border: "rgba(245, 158, 11, 0.2)",
//         };
//       case "REJECTED":
//       case "FAILED":
//         return {
//           bg: "rgba(239, 68, 68, 0.12)", // Soft translucent crimson
//           text: "#ef4444", // Sharp vibrant ruby
//           border: "rgba(239, 68, 68, 0.2)",
//         };
//       default:
//         return {
//           bg: "rgba(148, 163, 184, 0.15)", // Soft slate gray
//           text: "var(--text-muted, #94a3b8)",
//           border: "rgba(148, 163, 184, 0.2)",
//         };
//     }
//   };

//   const { bg, text, border } = getBadgeColors();

//   return (
//     <span className="insurtech-status-badge">
//       <style>{`
//         .insurtech-status-badge {
//           display: inline-flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           padding: 6px 12px !important;
//           font-size: 0.75rem !important;
//           font-weight: 600 !important;
//           text-transform: uppercase !important;
//           letter-spacing: 0.05em !important;
//           border-radius: 8px !important;
//           font-family: 'Inter', system-ui, sans-serif !important;
//           background-color: ${bg} !important;
//           color: ${text} !important;
//           border: 1px solid ${border} !important;
//           transition: all 0.2s ease !important;
//           white-space: nowrap !important;
//         }
//       `}</style>
//       {status}
//     </span>
//   );
// }

// export default StatusBadge;

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
          text:"var(--success)",
          border: "rgba(16, 185, 129, 0.2)",
        };

      case "PENDING":
        return {
          bg: "rgba(245, 158, 11, 0.12)",
          text: "var(--warning)",
          border: "rgba(245, 158, 11, 0.2)",
        };

      case "REJECTED":
      case "FAILED":
      case "INACTIVE":
      case "DEACTIVATED":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          text: "var(--danger)",
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
      {normalizedStatus}
    </span>
  );
}

export default StatusBadge;
