import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { getProducts } from "../api/productApi";
import { getCustomers } from "../api/customerApi";
import { getPolicies } from "../api/policyApi";
import { getClaims } from "../api/claimApi";
import { getPlans } from "../api/planApi";

function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [plans, setPlans] = useState([]);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const productRes = await getProducts();
      const customerRes = await getCustomers();
      const policyRes = await getPolicies();
      const claimRes = await getClaims();
      const planRes = await getPlans();

      setProducts(productRes.data.records || []);
      setCustomers(customerRes.data.records || []);
      setPolicies(policyRes.data.records || []);
      setClaims(claimRes.data.records || []);
      setPlans(planRes.data.records || []);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light min-vh-100 p-4">

        <h2 className="mb-4">
          Admin Dashboard
        </h2>

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

        {selected === "products" && (
          <ul className="list-group">
            {products.map((p, index) => (
              <li
                key={p.id || index}  //p.productId 
                className="list-group-item"
              >
                {p.productName || p.name}
              </li>
            ))}
          </ul>
        )}

        {selected === "customers" && (
          <ul className="list-group">
            {customers.map((c, index) => (
              <li
                key={c.id|| index}  //c.customerId
                className="list-group-item"
              >
                {c.fullName ||
                  c.name ||
                  c.userName ||
                  "Unknown Customer"}
              </li>
            ))}
          </ul>
        )}

        {selected === "policies" && (
          <ul className="list-group">
            {policies.map((p, index) => (
              <li
                key={p.id || index}  //p.policyId 
                className="list-group-item"
              >
                {p.policyNumber || p.id}
              </li>
            ))}
          </ul>
        )}

        {selected === "claims" && (
          <ul className="list-group">
            {claims.map((c, index) => (
              <li
                key={c.id || index}  //c.claimId 
                className="list-group-item"
              >
                {c.claimNumber || c.id} 
              </li>
            ))}
          </ul>
        )}

        {selected === "plans" && (
          <ul className="list-group">
            {plans.map((p, index) => (
              <li
                key={p.id || index} //p.planId
                className="list-group-item"
              >
                {p.planName || p.name}
              </li>
            ))}
          </ul>
        )}

      </div>
    </>
  );
}

export default AdminDashboard;