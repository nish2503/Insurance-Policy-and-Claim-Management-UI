import { useEffect, useState } from "react";

import {
  getPolicies,
  getPoliciesByStatus,
  searchPolicies,
  cancelPolicy,
} from "../../api/policyApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Button from "../../components/common/Button";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { fetchAllPages } from "../../utils/fetchAllPages";
import useDebounce from "../../hooks/useDebounce";

import PolicyDetailsModal from "../../components/common/PolicyDetailsModal";

function AdminPolicies() {
  const toast = useToast();
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  // Server-side search by policy number — wired to the previously-unused
  // GET /policies/search endpoint. This searches the WHOLE dataset, not
  // just whatever page happens to be loaded client-side.
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Server-side pagination state. DataTable's `currentPage` prop is
  // 1-based; the backend's `page` query param is 0-based.
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Reset back to page 1 whenever the filter or search term changes,
  // otherwise you can land on an out-of-range page for the new result set.
  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedSearch, page, rowsPerPage]);

  async function loadPolicies() {
    setLoading(true);

    try {
      let res;
      const params = { page: page - 1, size: rowsPerPage };

      if (debouncedSearch.trim()) {
        // A search term takes priority over the status filter — the
        // backend search endpoint doesn't accept a status param, so this
        // searches across ALL policy numbers regardless of status.
        res = await searchPolicies(debouncedSearch.trim(), params);
      } else if (status === "ALL") {
        res = await getPolicies(params);
      } else {
        res = await getPoliciesByStatus(status, params);
      }

      setPolicies(res.data.records || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords ?? (res.data.records || []).length);
    } catch (err) {
      console.log(err);
      toast.error(getApiErrorMessage(err, "Unable to load policies."));
    } finally {
      setLoading(false);
    }
  }

  // Pulls the FULL matching dataset for export instead of just the page
  // currently on screen. `policies`/`page`/`rowsPerPage` are for display
  // pagination only and must not be reused for the export.
  async function fetchAllPoliciesForExport() {
    return fetchAllPages((page, size) => {
      const params = { page, size };
      if (debouncedSearch.trim()) {
        return searchPolicies(debouncedSearch.trim(), params);
      }
      if (status === "ALL") {
        return getPolicies(params);
      }
      return getPoliciesByStatus(status, params);
    });
  }

  async function handleCancel(policy) {
    if (!window.confirm(`Cancel policy ${policy.policyNumber}?`)) return;

    try {
      await cancelPolicy(policy.policyId);

      toast.success(`Policy ${policy.policyNumber} cancelled successfully`);
      loadPolicies();
    } catch (err) {
      console.log(err);

      toast.error(getApiErrorMessage(err, "Unable to cancel policy."));
    }
  }

  if (loading && policies.length === 0) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Policies">
        <BackButton />

        <DataTable
          emptyMessage={
            debouncedSearch.trim()
              ? `No policies match "${debouncedSearch.trim()}"`
              : "No Policies Found"
          }
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
          columns={[
            {
              key: "policyNumber",

              label: "Policy No.",
            },

            {
              key: "customerName",

              label: "Customer",
            },

            {
              key: "planName",

              label: "Plan",
            },

            {
              key: "productType",

              label: "Product",
            },

            {
              key: "premiumAmount",

              label: "Premium",
            },

            {
              key: "policyStatus",

              label: "Status",

              render: (policy) => <StatusBadge status={policy.policyStatus} />,
            },

            {
              key: "actions",

              label: "Actions",

              render: (policy) => (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);

                      setShowModal(true);
                    }}
                  >
                    View
                  </Button>

                  {policy.policyStatus !== "CANCELLED" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(policy)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={policies}
          headerActions={
            <div className="d-flex gap-2 align-items-center">
              <input
                className="form-control"
                style={{ width: "220px" }}
                placeholder="Search by policy number..."
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
                    value: "PENDING_PAYMENT",

                    label: "Pending Payment",
                  },

                  {
                    value: "ACTIVE",

                    label: "Active",
                  },

                  {
                    value: "EXPIRED",

                    label: "Expired",
                  },

                  {
                    value: "CANCELLED",

                    label: "Cancelled",
                  },
                ]}
              />

              <ExportPdfButton
                title="Policies"
                rows={policies}
                fetchRows={fetchAllPoliciesForExport}
                meta={{
                  "Status filter": status === "ALL" ? "All" : status,
                  "Search term": debouncedSearch.trim() || "—",
                  Note: `Page export: page ${page} of ${totalPages}. All export: all ${totalRecords} matching policies.`,
                }}
                columns={[
                  { label: "Policy No.", key: "policyNumber" },
                  { label: "Customer", key: "customerName" },
                  { label: "Plan", key: "planName" },
                  { label: "Product", key: "productType" },
                  { label: "Premium", value: (row) => `₹${row.premiumAmount}` },
                  { label: "Status", key: "policyStatus" },
                ]}
              />
            </div>
          }
        />
      </Card>

      <PolicyDetailsModal
        show={showModal}
        policy={selectedPolicy}
        onClose={() => {
          setShowModal(false);

          setSelectedPolicy(null);
        }}
      />
    </DashboardLayout>
  );
}

export default AdminPolicies;