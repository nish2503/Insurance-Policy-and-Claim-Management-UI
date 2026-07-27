import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import CustomerDetailsModal from "../../components/common/CustomerDetailsModal";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";

import { getCustomers, getCustomersByStatus } from "../../api/customerApi";

import { updateUserStatus } from "../../api/userApi";

function Customers() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Status-change (activate/deactivate) confirmation modal state.
  // Backend requires a non-blank `remarks` field on this call, so we collect
  // it here instead of firing the request straight off the table row.
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusRemarks, setStatusRemarks] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [status]);

  async function loadCustomers() {
    setLoading(true);

    try {
      let res;

      if (status === "ALL") {
        res = await getCustomers();
      } else {
        res = await getCustomersByStatus(status);
      }

      setCustomers(res.data.records || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
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
          searchKeys={[
            "customerId",

            "fullName",

            "email",

            "mobileNumber",

            "city",
          ]}
          searchPlaceholder="Search customers..."
          headerActions={
            <div className="d-flex gap-2">
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
                meta={{ "Status filter": status === "ALL" ? "All" : status }}
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