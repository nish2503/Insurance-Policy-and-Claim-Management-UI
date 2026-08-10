import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";

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
  
  const [showUpiGateway, setShowUpiGateway] = useState(false);
  const [showMockGateway, setShowMockGateway] = useState(false);

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [receiptData, setReceiptData] = useState(null);

  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: ""
  });
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayError, setGatewayError] = useState("");

  // 🛠️ HOISTING COMPLIANCE: Declared at top so change events can read it safely
  const validatorMap = {
    selectedPolicy: (value) => required(value, "Policy"),
    paymentMode: (value) => required(value, "Payment mode"),
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const policyRes = await getMyPolicies();
      setPolicies(
        policyRes.data.records || policyRes.data.content || policyRes.data || []
      );
      loadPayments();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load your policies"));
    }
  }

  async function loadPayments() {
    try {
      // NOTE: unlike other /my endpoints, GET /premium-payments/my returns a
      // plain List<PremiumPaymentResponseDTO>, not the paginated
      // { records, content, totalPages, isLastPage } shape. Don't run it
      // through fetchAllPages (which expects that paginated shape) — it
      // would silently resolve to an empty array every time.
      const res = await getMyPremiumPayments();
      setPaymentHistory(res.data || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load payment history"));
    }
  }

  function handlePaymentInit(e) {
    e.preventDefault();
    
    const { errors, isValid } = validateForm(
      { selectedPolicy, paymentMode }, 
      validatorMap
    );

    if (!isValid) {
      setFieldErrors(errors);
      setTouched({ selectedPolicy: true, paymentMode: true });
      toast.error("Please fill in the required fields.");
      return;
    }

    if (isLocked) {
      toast.error("Premium already paid for this cycle");
      return;
    }

    setGatewayError("");

    if (paymentMode === "CARD") {
      setCardForm({ cardNumber: "", expiry: "", cvv: "", cardName: "" });
      setShowMockGateway(true); 
    } else if (paymentMode === "UPI") {
      setShowUpiGateway(true);   
    } else {
      setSubmitting(true);
      setTimeout(() => {
        executeDirectPayment();
      }, 1500);
    }
  }

  async function executeDirectPayment(simulateFailure = false) {
    const matchedPolicy = policies.find(p => String(p.policyId || p.id) === String(selectedPolicy));
    const ref = "TXN_DIR_" + Date.now();
    try {
      const res = await payPremium({
        policyId: Number(selectedPolicy),
        amount: Number(amount),
        paymentMode: paymentMode,
        transactionReference: ref,
        simulateFailure,
      });

      // The backend is the source of truth for the outcome — a simulated
      // (or real, future) gateway decline comes back as a normal 201
      // response with paymentStatus: "FAILED", not an HTTP error. Only
      // treat the payment as settled, and only show the receipt, when the
      // server confirms SUCCESS. The policy itself is never touched by the
      // backend on a FAILED outcome, so we just refresh and surface it.
      if (res.data.paymentStatus === "FAILED") {
        toast.error("Payment declined by the gateway. The policy has not been charged — please try again.");
        loadInitialData();
        return;
      }

      toast.success("Premium settled successfully!");

      setReceiptData({
        policyNumber: matchedPolicy?.policyNumber || selectedPolicy,
        planName: matchedPolicy?.planName || "Insurance Plan",
        amountPaid: amount,
        mode: paymentMode,
        reference: ref,
        date: new Date().toLocaleString(),
      });
      
      setSelectedPolicy(""); setAmount(""); setPaymentMode(""); setTouched({}); setFieldErrors({});
      loadInitialData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Payment could not be completed."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMockPaymentSubmit(e) {
    e.preventDefault();
    setGatewayError("");

    if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) {
      setGatewayError("Invalid card number. Must be 16 digits.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardForm.expiry)) {
      setGatewayError("Invalid expiry format. Use MM/YY.");
      return;
    }
    if (cardForm.cvv.length !== 3) {
      setGatewayError("Security code CVV must be exactly 3 digits.");
      return;
    }
    if (!cardForm.cardName.trim()) {
      setGatewayError("Cardholder name is required.");
      return;
    }

    // Standard test card number for simulating a bank decline (same number
    // real gateways like Stripe reserve for this in test mode), so the
    // decline path can be exercised without a real payment processor.
    const isDeclineTestCard = cardForm.cardNumber.replace(/\s/g, "") === "4000000000000002";

    setGatewayProcessing(true);
    
    setTimeout(async () => {
      const matchedPolicy = policies.find(
        (p) => String(p.policyId || p.id) === String(selectedPolicy)
      );
      const ref = "MOCK_TXN_" + Date.now();

      try {
        const res = await payPremium({
          policyId: Number(selectedPolicy),
          amount: Number(amount),
          paymentMode: paymentMode,
          transactionReference: ref,
          simulateFailure: isDeclineTestCard,
        });

        // The backend, not this mock UI, decides the outcome — a decline
        // comes back as a normal response with paymentStatus: "FAILED".
        // The policy is never touched by the backend in that case.
        if (res.data.paymentStatus === "FAILED") {
          setGatewayError("Your card was declined by the issuing bank. No charge was made.");
          loadInitialData();
          return;
        }

        toast.success("Premium paid successfully!");

        setReceiptData({
          policyNumber: matchedPolicy?.policyNumber || selectedPolicy,
          planName: matchedPolicy?.planName || "Insurance Plan",
          amountPaid: amount,
          mode: paymentMode,
          reference: ref,
          date: new Date().toLocaleString(),
        });

        setSelectedPolicy(""); setAmount(""); setPaymentMode(""); setTouched({}); setFieldErrors({});
        setShowMockGateway(false);
        loadInitialData(); 
      } catch (error) {
        setGatewayError(getApiErrorMessage(error, "Bank transaction declined by merchant server bounds."));
      } finally {
        setGatewayProcessing(false);
      }
    }, 2000);
  }

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
      (p) => String(p.policyId || p.id) === String(policyId)
    );

    if (policy) {
      setAmount(policy.premiumAmount || policy.amount || "");

      if (policy.nextPremiumDueDate) {
        const dueDate = new Date(policy.nextPremiumDueDate);
        const today = new Date();
        if (today < dueDate) {
          setIsLocked(true);
          toast.info(`Premium already paid. Next payment due on ${dueDate.toLocaleDateString()}`);
        }
      }
    }
  }

  function handleModeChange(e) {
    setPaymentMode(e.target.value);
    if (touched.paymentMode) runFieldValidation("paymentMode", e.target.value);
  }

  function handleCancel() {
    setSelectedPolicy(""); setAmount(""); setPaymentMode(""); setReceiptData(null);
    toast.info("Payment cancelled");
    navigate("/customer");
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
      <Card title="Pay Premium Balance">
        <BackButton />

        {infoMsg && <div className="alert alert-warning mt-3">{infoMsg}</div>}

        <form onSubmit={handlePaymentInit} noValidate>
          <div className="mb-3">
            <label className="form-label font-weight-bold">
              Select Active Policy <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${touched.selectedPolicy && fieldErrors.selectedPolicy ? "is-invalid" : ""}`}
              value={selectedPolicy}
              onChange={handlePolicyChange}
              onBlur={(e) => handleBlur("selectedPolicy", e.target.value)}
            >
              <option value="">-- Choose active policy --</option>
              {policies
                .filter((p) =>
                  ["PENDING_PAYMENT", "ACTIVE"].includes(p.policyStatus)
                )
                .map((p) => (
                  <option key={p.policyId || p.id} value={p.policyId || p.id}>
                    {p.policyNumber} - {p.planName || "Insurance Plan"}
                  </option>
                ))}
            </select>
            {touched.selectedPolicy && fieldErrors.selectedPolicy && (
              <div className="invalid-feedback d-block">{fieldErrors.selectedPolicy}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label font-weight-bold">Premium Amount Due</label>
            <input className="form-control bg-light font-weight-bold text-dark" value={amount ? `₹${Number(amount).toLocaleString()}` : ""} readOnly />
          </div>

          <div className="mb-4">
            <label className="form-label font-weight-bold">
              Payment Method Chosen <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${touched.paymentMode && fieldErrors.paymentMode ? "is-invalid" : ""}`}
              value={paymentMode}
              onChange={handleModeChange}
              onBlur={(e) => handleBlur("paymentMode", e.target.value)}
              disabled={isLocked}
            >
              <option value="">-- Select payment mode --</option>
              <option value="UPI">UPI (Unified Payments Interface)</option>
              <option value="CARD">Credit / Debit Card Online</option>
              <option value="NET_BANKING">Net Banking Transfer</option>
            </select>
            {touched.paymentMode && fieldErrors.paymentMode && (
              <div className="invalid-feedback d-block">{fieldErrors.paymentMode}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={!selectedPolicy || !amount || isLocked || submitting}>
              {submitting ? "Processing transaction..." : "Pay Premium Now"}
            </Button>
            <Button type="button" variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" variant="outline-primary" disabled={!receiptData} onClick={() => downloadReceiptFile(receiptData)}>
              📥 Download Receipt
            </Button>
          </div>
        </form>

        {/* Premium Payment History Table Matrix */}
        <div className="mt-5">
          <h5 className="font-weight-bold text-secondary mb-3">Premium Payment Settlement Ledger</h5>
          <DataTable
            emptyMessage="No Payments Found"
            columns={[
              { key: "policyNumber", label: "Policy Number" },
              {
                key: "paymentDate",
                label: "Date Settled",
                render: (row) =>
                  row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "N/A",
              },
              {
                key: "amount",
                label: "Amount Paid",
                render: (row) => (
                  <span className="font-weight-bold text-success">
                    ₹{Number(row.amount).toLocaleString()}
                  </span>
                ),
              },
              { key: "paymentMode", label: "Method" },
              {
                key: "paymentStatus",
                label: "Status",
                render: (row) => <StatusBadge status={row.paymentStatus || "SUCCESS"} />,
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <button
                    className="btn btn-sm btn-outline-primary py-0"
                    onClick={() => downloadReceiptFile({
                      date: new Date(row.paymentDate).toLocaleString(),
                      reference: row.transactionReference,
                      policyNumber: row.policyNumber,
                      planName: row.planName || "Insurance Plan",
                      amountPaid: row.amount,
                      mode: row.paymentMode
                    })}
                  >
                    📥 Receipt
                  </button>
                ),
              },
            ]}
            data={paymentHistory}
            searchKeys={["policyNumber", "transactionReference", "paymentMode", "paymentStatus"]}
            headerActions={({ pageRows, filteredRows }) => {
              const columns = [
                { label: "Policy Number", key: "policyNumber" },
                {
                  label: "Date Settled",
                  value: (row) =>
                    row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "N/A",
                },
                { label: "Amount Paid", value: (row) => `₹${Number(row.amount).toLocaleString()}` },
                { label: "Method", key: "paymentMode" },
                { label: "Status", key: "paymentStatus" },
                { label: "Transaction Ref", key: "transactionReference" },
              ];

              return (
                <div className="d-flex gap-2">
                  <ExportPdfButton
                    title="Premium Payments (This Page)"
                    fileName="premium-payments-page"
                    label="Export Page"
                    rows={pageRows}
                    columns={columns}
                  />

                  <ExportPdfButton
                    title="Premium Payments (All)"
                    fileName="premium-payments-all"
                    label="Export All"
                    rows={filteredRows}
                    columns={columns}
                  />
                </div>
              );
            }}
          />
        </div>
      </Card>

      {/* Credit Card Sandbox Checkout Pop-up View Overlay */}
      {showMockGateway && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
              <div className="modal-header border-0 bg-primary text-white p-4" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-lock-fill fs-4"></i>
                  <div>
                    <h5 className="modal-title font-weight-bold mb-0">InsurTech Secure Checkout</h5>
                    <small className="opacity-75">Simulated Payment Sandbox</small>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => !gatewayProcessing && setShowMockGateway(false)} disabled={gatewayProcessing}></button>
              </div>

              <div className="modal-body p-4 bg-light">
                <div className="alert alert-primary py-2 px-3 mb-4 rounded d-flex justify-content-between align-items-center">
                  <span className="font-weight-bold text-muted">Amount Due:</span>
                                    <span className="font-weight-bold text-primary fs-5">₹{Number(amount).toLocaleString()}</span>
                </div>

                {gatewayError && <div className="alert alert-danger py-2 px-3 small border-0 font-weight-bold mb-3">{gatewayError}</div>}

                <div className="alert alert-secondary py-2 px-3 small mb-3">
                  Sandbox mode: use <strong>4111 1111 1111 1111</strong> for a successful test payment,
                  or <strong>4000 0000 0000 0002</strong> to simulate a declined card.
                </div>

                <form onSubmit={handleMockPaymentSubmit}>
                  <div className="mb-3">
                    <label className="form-label font-weight-bold text-muted small mb-1">Card Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-credit-card-2-front"></i></span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="4111 2222 3333 4444"
                        maxLength="19"
                        value={cardForm.cardNumber}
                        disabled={gatewayProcessing}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardForm(prev => ({ ...prev, cardNumber: val }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label font-weight-bold text-muted small mb-1">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control text-center"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardForm.expiry}
                        disabled={gatewayProcessing}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                          setCardForm(prev => ({ ...prev, expiry: val }));
                        }}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label font-weight-bold text-muted small mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        className="form-control text-center"
                        placeholder="***"
                        maxLength="3"
                        value={cardForm.cvv}
                        disabled={gatewayProcessing}
                        onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, "") }))}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label font-weight-bold text-muted small mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      placeholder="e.g., JOHN DOE"
                      value={cardForm.cardName}
                      disabled={gatewayProcessing}
                      onChange={(e) => setCardForm(prev => ({ ...prev, cardName: e.target.value }))}
                    />
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <button type="submit" className="btn btn-success py-2 font-weight-bold d-flex align-items-center justify-content-center gap-2" disabled={gatewayProcessing}>
                      {gatewayProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Authorizing payment...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lock-fill"></i>
                          <span>Authorize Settlement Payment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI QR Code Simulator View Overlay Modal Container */}
      {showUpiGateway && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "380px" }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
              <div className="modal-header border-0 bg-dark text-white p-4 text-center d-block" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                <h5 className="modal-title font-weight-bold mb-1">Scan QR Code to Pay</h5>
                <small className="text-warning font-weight-bold">Simulated UPI Sandbox Environment</small>
              </div>

              <div className="modal-body p-4 bg-white text-center">
                <div className="mb-2 text-muted small">Amount to Transfer:</div>
                <h3 className="font-weight-bold text-dark mb-4">₹{Number(amount).toLocaleString()}</h3>

                <div className="p-3 bg-light rounded d-inline-block border mb-4 shadow-sm">
                  <div className="d-flex align-items-center justify-content-center bg-white border border-secondary rounded" style={{ width: "180px", height: "180px", position: "relative" }}>
                    <span className="text-muted fw-bold" style={{ fontSize: "3rem" }}>🏁</span>
                    <small className="d-block text-dark font-weight-bold position-absolute bottom-0 mb-2" style={{ fontSize: "0.65rem" }}>
                      INSURTECH_PAY@UPI
                    </small>
                  </div>
                </div>

                <p className="text-muted small px-2 mb-4" style={{ lineHeight: "1.4" }}>
                  Open your payment app (Google Pay, PhonePe, or Paytm) to scan this test anchor node.
                </p>

                <div className="d-flex flex-column gap-2">
                  <button 
                    type="button" 
                    className="btn btn-success py-2 font-weight-bold"
                    onClick={async () => {
                      setShowUpiGateway(false);
                      setSubmitting(true);
                      executeDirectPayment(false);
                    }}
                  >
                    Simulate Successful Scan ✓
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger py-2 font-weight-bold"
                    onClick={async () => {
                      setShowUpiGateway(false);
                      setSubmitting(true);
                      executeDirectPayment(true);
                    }}
                  >
                    Simulate Failed Scan ✕
                  </button>
                  <button type="button" className="btn btn-link text-muted small text-decoration-none py-1" onClick={() => setShowUpiGateway(false)}>
                    Cancel Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default PayPremium;