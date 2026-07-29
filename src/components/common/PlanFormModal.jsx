import { useEffect, useState } from "react";

import Modal from "./Modal";
import Button from "./Button";

import { getProducts } from "../../api/productApi";
import { calculatePremium, PREMIUM_TYPES } from "../../utils/premiumFormula";
import {
  validateWholeNumber,
  validateMultipleOf50000,
  validatePercentRange,
} from "../../utils/validators";

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
    minCoverageAmount: "",
    maxCoverageAmount: "",
    ratePerUnit: "",
    annualDiscountPercent: "0",
    oneTimeDiscountPercent: "0",
    premiumType: PREMIUM_TYPES[0],
    duration: "",
    termsAndConditions: "",
    activeStatus: true,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data.records || res.data.content || res.data || []);
    } catch (err) {
      console.error("Failed to load products directory: ", err);
    }
  }

  useEffect(() => {
    if (plan) {
      setForm({
        productId: plan.productId || "",
        planName: plan.planName || "",
        minCoverageAmount: plan.minCoverageAmount || "",
        maxCoverageAmount: plan.maxCoverageAmount || "",
        ratePerUnit: plan.ratePerUnit || "",
        annualDiscountPercent:
          plan.annualDiscountPercent !== undefined && plan.annualDiscountPercent !== null
            ? String(plan.annualDiscountPercent)
            : "0",
        oneTimeDiscountPercent:
          plan.oneTimeDiscountPercent !== undefined && plan.oneTimeDiscountPercent !== null
            ? String(plan.oneTimeDiscountPercent)
            : "0",
        premiumType: plan.premiumType || PREMIUM_TYPES[0],
        duration: plan.duration || "",
        termsAndConditions: plan.termsAndConditions || "",
        activeStatus: plan.activeStatus !== undefined ? plan.activeStatus : true,
      });
    } else {
      setForm({
        productId: "",
        planName: "",
        minCoverageAmount: "",
        maxCoverageAmount: "",
        ratePerUnit: "",
        annualDiscountPercent: "0",
        oneTimeDiscountPercent: "0",
        premiumType: PREMIUM_TYPES[0],
        duration: "",
        termsAndConditions: "",
        activeStatus: true,
      });
    }
    setFieldErrors({});
  }, [plan, show]);

  // Live, informational-only reference premium: "what would a customer pay
  // at max coverage under the selected frequency". Purely a mirror of the
  // admin's own just-typed numbers — the backend recomputes independently
  // whenever a real quote or purchase happens.
  const referencePremium = calculatePremium({
    coverageAmount: form.maxCoverageAmount,
    ratePerUnit: form.ratePerUnit,
    duration: form.duration,
    premiumType: form.premiumType,
    annualDiscountPercent: form.annualDiscountPercent,
    oneTimeDiscountPercent: form.oneTimeDiscountPercent,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  }

  function validateBeforeSubmit() {
    const errors = {};

    const minError = validateMultipleOf50000(form.minCoverageAmount, "Minimum coverage amount");
    if (minError) errors.minCoverageAmount = minError;

    const maxError = validateMultipleOf50000(form.maxCoverageAmount, "Maximum coverage amount");
    if (maxError) errors.maxCoverageAmount = maxError;

    if (!minError && !maxError && Number(form.minCoverageAmount) > Number(form.maxCoverageAmount)) {
      errors.maxCoverageAmount = "Maximum coverage amount must be greater than or equal to the minimum coverage amount";
    }

    if (!form.ratePerUnit || Number(form.ratePerUnit) <= 0) {
      errors.ratePerUnit = "Rate per ₹50,000 of coverage must be greater than zero";
    }

    const annualDiscountError = validatePercentRange(form.annualDiscountPercent, "Annual payment discount");
    if (annualDiscountError) errors.annualDiscountPercent = annualDiscountError;

    const oneTimeDiscountError = validatePercentRange(form.oneTimeDiscountPercent, "One-time payment discount");
    if (oneTimeDiscountError) errors.oneTimeDiscountPercent = oneTimeDiscountError;

    const durationError = validateWholeNumber(form.duration, "Duration (years)");
    if (durationError) errors.duration = durationError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateBeforeSubmit()) return;

    onSubmit({
      ...form,
      minCoverageAmount: Number(form.minCoverageAmount),
      maxCoverageAmount: Number(form.maxCoverageAmount),
      ratePerUnit: Number(form.ratePerUnit),
      annualDiscountPercent: Number(form.annualDiscountPercent),
      oneTimeDiscountPercent: Number(form.oneTimeDiscountPercent),
      duration: Number(form.duration),
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
            <label className="form-label font-weight-bold small text-muted">Minimum Coverage a Customer May Choose (INR) <span className="text-danger">*</span></label>
            <input
              type="number"
              step="50000"
              min="50000"
              className={`form-control ${fieldErrors.minCoverageAmount ? "is-invalid" : ""}`}
              name="minCoverageAmount"
              value={form.minCoverageAmount}
              onChange={handleChange}
              placeholder="e.g., 100000"
              required
            />
            {fieldErrors.minCoverageAmount && (
              <div className="invalid-feedback d-block">{fieldErrors.minCoverageAmount}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Maximum Coverage a Customer May Choose (INR) <span className="text-danger">*</span></label>
            <input
              type="number"
              step="50000"
              min="50000"
              className={`form-control ${fieldErrors.maxCoverageAmount ? "is-invalid" : ""}`}
              name="maxCoverageAmount"
              value={form.maxCoverageAmount}
              onChange={handleChange}
              placeholder="Ceiling coverage amount for this plan"
              required
            />
            {fieldErrors.maxCoverageAmount && (
              <div className="invalid-feedback d-block">{fieldErrors.maxCoverageAmount}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">
              Rate per ₹50,000 of Coverage (INR/year) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className={`form-control ${fieldErrors.ratePerUnit ? "is-invalid" : ""}`}
              name="ratePerUnit"
              value={form.ratePerUnit}
              onChange={handleChange}
              placeholder="e.g., 500"
              required
            />
            {fieldErrors.ratePerUnit && (
              <div className="invalid-feedback d-block">{fieldErrors.ratePerUnit}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Default Payment Frequency</label>
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
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">Annual Payment Discount (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              className={`form-control ${fieldErrors.annualDiscountPercent ? "is-invalid" : ""}`}
              name="annualDiscountPercent"
              value={form.annualDiscountPercent}
              onChange={handleChange}
              placeholder="e.g., 8"
            />
            {fieldErrors.annualDiscountPercent && (
              <div className="invalid-feedback d-block">{fieldErrors.annualDiscountPercent}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label font-weight-bold small text-muted">One-Time Payment Discount (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              className={`form-control ${fieldErrors.oneTimeDiscountPercent ? "is-invalid" : ""}`}
              name="oneTimeDiscountPercent"
              value={form.oneTimeDiscountPercent}
              onChange={handleChange}
              placeholder="e.g., 15"
            />
            {fieldErrors.oneTimeDiscountPercent && (
              <div className="invalid-feedback d-block">{fieldErrors.oneTimeDiscountPercent}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label font-weight-bold small text-muted">Reference Premium at Max Coverage (INR)</label>
          <input
            type="text"
            className="form-control bg-light text-primary font-weight-bold"
            value={
              referencePremium !== null
                ? `₹${referencePremium.toLocaleString()} (${form.premiumType.replace(/_/g, " ")})`
                : "Awaiting coverage/rate/duration..."
            }
            readOnly
          />
          <small className="text-muted d-block mt-1">
            Informational preview only, computed from the values above. The server independently
            recalculates the actual premium for every customer purchase.
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label font-weight-bold small text-muted">Term Length Duration (Years) <span className="text-danger">*</span></label>
          <input
            type="number"
            step="1"
            min="1"
            className={`form-control ${fieldErrors.duration ? "is-invalid" : ""}`}
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g., 5"
            required
          />
          {fieldErrors.duration && (
            <div className="invalid-feedback d-block">{fieldErrors.duration}</div>
          )}
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