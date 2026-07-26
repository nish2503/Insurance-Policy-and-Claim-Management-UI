import { useState } from "react";

/**
 * DataTable
 *
 * Supports two modes:
 *
 * 1) CLIENT-SIDE (default) — pass the full `data` array, and the table
 *    handles search + pagination in the browser. Fine for small,
 *    non-paginated lists.
 *
 * 2) SERVER-SIDE — pass `serverSide`, along with:
 *      - `data`            -> just the current page's records
 *      - `currentPage`     -> 1-based page number (controlled by parent)
 *      - `totalPages`      -> total pages, from the backend response
 *      - `onPageChange`    -> (page) => void, parent re-fetches for that page
 *      - `rowsPerPage`     -> current page size (controlled by parent)
 *      - `onRowsPerPageChange` -> (size) => void, parent re-fetches with new size
 *    In this mode the table does NOT slice `data` itself — it trusts the
 *    parent to have already fetched the correct page from the API.
 *    Search in server-side mode filters only the current page's data,
 *    since the backend endpoint doesn't (yet) accept a search term. If you
 *    need "search across all records", that has to become a backend query
 *    param (e.g. `?search=`) rather than something the table can do alone.
 */
function DataTable({
  columns,
  data,
  rowsPerPageOptions = [5, 10, 20],
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  headerActions,

  // server-side pagination props (all optional; ignored in client mode)
  serverSide = false,
  currentPage: controlledPage,
  totalPages: controlledTotalPages,
  onPageChange,
  rowsPerPage: controlledRowsPerPage,
  onRowsPerPageChange,
}) {
  const [search, setSearch] = useState("");

  // Uncontrolled (client-side) pagination state.
  // Unused when serverSide is true.
  const [uncontrolledRowsPerPage, setUncontrolledRowsPerPage] = useState(5);
  const [uncontrolledPage, setUncontrolledPage] = useState(1);

  const rowsPerPage = serverSide ? controlledRowsPerPage : uncontrolledRowsPerPage;
  const currentPage = serverSide ? controlledPage : uncontrolledPage;

  function goToPage(page) {
    if (serverSide) {
      onPageChange?.(page);
    } else {
      setUncontrolledPage(page);
    }
  }

  function changeRowsPerPage(size) {
    if (serverSide) {
      onRowsPerPageChange?.(size);
    } else {
      setUncontrolledRowsPerPage(size);
      setUncontrolledPage(1);
    }
  }

  // SEARCH (client-side always; server-side only within the current page)
  const filteredData = data.filter((row) => {
    if (!searchable || !search) return true;

    return searchKeys.some((key) =>
      String(row[key] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  });

  // PAGINATION
  // Server-side: trust the backend, `data` is already just this page.
  // Client-side: slice the full array ourselves.
  const totalPages = serverSide
    ? controlledTotalPages ?? 1
    : Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = serverSide
    ? filteredData
    : filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        (currentPage - 1) * rowsPerPage + rowsPerPage,
      );

  return (
    <div>
      {(searchable || headerActions) && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="d-flex gap-2">
            {searchable && (
              <input
                className="form-control"
                style={{ width: "300px" }}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!serverSide) setUncontrolledPage(1);
                }}
              />
            )}

            <select
              className="form-select"
              style={{ width: "130px" }}
              value={rowsPerPage}
              onChange={(e) => changeRowsPerPage(Number(e.target.value))}
            >
              {rowsPerPageOptions.map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>

          <div>{headerActions}</div>
        </div>
      )}

      <table className="table table-hover table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length ? (
            paginatedData.map((row, index) => (
              <tr
                key={
                  row.customerId ||
                  row.productId ||
                  row.planId ||
                  row.policyId ||
                  row.claimId ||
                  row.paymentId ||
                  row.userId ||
                  row.id ||
                  index
                }
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            {"<<"}
          </button>

          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${
                page === currentPage ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            {">"}
          </button>

          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            {">>"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;