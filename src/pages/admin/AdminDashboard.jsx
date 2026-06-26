import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DashboardCard from "../../components/common/DashboardCard";

import DataTable from "../../components/common/DataTable";

import Card from "../../components/common/Card";

import Loader from "../../components/common/Loader";

import EmptyState from "../../components/common/EmptyState";

import { getProducts } from "../../api/productApi";

import { getCustomers } from "../../api/customerApi";

import { getPolicies } from "../../api/policyApi";

import { getClaims } from "../../api/claimApi";

import { getPlans } from "../../api/planApi";

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [policies, setPolicies] = useState([]);

  const [claims, setClaims] = useState([]);

  const [plans, setPlans] = useState([]);

  const [selected, setSelected] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productRes, customerRes, policyRes, claimRes, planRes] =
        await Promise.all([
          getProducts(),

          getCustomers(),

          getPolicies(),

          getClaims(),

          getPlans(),
        ]);

      setProducts(productRes.data.records || []);

      setCustomers(customerRes.data.records || []);

      setPolicies(policyRes.data.records || []);

      setClaims(claimRes.data.records || []);

      setPlans(planRes.data.records || []);
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

  let tableData = [];

  let columns = [];

  if (selected === "products") {
    columns = [
      {
        key: "productName",
        label: "Product",
      },
    ];

    tableData = products;
  }

  if (selected === "customers") {
    columns = [
      {
        key: "name",
        label: "Customer",
      },
    ];

    tableData = customers.map((c) => ({
      name: c.fullName || c.name || c.userName,
    }));
  }

  if (selected === "policies") {
    columns = [
      {
        key: "policyNumber",
        label: "Policy",
      },
    ];

    tableData = policies;
  }

  if (selected === "claims") {
    columns = [
      {
        key: "claimNumber",
        label: "Claim",
      },
    ];

    tableData = claims.map((c) => ({
      claimNumber: c.claimNumber || c.id,
    }));
  }

  if (selected === "plans") {
    columns = [
      {
        key: "planName",
        label: "Plan",
      },
    ];

    tableData = plans;
  }

  return (
    <DashboardLayout>
      <h2>Admin Dashboard</h2>

      <div className="row">
        <DashboardCard
          title="Products"
          count={products.length}
          onClick={() => setSelected("products")}
        />

        <DashboardCard
          title="Customers"
          count={customers.length}
          onClick={() => setSelected("customers")}
        />

        <DashboardCard
          title="Policies"
          count={policies.length}
          onClick={() => setSelected("policies")}
        />

        <DashboardCard
          title="Claims"
          count={claims.length}
          onClick={() => setSelected("claims")}
        />

        <DashboardCard
          title="Plans"
          count={plans.length}
          onClick={() => setSelected("plans")}
        />
      </div>

      <Card title={selected}>
        {selected ? (
          <DataTable columns={columns} data={tableData} />
        ) : (
          <EmptyState message="Select a module" />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default AdminDashboard;
