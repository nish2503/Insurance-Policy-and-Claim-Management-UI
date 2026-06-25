import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getMyPolicies } from "../../api/customerApi";

function MyPolicies() {

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {

    try {

      const res = await getMyPolicies();

      setPolicies(res.data.records || []);

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

      <Card title="My Policies">

        {

          policies.length ?

          <DataTable

            columns={[

              {
                key: "policyNumber",
                label: "Policy Number"
              },

              {
                key: "planName",
                label: "Plan"
              },

              {
                key: "productType",
                label: "Product"
              },

              {
                key: "premiumAmount",
                label: "Premium"
              },

              {
                key: "policyStatus",
                label: "Status"
              },

              {
 key:"coverageAmount",
 label:"Coverage"
}

            ]}

            data={policies.map(p => ({

    ...p,

    coverageAmount:
      `₹${p.coverageAmount}`,

    premiumAmount:
      `₹${p.premiumAmount} (${p.premiumType})`

  }))}

          />

          :

          <EmptyState
            message="No Policies Found"
          />

        }

      </Card>

    </DashboardLayout>

  );

}

export default MyPolicies;