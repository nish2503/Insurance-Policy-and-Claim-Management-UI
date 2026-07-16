import { useNavigate, useParams } from "react-router-dom";

import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";

import { purchasePolicy } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";
import { useToast } from "../../context/ToastContext";

function PurchasePolicy() {
  const { planId } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const [startDate, setStartDate] = useState("");

  async function handlePurchase(e) {
    e.preventDefault();

    try {
      await purchasePolicy({
        planId: Number(planId),

        startDate,
      });

      toast.success("Policy Purchased Successfully");

      navigate("/customer/policies");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Purchase Failed");
    }
  }

  return (
    <DashboardLayout>
      <BackButton/>

      <Card title="Purchase Policy">
        <form onSubmit={handlePurchase}>
          <label>Start Date</label>

          <input
            type="date"
            required
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <button className="btn btn-success mt-3">Confirm Purchase</button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default PurchasePolicy;
