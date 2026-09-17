import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import { getInternalStaffPayments } from "../../api/internalStaffApi";
import {
  getPaymentsByStatus,
  searchPayments,
} from "../../api/premiumPaymentApi";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { fetchAllPages } from "../../utils/fetchAllPages";
import useDebounce from "../../hooks/useDebounce";

function Payments() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");

  // Server-side search by transaction reference — wired to the previously
  // -unused GET /premium-payments/search endpoint. Searches every payment,
  // not just whatever page happens to be loaded.
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Server-side pagination. DataTable's `currentPage` is 1-based; the
  // backend's `page` query param is 0-based.
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedSearch, page, rowsPerPage]);

  async function loadPayments() {
    setLoading(true);
    try {
      let res;
      const params = { page: page - 1, size: rowsPerPage };

      if (debouncedSearch.trim()) {
        // Search overrides the status filter — the search endpoint doesn't
        // accept a status param, so this matches across ALL payments.
        res = await searchPayments(debouncedSearch.trim(), params);
      } else if (status === "ALL") {
        res = await getInternalStaffPayments(params);
      } else {
        res = await getPaymentsByStatus(status, params);
      }

      const data = res.data;
      setPayments(data.records || data.content || data || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords ?? (data.records || []).length);
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Unable to load payments."));
    } finally {
      setLoading(false);
    }
  }

  // Pulls the FULL matching dataset for export instead of just the page
  // currently on screen. `payments`/`page`/`rowsPerPage` are for display
  // pagination only and must not be reused for the export.
  async function fetchAllPaymentsForExport() {
    return fetchAllPages((page, size) => {
      const params = { page, size };
      if (debouncedSearch.trim()) {
        return searchPayments(debouncedSearch.trim(), params);
      }
      if (status === "ALL") {
        return getInternalStaffPayments(params);
      }
      return getPaymentsByStatus(status, params);
    });
  }

  if (loading && payments.length === 0) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Premium Payments">
        <BackButton />

        <DataTable
          searchable={false}
          serverSide
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(size) => {
            setRowsPerPage(size);
            setPage(1);
          }}
          emptyMessage={
            debouncedSearch.trim()
              ? `No payments match "${debouncedSearch.trim()}"`
              : "No Payments Found"
          }
          columns={[
            {
              key: "paymentId",
              label: "ID",
            },
            {
              key: "policyNumber",
              label: "Policy Number",
            },
            {
              key: "customerNameCustom",
              label: "Customer Name",
            },
            {
              key: "transactionReference",
              label: "Transaction Ref",
            },
            {
              key: "amountCustom",
              label: "Amount",
            },
            {
              key: "paymentMode",
              label: "Mode",
            },
            {
              key: "paymentStatusCustom",
              label: "Status",
            },
          ]}
          data={payments.map((p) => ({
            ...p,
            customerNameCustom: p.customerName || "N/A",
            amountCustom: `₹${p.amount}`,
            paymentStatusCustom: <StatusBadge status={p.paymentStatus} />,
          }))}
          headerActions={
            <div className="d-flex gap-2 align-items-center">
              <input
                className="form-control"
                style={{ width: "220px" }}
                placeholder="Search by transaction ref..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <StatusFilter
                value={status}
                onChange={setStatus}
                options={[
                  { value: "ALL", label: "All Status" },
                  { value: "SUCCESS", label: "Success" },
                  { value: "FAILED", label: "Failed" },
                  { value: "PENDING", label: "Pending" },
                ]}
              />

              <ExportPdfButton
                title="Premium Payments"
                rows={payments}
                fetchRows={fetchAllPaymentsForExport}
                meta={{
                  "Status filter": status === "ALL" ? "All" : status,
                  "Search term": debouncedSearch.trim() || "—",
                  Note: `Page export: page ${page} of ${totalPages}. All export: all ${totalRecords} matching payments.`,
                }}
                columns={[
                  { label: "ID", key: "paymentId" },
                  { label: "Policy Number", key: "policyNumber" },
                  {
                    label: "Customer Name",
                    value: (row) => row.customerName || "N/A",
                  },
                  { label: "Transaction Ref", key: "transactionReference" },
                  { label: "Amount", value: (row) => `₹${row.amount}` },
                  { label: "Mode", key: "paymentMode" },
                  { label: "Status", key: "paymentStatus" },
                ]}
              />
            </div>
          }
        />
      </Card>
    </DashboardLayout>
  );
}

export default Payments;
