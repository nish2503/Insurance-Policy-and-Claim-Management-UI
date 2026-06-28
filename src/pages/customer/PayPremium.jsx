import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";

import {
 getMyPolicies,
 payPremium
} from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";


function PayPremium() {
  const [policies, setPolicies] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState("");

  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const res = await getMyPolicies();

      setPolicies(res.data.records || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePayment(e) {
    e.preventDefault();

    try {
      await payPremium({
        policyId: selectedPolicy,

        amount: amount,

        paymentMode: "UPI",

        transactionReference: "TXN" + Date.now(),

        paymentStatus: "SUCCESS",
      });

      alert("Premium Paid Successfully");

      setAmount("");
    } catch (error) {
      console.log(error);


alert(
error.response?.data?.message ||
"Payment Failed"
);


}


}



return(


<DashboardLayout>


<Card title="Pay Premium">
    <BackButton/>



<form onSubmit={handlePayment}>


<label>
Select Policy
</label>


          <select
            className="form-control"
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
          >
            <option value="">Select</option>

            {policies.map((p) => (
              <option key={p.policyId} value={p.policyId}>
                {p.policyNumber}-{p.planName}
              </option>
            ))}
          </select>

          <label className="mt-3">Amount</label>

          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="btn btn-success mt-3">Pay Now</button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default PayPremium;
