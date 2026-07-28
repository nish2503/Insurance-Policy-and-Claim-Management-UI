import { useEffect, useState } from "react";

import Modal from "./Modal";
import Button from "./Button";

import { getProducts } from "../../api/productApi";

const PREMIUM_TYPES = ["MONTHLY", "QUARTERLY", "ANNUAL", "ONE_TIME"];

function PlanFormModal({
  show,
  onClose,
  onSubmit,
  plan,
}) {
  const editModeActiveCheck = Boolean(plan);

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    planName: "",
    coverageAmount: "",
    premiumAmount: "",
    premiumType: PREMIUM_TYPES[0],
    duration: "",
    termsAndConditions: "",
    activeStatus: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();
      // Flexible array unpacking supports both raw lists and spring boot paginated content wrappers
      setProducts(res.data.records || res.data.content || res.data || []);
    } catch (err) {
      console.error("Failed to load products directory: ", err);
    }
  }

  const calculateAutomatedPremiumValue = (coverage, term, premiumType) => {
    const coverageNum = Number(coverage);
    const yearsNum = Number(term);

    if (!coverageNum || coverageNum <= 0 || !yearsNum || yearsNum <= 0) {
        return "";
    }

    let baselineRate = 0.05;

    if (yearsNum >= 5) baselineRate = 0.042;
    if (yearsNum >= 10) baselineRate = 0.035;

    const annualBase = coverageNum / yearsNum;

    // Calculate annual premium first
    let calculatedPremium = annualBase * (1 + baselineRate);

    // Adjust based on premium type
    if (premiumType === "MONTHLY") {
        calculatedPremium /= 12;
    } else if (premiumType === "QUARTERLY") {
        calculatedPremium /= 4;
    }

    // Round Annual and One-Time premiums to nearest ₹50,000
    if (premiumType === "ANNUAL" || premiumType === "ONE_TIME") {
        calculatedPremium =
            Math.round(calculatedPremium / 50000) * 50000;
    }

    return Math.round(calculatedPremium).toString();
};

  useEffect(() => {
    if (plan) {
      setForm({
        productId: plan.productId || "",
        planName: plan.planName || "",
        coverageAmount: plan.coverageAmount || "",
        premiumAmount: plan.premiumAmount || "",
        premiumType: plan.premiumType || PREMIUM_TYPES[0],
        duration: plan.duration || "",
        termsAndConditions: plan.termsAndConditions || "",
        activeStatus: plan.activeStatus !== undefined ? plan.activeStatus : true,
      });
    } else {
      setForm({
        productId: "",
        planName: "",
        coverageAmount: "",
        premiumAmount: "",
        premiumType: PREMIUM_TYPES[0],
        duration: "",
        termsAndConditions: "",
        activeStatus: true,
      });
    }
  }, [plan, show]);

  // Synchronize form calculation state instantly as duration or coverage fields modify
  useEffect(() => {
    if (!editModeActiveCheck) {
      const computedAmount = calculateAutomatedPremiumValue(form.coverageAmount, form.duration,form.premiumType);
      setForm(prev => {
        if (prev.premiumAmount === computedAmount) return prev;
        return { ...prev, premiumAmount: computedAmount };
      });
    }
  }, [form.coverageAmount, form.duration, form.premiumType]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: nextValue };
      
      // Auto-recalculate immediately if changing criteria parameters
      if (name === "coverageAmount" || name === "duration") {
        updated.premiumAmount = calculateAutomatedPremiumValue(
          name === "coverageAmount" ? nextValue : prev.coverageAmount,
          name === "duration" ? nextValue : prev.duration,
          name === "premiumType" ? nextValue : prev.premiumType
        );
      }
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Ensure final calculated amounts are cleanly integrated right on post back dispatch execution strings
    const finalAmount = calculateAutomatedPremiumValue(form.coverageAmount, form.duratio,form.premiumType);
    const coverage = Number(form.coverageAmount);

if (coverage % 50000 !== 0) {
    alert("Coverage amount must be in multiples of 50,000.");
    return;
}
    onSubmit({
      ...form,
      premiumAmount: Number(finalAmount)
    });
  }

  return (
    <Modal
      show={show}
      title={plan ? "Modify Insurance Plan" : "Create New Insurance Plan"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label font-weight-bold small text-muted">Product Domain Context</label>
          {plan ? (
            <input className="form-control bg-light" value={plan.productName || "Insurance Product"} readOnly />
          ) : (
            <select
              className="form-select"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            >
              <option value="">Select a product domain</option>
              {products.map((product) => (
                <option key={product.productId || product.id} value={product.productId || product.id}>
                  {product.productName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label font-weight-bold small text-muted">Plan Name <span className="text-danger">*</span></label>
          <input
            className="form-control"
            name="planName"
            value={form.planName}
            onChange={handleChange}
            placeholder="e.g., Premium Family Shield"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Coverage Amount (INR) <span className="text-danger">*</span></label>
            <input
              type="number"
              step="50000"
              min="50000"
              className="form-control"
              name="coverageAmount"
              value={form.coverageAmount}
              onChange={handleChange}
              placeholder="Total available payout limit"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Automated Premium Due (INR)</label>
            <input
              type="text"
              className="form-control bg-light text-primary font-weight-bold"
              name="premiumAmount"
              value={form.premiumAmount ? `₹${Number(form.premiumAmount).toLocaleString()}` : "Awaiting coverage variables..."}
              readOnly // 🔒 Secured read-only state block prevents text-field typing tamperings
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Payment Frequency</label>
            <select
              className="form-select"
              name="premiumType"
              value={form.premiumType}
              onChange={handleChange}
            >
              {PREMIUM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Term Length Duration (Years) <span className="text-danger">*</span></label>
            <input
              type="number"
              step="1"
              min="1"
              className="form-control"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 5"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label font-weight-bold small text-muted">Terms & Conditions <span className="text-danger">*</span></label>
          <textarea
            rows="4"
            className="form-control"
            name="termsAndConditions"
            value={form.termsAndConditions}
            onChange={handleChange}
            placeholder="Provide legal terms and claim guidelines..."
            required
          />
        </div>

        <div className="form-check mb-3 p-1 d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input ms-0"
            id="activeStatusCheck"
            name="activeStatus"
            checked={form.activeStatus}
            onChange={handleChange}
          />
          <label className="form-check-label font-weight-bold text-muted small" htmlFor="activeStatusCheck">
            Make this plan available for active customer purchases immediately
          </label>
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {plan ? "Save Plan Updates" : "Add Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PlanFormModal;