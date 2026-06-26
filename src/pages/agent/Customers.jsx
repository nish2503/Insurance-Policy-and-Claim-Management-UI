import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DataTable from "../../components/common/DataTable";

import Loader from "../../components/common/Loader";

import EmptyState from "../../components/common/EmptyState";

import Card from "../../components/common/Card";

import { getAgentCustomers } from "../../api/agentApi";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getAgentCustomers();

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
          />
        ) : (
          <EmptyState message="No Customers Found" />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default Customers;
