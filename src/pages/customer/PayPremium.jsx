import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";

import {
  getMyPolicies,
  payPremium,
  getMyPremiumPayments,
} from "../../api/customerApi";

import { required, validateForm } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

function PayPremium() {
  const navigate = useNavigate();
  const toast = useToast();

  const [policies, setPolicies] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      toast.error(getApiErrorMessage(error, "Unable to load your policies"));
    }
  }

  async function loadPayments() {
    try {
      const res = await getMyPremiumPayments();
      setPaymentHistory(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load payment history"));
    }
  }

  const validatorMap = {
    selectedPolicy: (value) => required(value, "Policy"),
    paymentMode: (value) => required(value, "Payment mode"),
  };

  function runFieldValidation(field, value) {
    const message = validatorMap[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runFieldValidation(field, value);
  }

  function handlePolicyChange(e) {
    const policyId = e.target.value;
    setSelectedPolicy(policyId);
    if (touched.selectedPolicy) runFieldValidation("selectedPolicy", policyId);

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
    if (touched.paymentMode) runFieldValidation("paymentMode", e.target.value);
  }

  function handleCancel() {
    setSelectedPolicy("");
    setAmount("");
    setPaymentMode("");
    setReceiptData(null);
    setTouched({});
    setFieldErrors({});
    navigate("/customer");
  }

  async function handlePayment(e) {
    e.preventDefault();

    const { errors, isValid } = validateForm(
      { selectedPolicy, paymentMode },
      validatorMap,
    );
    setFieldErrors(errors);
    setTouched({ selectedPolicy: true, paymentMode: true });

    if (!isValid) return;

    if (isLocked) {
      toast.error("Premium already paid for this cycle");
      return;
    }

    const matchedPolicy = policies.find(
      (p) => String(p.policyId || p.id) === String(selectedPolicy),
    );

    const ref = "TXN" + Date.now();

    setSubmitting(true);
    try {
      await payPremium({
        policyId: Number(selectedPolicy),
        amount: Number(amount),
        paymentMode,
        transactionReference: ref,
        paymentStatus: "SUCCESS",
      });

      toast.success("Premium paid successfully");

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
      setTouched({});
      setFieldErrors({});

      loadInitialData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Payment failed"));
    } finally {
      setSubmitting(false);
    }
  }

  function downloadReceiptFile(data) {
    if (!data) return;

    const receiptText = `
INSURANCE PREMIUM PAYMENT RECEIPT

Date: ${data.date}
Transaction: ${data.reference}
Policy: ${data.policyNumber}
Plan: ${data.planName}
Amount: INR ${data.amountPaid}
Mode: ${data.mode}
Status: SUCCESS
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

        {infoMsg && <div className="alert alert-warning mt-3">{infoMsg}</div>}

        <form onSubmit={handlePayment} noValidate>
          <div className="mb-3">
            <label className="form-label">
              Select Policy <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${
                touched.selectedPolicy && fieldErrors.selectedPolicy
                  ? "is-invalid"
                  : ""
              }`}
              value={selectedPolicy}
              onChange={handlePolicyChange}
              onBlur={(e) => handleBlur("selectedPolicy", e.target.value)}
              aria-invalid={
                touched.selectedPolicy && !!fieldErrors.selectedPolicy
              }
            >
              <option value="">Choose Option</option>
              {policies.map((p) => (
                <option key={p.policyId || p.id} value={p.policyId || p.id}>
                  {p.policyNumber} - {p.planName || "Insurance Plan"}
                </option>
              ))}
            </select>
            {touched.selectedPolicy && fieldErrors.selectedPolicy && (
              <div className="invalid-feedback d-block">
                {fieldErrors.selectedPolicy}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Premium Amount</label>
            <input className="form-control" value={amount} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Payment Mode <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${
                touched.paymentMode && fieldErrors.paymentMode
                  ? "is-invalid"
                  : ""
              }`}
              value={paymentMode}
              onChange={handleModeChange}
              onBlur={(e) => handleBlur("paymentMode", e.target.value)}
              disabled={isLocked}
              aria-invalid={touched.paymentMode && !!fieldErrors.paymentMode}
            >
              <option value="">Choose Option</option>
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="NET_BANKING">NET BANKING</option>
              <option value="CASH">CASH</option>
            </select>
            {touched.paymentMode && fieldErrors.paymentMode && (
              <div className="invalid-feedback d-block">
                {fieldErrors.paymentMode}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="success"
            disabled={!selectedPolicy || !amount || isLocked || submitting}
          >
            {submitting ? "Processing..." : "Pay Premium Now"}
          </Button>
          <Button
            type="button"
            variant="danger"
            className="ms-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="ms-2"
            disabled={!receiptData}
            onClick={() => downloadReceiptFile(receiptData)}
          >
            Download Receipt
          </Button>
        </form>

        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Premium Payment History</h4>
            <ExportPdfButton
              title="Premium Payment History"
              rows={paymentHistory}
              columns={[
                { label: "Policy", key: "policyNumber" },
                {
                  label: "Date",
                  value: (row) =>
                    row.paymentDate
                      ? new Date(row.paymentDate).toLocaleDateString()
                      : "N/A",
                },
                { label: "Amount", value: (row) => `₹${row.amount}` },
                { label: "Mode", key: "paymentMode" },
                { label: "Status", key: "paymentStatus" },
              ]}
            />
          </div>

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
