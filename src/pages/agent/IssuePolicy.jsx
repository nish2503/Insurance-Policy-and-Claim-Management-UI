import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import { issuePolicy, getAgentCustomers, getPlans } from "../../api/agentApi";

import BackButton from "../../components/common/BackButton";

function IssuePolicy() {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    planId: "",
    startDate: "",
  });

  useEffect(() => {
    loadCustomers();
    loadPlans();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getAgentCustomers();

      setCustomers(res.data.records || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadPlans() {
    try {
      const res = await getPlans();

      console.log("PLANS RESPONSE", res.data);

      setPlans(res.data.records || []);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.customerId) {
      setError("Please select customer");
      return;
    }

    if (!form.planId) {
      setError("Please select plan");
      return;
    }

    if (!form.startDate) {
      setError("Please select start date");
      return;
    }

    try {
      const payload = {
        customerId: Number(form.customerId),

        planId: Number(form.planId),

        startDate: form.startDate,
      };

      console.log("Sending policy data:", payload);

      const response = await issuePolicy(payload);

      setMessage("Policy issued successfully");
setError("");

      setForm({
  customerId:"",
  planId:"",
  startDate:""
});
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Failed to issue policy");
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Issue Policy">
        {message && (
  <div className="alert alert-success">
    {message}
  </div>
)}

{error && (
  <div className="alert alert-danger">
    {error}
  </div>
)}
        <form onSubmit={submit}>
          <select
            className="form-control mb-3"
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
          >
            <option  key="customer-empty" value="">Select Customer</option>

            {customers.map((c) => (
              <option key={c.customerId} value={c.customerId}>
                {c.fullName}
              </option>
            ))}
          </select>

          <select
            className="form-control mb-3"
            name="planId"
            value={form.planId}
            onChange={handleChange}
          >
            <option  key="plan-empty" value="">Select Plan</option>

            {plans.map((p) => (
              <option key={p.planId} value={p.planId}>
                {p.planName}
              </option>
            ))}
          </select>

          <input
            className="form-control mb-3"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />

          <Button type="submit">Issue Policy</Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default IssuePolicy;
