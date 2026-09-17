import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";

import { getInternalStaffCustomers } from "../../api/internalStaffApi";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const records = await fetchAllPages((page, size) =>
        getInternalStaffCustomers({ page, size }),
      );
      setCustomers(records);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const visibleCustomers =
    status === "ALL"
      ? customers
      : customers.filter((c) => String(c.activeStatus) === status);

  return (
    <DashboardLayout>
      <Card title="Customers">
        <BackButton />

        <DataTable
          emptyMessage="No Customers Found"
          columns={[
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
              key: "activeStatus",
              label: "Status",
              render: (row) => <StatusBadge status={row.activeStatus} />,
            },
          ]}
          data={visibleCustomers}
          searchKeys={["fullName", "email", "mobileNumber"]}
          headerActions={({ pageRows, filteredRows }) => {
            const columns = [
              { label: "Name", key: "fullName" },
              { label: "Email", key: "email" },
              { label: "Mobile", key: "mobileNumber" },
              {
                label: "Status",
                value: (row) => (row.activeStatus ? "Active" : "Inactive"),
              },
            ];
            const meta = { "Status filter": status === "ALL" ? "All" : status };

            return (
              <div className="d-flex gap-2">
                <StatusFilter
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ]}
                />

                <ExportPdfButton title="Customers (This Page)" fileName="customers-page" label="Export Page" rows={pageRows} meta={meta} columns={columns} />
                <ExportPdfButton title="Customers (All)" fileName="customers-all" label="Export All" rows={filteredRows} meta={meta} columns={columns} />
              </div>
            );
          }}
        />
      </Card>
    </DashboardLayout>
  );
}

export default Customers;