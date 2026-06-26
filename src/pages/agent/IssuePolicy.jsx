import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import Card from "../../components/common/Card";

import Button from "../../components/common/Button";

import { issuePolicy } from "../../api/agentApi";

function IssuePolicy() {
  const [form, setForm] = useState({
    customerId: "",
    planId: "",
    startDate: "",
  });

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      await issuePolicy(form);

      alert("Policy issued successfully");

      setForm({
        customerId: "",
        planId: "",
        startDate: "",
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to issue policy");
    }
  }

  return (
    <DashboardLayout>
      <Card title="Issue Policy">
        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            name="customerId"
            placeholder="Customer ID"
            value={form.customerId}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="planId"
            placeholder="Plan ID"
            value={form.planId}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />

          <Button>Issue Policy</Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default IssuePolicy;
