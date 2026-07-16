import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DataTable from "../../components/common/DataTable";

import Loader from "../../components/common/Loader";

import EmptyState from "../../components/common/EmptyState";

import Card from "../../components/common/Card";

import { getInternalStaffCustomers } from "../../api/internalStaffApi";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getInternalStaffCustomers();

      setCustomers(res.data.records || []);
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

  return (
    <DashboardLayout>
      <Card title="Customers">
        <BackButton />

        {customers.length ? (
          <DataTable
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
            ]}
            data={customers}
            searchKeys={["fullName", "email", "mobileNumber"]}
            headerActions={
              <ExportPdfButton
                title="Customers"
                rows={customers}
                columns={[
                  { label: "Name", key: "fullName" },
                  { label: "Email", key: "email" },
                  { label: "Mobile", key: "mobileNumber" },
                ]}
              />
            }
          />
        ) : (
          <EmptyState message="No Customers Found" />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default Customers;