// Shared PDF export utility. Every page that shows a DataTable of customers,
// products, plans, policies, payments, claims, users/internal-staff, or claim
// history should call this instead of hand-rolling its own PDF logic.
//
// Usage:
//   exportToPdf({
//     title: "All Claims",
//     columns: [
//       { label: "Claim #", key: "claimNumber" },
//       { label: "Status", value: (row) => row.claimStatus.replaceAll("_", " ") },
//       { label: "Amount", value: (row) => `₹${row.claimAmount}` },
//     ],
//     rows: filteredClaims, // export what's on screen, not raw unfiltered data
//     meta: { "Filtered by status": statusFilter || "All" },
//   });
//
// Pass `value: (row) => string` for any column that on-screen uses a
// StatusBadge, currency formatting, a joined name, or any other `render`
// function — the PDF cell needs plain text, not JSX. Plain columns can just
// use `key` and the raw field value will be read directly.
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPdf({ title, columns, rows, meta = {}, fileName }) {
  if (!columns || !columns.length) {
    throw new Error("exportToPdf: `columns` is required and must be non-empty");
  }

  const doc = new jsPDF({
    orientation: columns.length > 6 ? "landscape" : "portrait",
    unit: "mm",
  });

  const marginX = 14;
  let cursorY = 16;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(title || "Export", marginX, cursorY);
  cursorY += 6;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, marginX, cursorY);
  cursorY += 5;

  Object.entries(meta).forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, marginX, cursorY);
    cursorY += 5;
  });

  doc.text(`Total records: ${(rows || []).length}`, marginX, cursorY);
  cursorY += 4;
  doc.setTextColor(0);

  const head = [columns.map((col) => col.label)];
  const body = (rows || []).map((row) =>
    columns.map((col) => {
      const raw = col.value ? col.value(row) : row[col.key];
      return raw === null || raw === undefined || raw === "" ? "-" : String(raw);
    }),
  );

  autoTable(doc, {
    startY: cursorY + 2,
    head,
    body,
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: marginX, right: marginX },
  });

  const slug = (fileName || title || "export")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  doc.save(`${slug}-${Date.now()}.pdf`);
}

export default exportToPdf;