import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import {
  getMyPolicies,
  payPremium,
  getMyPremiumPayments,
} from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";

function PayPremium() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [isLocked, setIsLocked] = useState(false);

  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const policyRes = await getMyPolicies();

      setPolicies(
        policyRes.data.records ||
          policyRes.data.content ||
          policyRes.data ||
          [],
      );

      loadPayments();
    } catch (error) {
      console.error(error);
    }
  }

  async function loadPayments() {
    try {
      const res = await getMyPremiumPayments();

      setPaymentHistory(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePolicyChange(e) {
    const policyId = e.target.value;

    setSelectedPolicy(policyId);

    setSuccessMsg("");

    setErrorMsg("");

    setInfoMsg("");

    setIsLocked(false);

    setReceiptData(null);

    if (!policyId) {
      setAmount("");

      return;
    }

    const policy = policies.find(
      (p) => String(p.policyId || p.id) === String(policyId),
    );

    if (policy) {
      setAmount(policy.premiumAmount || policy.amount || "");

      if (policy.nextPremiumDueDate) {
        const dueDate = new Date(policy.nextPremiumDueDate);

        const today = new Date();

        if (today < dueDate) {
          setIsLocked(true);

          setInfoMsg(
            `Premium already paid. Next payment due on ${dueDate.toLocaleDateString()}`,
          );
        }
      }
    }
  }

  function handleModeChange(e) {
    setPaymentMode(e.target.value);
  }

  function handleCancel() {
    setSelectedPolicy("");

    setAmount("");

    setPaymentMode("");

    setReceiptData(null);

    setInfoMsg("Payment cancelled");

    navigate("/customer");
  }

  function validateForm() {
    const errors = {};

    if (!selectedPolicy) errors.selectedPolicy = "Please select a policy";

    if (!paymentMode) errors.paymentMode = "Please select payment method";

    return errors;
  }

  async function handlePayment(e) {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldErrors(errors);

      return;
    }

    if (isLocked) {
      setErrorMsg("Premium already paid for this cycle");

      return;
    }

    const matchedPolicy = policies.find(
      (p) => String(p.policyId || p.id) === String(selectedPolicy),
    );

    const ref = "TXN" + Date.now();

    try {
      await payPremium({
        policyId: Number(selectedPolicy),

        amount: Number(amount),

        paymentMode,

        transactionReference: ref,

        paymentStatus: "SUCCESS",
      });

      setSuccessMsg("Premium paid successfully!");

      setReceiptData({
        policyNumber: matchedPolicy?.policyNumber || selectedPolicy,

        planName: matchedPolicy?.planName || "Insurance Plan",

        amountPaid: amount,

        mode: paymentMode,

        reference: ref,

        date: new Date().toLocaleString(),
      });

      setSelectedPolicy("");

      setAmount("");

      setPaymentMode("");

      loadInitialData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Payment failed");
    }
  }

  function downloadReceiptFile(data) {
    if (!data) return;

    const receiptText = `

INSURANCE PREMIUM PAYMENT RECEIPT

Date:
${data.date}

Transaction:
${data.reference}

Policy:
${data.policyNumber}

Plan:
${data.planName}

Amount:
INR ${data.amountPaid}

Mode:
${data.mode}

Status:
SUCCESS

`;

    const blob = new Blob([receiptText], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `Receipt_${data.reference}.txt`;

    link.click();
  }

  return (
    <DashboardLayout>
      <Card title="Pay Premium">
        <BackButton />

        {successMsg && (
          <div className="alert alert-success mt-3">{successMsg}</div>
        )}

        {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}

        {infoMsg && <div className="alert alert-warning mt-3">{infoMsg}</div>}

        <form onSubmit={handlePayment}>
          <div className="mb-3">
            <label>Select Policy</label>

            <select
              className="form-select"
              value={selectedPolicy}
              onChange={handlePolicyChange}
            >
              <option value="">Choose Option</option>

              {policies.map((p) => (
                <option key={p.policyId || p.id} value={p.policyId || p.id}>
                  {p.policyNumber} - {p.planName || "Insurance Plan"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Premium Amount</label>

            <input className="form-control" value={amount} readOnly />
          </div>

          <div className="mb-3">
            <label>Payment Mode</label>

            <select
              className="form-select"
              value={paymentMode}
              onChange={handleModeChange}
              disabled={isLocked}
            >
              <option value="">Choose Option</option>

              <option value="UPI">UPI</option>

              <option value="CARD">CARD</option>

              <option value="NET_BANKING">NET BANKING</option>

              <option value="CASH">CASH</option>
            </select>
          </div>

          <button
            className="btn btn-success"
            disabled={!selectedPolicy || !amount || isLocked}
          >
            Pay Premium Now
          </button>

          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary ms-2"
            disabled={!receiptData}
            onClick={() => downloadReceiptFile(receiptData)}
          >
            Download Receipt
          </button>
        </form>

        <div className="mt-5">
          <h4>Premium Payment History</h4>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Policy</th>

                <th>Date</th>

                <th>Amount</th>

                <th>Mode</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paymentHistory.map((item) => (
                <tr key={item.paymentId || item.id}>
                  <td>{item.policyNumber}</td>

                  <td>
                    {item.paymentDate
                      ? new Date(item.paymentDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>₹ {item.amount}</td>

                  <td>{item.paymentMode}</td>

                  <td>
                    <span
                      className={`badge ${
                        item.paymentStatus === "SUCCESS" ||
                        item.paymentStatus === "PAID"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => downloadReceiptFile(item)}
                    >
                      📥 Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default PayPremium;
