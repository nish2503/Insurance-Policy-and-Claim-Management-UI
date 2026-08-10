import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import CustomerDetailsModal from "../../components/common/CustomerDetailsModal";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { fetchAllPages } from "../../utils/fetchAllPages";
import useDebounce from "../../hooks/useDebounce";

import {
  getCustomers,
  getCustomersByStatus,
  searchCustomers,
} from "../../api/customerApi";

import { updateUserStatus } from "../../api/userApi";

function Customers() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  // Server-side search — wired to the previously-unused GET /customers/search
  // endpoint. Searches the whole customer table, not just the loaded page.
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Server-side pagination. DataTable's `currentPage` is 1-based; the
  // backend's `page` query param is 0-based.
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Status-change (activate/deactivate) confirmation modal state.
  // Backend requires a non-blank `remarks` field on this call, so we collect
  // it here instead of firing the request straight off the table row.
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusRemarks, setStatusRemarks] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedSearch, page, rowsPerPage]);

  async function loadCustomers() {
    setLoading(true);

    try {
      let res;
      const params = { page: page - 1, size: rowsPerPage };

      if (debouncedSearch.trim()) {
        // Search overrides the status filter — the search endpoint doesn't
        // accept a status param, so this matches across ALL customers.
        res = await searchCustomers(debouncedSearch.trim(), params);
      } else if (status === "ALL") {
        res = await getCustomers(params);
      } else {
        res = await getCustomersByStatus(status, params);
      }

      setCustomers(res.data.records || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords ?? (res.data.records || []).length);
    } catch (err) {
      console.log(err);
      toast.error(getApiErrorMessage(err, "Unable to load customers."));
    } finally {
      setLoading(false);
    }
  }

  // Pulls the FULL matching dataset for export (same filters, but a page
  // size large enough to cover every record) instead of just the page
  // currently on screen. `customers`/`page`/`rowsPerPage` are for display
  // pagination only and must not be reused for the export.
  async function fetchAllCustomersForExport() {
    return fetchAllPages((page, size) => {
      const params = { page, size };
      if (debouncedSearch.trim()) {
        return searchCustomers(debouncedSearch.trim(), params);
      }
      if (status === "ALL") {
        return getCustomers(params);
      }
      return getCustomersByStatus(status, params);
    });
  }

  function openStatusModal(customer) {
    setStatusTarget(customer);
    setStatusRemarks("");
  }

  function closeStatusModal() {
    setStatusTarget(null);
    setStatusRemarks("");
  }

  async function confirmStatusChange() {
    if (!statusTarget) return;

    setSubmittingStatus(true);

    try {
      await updateUserStatus(
        statusTarget.userId,
        !statusTarget.activeStatus,
        statusRemarks.trim(),
      );

      toast.success(
        `Customer ${statusTarget.fullName || ""} ${
          statusTarget.activeStatus ? "deactivated" : "activated"
        } successfully`,
      );

      closeStatusModal();
      loadCustomers();
    } catch (err) {
      console.log(err);

      toast.error(getApiErrorMessage(err, "Unable to update customer status."));
    } finally {
      setSubmittingStatus(false);
    }
  }

  if (loading && customers.length === 0) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Customers">
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
              ? `No customers match "${debouncedSearch.trim()}"`
              : "No Customers Found"
          }
          columns={[
            {
              key: "customerId",

              label: "ID",
            },

            {
              key: "fullName",

              label: "Name",
            },

            {
              key: "email",

              label: "Email",
            },

            {
              key: "mobileNumber",

              label: "Mobile",
            },

            {
              key: "city",

              label: "City",
            },

            {
              key: "activeStatus",

              label: "Status",

              render: (customer) => (
                <StatusBadge status={customer.activeStatus} />
              ),
            },

            {
              key: "actions",

              label: "Actions",

              render: (customer) => (
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowModal(true);
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant={customer.activeStatus ? "danger" : "success"}
                    size="sm"
                    onClick={() => openStatusModal(customer)}
                  >
                    {customer.activeStatus ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ),
            },
          ]}
          data={customers}
          headerActions={
            <div className="d-flex gap-2 align-items-center">
              <input
                className="form-control"
                style={{ width: "220px" }}
                placeholder="Search name, email, mobile..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <StatusFilter
                value={status}
                onChange={setStatus}
                options={[
                  {
                    value: "ALL",
                    label: "All Status",
                  },
                  {
                    value: "true",
                    label: "Active",
                  },
                  {
                    value: "false",
                    label: "Inactive",
                  },
                ]}
              />

              <ExportPdfButton
                title="Customers"
                rows={customers}
                fetchRows={fetchAllCustomersForExport}
                meta={{
                  "Status filter": status === "ALL" ? "All" : status,
                  "Search term": debouncedSearch.trim() || "—",
                  Note: `Page export: page ${page} of ${totalPages}. All export: all ${totalRecords} matching customers.`,
                }}
                columns={[
                  { label: "ID", key: "customerId" },
                  { label: "Name", key: "fullName" },
                  { label: "Email", key: "email" },
                  { label: "Mobile", key: "mobileNumber" },
                  { label: "City", key: "city" },
                  {
                    label: "Status",
                    value: (row) => (row.activeStatus ? "Active" : "Inactive"),
                  },
                ]}
              />
            </div>
          }
        />
      </Card>

      <CustomerDetailsModal
        show={showModal}
        customer={selectedCustomer}
        onClose={() => {
          setShowModal(false);
          setSelectedCustomer(null);
        }}
      />

      <Modal
        show={!!statusTarget}
        title={statusTarget?.activeStatus ? "Deactivate Customer" : "Activate Customer"}
        onClose={closeStatusModal}
      >
        <p>
          {statusTarget?.activeStatus ? "Deactivating" : "Activating"}{" "}
          <strong>{statusTarget?.fullName}</strong>. Please provide a short
          reason (minimum 3 characters) for the audit trail.
        </p>
        <textarea
          className="form-control mb-3"
          rows={3}
          value={statusRemarks}
          onChange={(e) => setStatusRemarks(e.target.value)}
          placeholder="Reason for this status change..."
        />
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={closeStatusModal}>
            Cancel
          </Button>
          <Button
            variant={statusTarget?.activeStatus ? "danger" : "success"}
            disabled={statusRemarks.trim().length < 3 || submittingStatus}
            onClick={confirmStatusChange}
          >
            {submittingStatus ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Customers;