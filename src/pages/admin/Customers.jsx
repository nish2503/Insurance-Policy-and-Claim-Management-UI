import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import CustomerDetailsModal from "../../components/common/CustomerDetailsModal";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";

import { getCustomers, getCustomersByStatus } from "../../api/customerApi";

import { updateUserStatus } from "../../api/userApi";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showModal, setShowModal] = useState(false);

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

  async function handleStatus(customer) {
    try {
      await updateUserStatus(
        customer.userId,

        !customer.activeStatus,
      );

      loadCustomers();
    } catch (err) {
      console.log(err);
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
                    onClick={() => handleStatus(customer)}
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
    </DashboardLayout>
  );
}

export default Customers;
