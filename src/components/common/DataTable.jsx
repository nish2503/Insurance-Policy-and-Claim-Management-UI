function DataTable({ columns, data }) {
  return (
    <div className="modern-table-container">
      {/* 🚀 Dynamic stylesheet engine adjusting row parameters automatically */}
      <style>{`
        .modern-table-container {
          width: 100% !important;
          overflow-x: auto !important; /* Prevents layout clipping on narrow viewports */
          border-radius: 12px !important;
          border: 1px solid var(--border-color) !important;
          background: var(--panel-bg) !important;
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .insurtech-data-table {
          width: 100% !important;
          border-collapse: collapse !important;
          text-align: left !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          margin: 0 !important;
        }

        /* 📋 Table Header Viewport Banding */
        .insurtech-data-table thead tr {
          background-color: var(--bg-main) !important;
          border-bottom: 1px solid var(--border-color) !important;
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .insurtech-data-table th {
          padding: 16px 20px !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--text-muted) !important;
          transition: color 0.25s ease !important;
        }

        /* 📄 Content Cells and Striping Structures */
        .insurtech-data-table td {
          padding: 16px 20px !important;
          font-size: 0.9rem !important;
          color: var(--text-main) !important;
          border-bottom: 1px solid var(--border-color) !important;
          transition: color 0.25s ease, border-color 0.25s ease !important;
        }

        /* ✨ Interactive line-item ambient elevation matrix tracking */
        .insurtech-data-table tbody tr {
          background-color: var(--panel-bg) !important;
          transition: background-color 0.2s ease !important;
        }

        .insurtech-data-table tbody tr:hover {
          background-color: var(--bg-main) !important; /* Subtle highlight pop row focus */
        }

        /* Cleans the border offset trace layer line at the very base of the grid */
        .insurtech-data-table tbody tr:last-child td {
          border-bottom: none !important;
        }

        /* Empty state notification parameter box padding alignment override */
        .table-empty-cell {
          padding: 40px !important;
          font-size: 0.95rem !important;
          color: var(--text-muted) !important;
          font-weight: 500 !important;
          text-align: center !important;
        }
      `}</style>

      <table className="insurtech-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty-cell">
                No active records or datasets available inside this queue.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
