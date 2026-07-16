// Drop this into any page's <DataTable headerActions={...} />. It always
// exports the rows currently passed to it, so pass the already-filtered/
// searched array from the page, not the raw unfiltered API response.
import { exportToPdf } from "../../utils/exportPdf";

function ExportPdfButton({ title, columns, rows, meta, fileName, label = "Export PDF" }) {
  const isDisabled = !rows || rows.length === 0;

  function handleClick() {
    exportToPdf({ title, columns, rows, meta, fileName });
  }

  return (
    <button
      type="button"
      className="btn btn-outline-secondary d-flex align-items-center gap-2"
      onClick={handleClick}
      disabled={isDisabled}
      title={isDisabled ? "No records to export" : `Export ${title} as PDF`}
    >
      <i className="bi bi-file-earmark-pdf"></i>
      {label}
    </button>
  );
}

export default ExportPdfButton;