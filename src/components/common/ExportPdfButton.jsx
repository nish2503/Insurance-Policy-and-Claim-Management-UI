// Drop this into any page's <DataTable headerActions={...} />.
//
// Two ways to use it:
//
// 1) CLIENT-SIDE data already fully loaded (e.g. via fetchAllPages) — just
//    pass `rows`. It exports exactly what you hand it, so pass the current
//    page's rows for a "this page" button and the full filtered array for
//    an "all records" button (render two <ExportPdfButton>s side by side,
//    e.g. label="Export Page" / label="Export All").
//
// 2) SERVER-SIDE paginated tables, where `rows` is only the current page —
//    pass `rows` for the page AND `fetchRows` (an async function returning
//    every matching record) to also render an "Export All" button. That
//    button fetches on click and shows a loading state while it works, so
//    nothing has to be preloaded into memory up front.
import { useState } from "react";
import { exportToPdf } from "../../utils/exportPdf";

function ExportPdfButton({
  title,
  columns,
  rows,
  fetchRows,
  meta,
  fileName,
  label = "Export Page",
  allLabel = "Export All",
}) {
  const [fetchingAll, setFetchingAll] = useState(false);

  const isPageDisabled = !rows || rows.length === 0;

  function handlePageClick() {
    exportToPdf({ title, columns, rows, meta, fileName });
  }

  async function handleAllClick() {
    setFetchingAll(true);
    try {
      const allRows = await fetchRows();
      exportToPdf({
        title: `${title} (All)`,
        columns,
        rows: allRows,
        meta,
        fileName: fileName ? `${fileName}-all` : undefined,
      });
    } finally {
      setFetchingAll(false);
    }
  }

  return (
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-secondary d-flex align-items-center gap-2"
        onClick={handlePageClick}
        disabled={isPageDisabled}
        title={isPageDisabled ? "No records to export" : `Export ${title} as PDF`}
      >
        <i className="bi bi-file-earmark-pdf"></i>
        {label}
      </button>

      {fetchRows && (
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={handleAllClick}
          disabled={fetchingAll}
          title={`Export every matching ${title} record as PDF`}
        >
          <i className="bi bi-file-earmark-pdf"></i>
          {fetchingAll ? "Fetching…" : allLabel}
        </button>
      )}
    </div>
  );
}

export default ExportPdfButton;