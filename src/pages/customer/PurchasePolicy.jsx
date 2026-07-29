import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";

import { purchasePolicy, getPlanById, getPremiumQuote } from "../../api/customerApi";
import { validateNotPastDate, validateMultipleOf50000 } from "../../utils/validators";
import { PREMIUM_TYPES } from "../../utils/premiumFormula";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

const TODAY_ISO = new Date().toISOString().split("T")[0];
const QUOTE_DEBOUNCE_MS = 400;

function PurchasePolicy() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [premiumType, setPremiumType] = useState(PREMIUM_TYPES[0]);

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Server-computed quote — never derived client-side. Null until the
  // first successful quote call returns.
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  async function loadPlan() {
    try {
      const res = await getPlanById(planId);
      const data = res.data;
      setPlan(data);
      // Default the picker to the plan's max coverage so the preview isn't blank.
      setCoverageAmount(data.maxCoverageAmount ? String(data.maxCoverageAmount) : "");
      setPremiumType(data.premiumType || PREMIUM_TYPES[0]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load plan details"));
    } finally {
      setLoadingPlan(false);
    }
  }

  const minCoverage = Number(plan?.minCoverageAmount) || 50000;
  const maxCoverage = Number(plan?.maxCoverageAmount) || 0;

  function validateDate(value) {
    const message = validateNotPastDate(value, "Start date");
    setFieldErrors((prev) => ({ ...prev, startDate: message }));
    return message;
  }

  function validateCoverage(value) {
    const base = validateMultipleOf50000(value, "Coverage amount");
    let message = base;
    if (!message && plan) {
      if (Number(value) < minCoverage || Number(value) > maxCoverage) {
        message = `Coverage amount must be between ₹${minCoverage.toLocaleString()} and ₹${maxCoverage.toLocaleString()} for this plan`;
      }
    }
    setFieldErrors((prev) => ({ ...prev, coverageAmount: message }));
    return message;
  }

  function handleDateChange(e) {
    setStartDate(e.target.value);
    if (touched.startDate) validateDate(e.target.value);
  }

  function handleCoverageChange(e) {
    setCoverageAmount(e.target.value);
    if (touched.coverageAmount) validateCoverage(e.target.value);
  }

  function handlePremiumTypeChange(e) {
    setPremiumType(e.target.value);
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "startDate") validateDate(value);
    if (field === "coverageAmount") validateCoverage(value);
  }

  // Debounced server-side quote — fires whenever coverage/frequency change
  // and the current coverage value is in-bounds. This is the only source
  // of the premium shown to the customer; nothing is computed client-side.
  useEffect(() => {
    if (!plan || !coverageAmount || !premiumType) {
      setQuote(null);
      return;
    }

    const coverageNum = Number(coverageAmount);
    if (!coverageNum || coverageNum < minCoverage || coverageNum > maxCoverage) {
      setQuote(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchQuote(coverageNum, premiumType);
    }, QUOTE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, coverageAmount, premiumType]);

  async function fetchQuote(coverageNum, type) {
    setQuoteLoading(true);
    setQuoteError("");
    try {
      const res = await getPremiumQuote(planId, {
        coverageAmount: coverageNum,
        premiumType: type,
      });
      setQuote(res.data);
    } catch (error) {
      setQuote(null);
      setQuoteError(getApiErrorMessage(error, "Unable to calculate premium for this selection"));
    } finally {
      setQuoteLoading(false);
    }
  }

  async function handlePurchase(e) {
    e.preventDefault();
    setTouched({ startDate: true, coverageAmount: true });

    const dateError = validateDate(startDate);
    const coverageError = validateCoverage(coverageAmount);
    if (dateError || coverageError) return;

    setSubmitting(true);
    try {
      await purchasePolicy({
        planId: Number(planId),
        startDate,
        coverageAmount: Number(coverageAmount),
        premiumType,
      });

      toast.success("Policy purchased successfully");
      navigate("/customer/policies");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to purchase policy"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPlan) {
    return (
      <DashboardLayout>
        <BackButton />
        <Card title="Purchase Policy">Loading plan details...</Card>
      </DashboardLayout>
    );
  }

  const hasDiscount = quote && Number(quote.discountPercent) > 0;

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Purchase Policy">
        <form onSubmit={handlePurchase} noValidate>
          <div className="mb-3">
            <label className="form-label">
              Coverage Amount (INR) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step="50000"
              min={minCoverage}
              max={maxCoverage}
              className={`form-control ${
                touched.coverageAmount && fieldErrors.coverageAmount ? "is-invalid" : ""
              }`}
              value={coverageAmount}
              onChange={handleCoverageChange}
              onBlur={(ev) => handleBlur("coverageAmount", ev.target.value)}
            />
            <small className="text-muted d-block mt-1">
              Choose any amount between ₹{minCoverage.toLocaleString()} and ₹{maxCoverage.toLocaleString()}, in multiples of ₹50,000.
            </small>
            {touched.coverageAmount && fieldErrors.coverageAmount && (
              <div className="invalid-feedback d-block">{fieldErrors.coverageAmount}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Frequency</label>
            <select
              className="form-select"
              value={premiumType}
              onChange={handlePremiumTypeChange}
            >
              {PREMIUM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Premium</label>

            {quoteLoading && (
              <input className="form-control bg-light" value="Calculating..." readOnly />
            )}

            {!quoteLoading && quoteError && (
              <div className="text-danger small">{quoteError}</div>
            )}

            {!quoteLoading && !quoteError && quote && (
              <div className="bg-light border rounded p-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Annual premium</span>
                  <span>₹{Number(quote.annualPremium).toLocaleString()}</span>
                </div>
                {hasDiscount && (
                  <div className="d-flex justify-content-between text-success">
                    <span>{Number(quote.discountPercent)}% discount applied</span>
                    <span>−₹{Number(quote.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <hr className="my-1" />
                <div className="d-flex justify-content-between font-weight-bold text-primary">
                  <span>You pay</span>
                  <span>₹{Number(quote.finalPremium).toLocaleString()}</span>
                </div>
              </div>
            )}

            {!quoteLoading && !quoteError && !quote && (
              <input className="form-control bg-light" value="Select coverage and frequency" readOnly />
            )}

            <small className="text-muted d-block mt-1">
              This premium is calculated by the server and is the amount confirmed at checkout.
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              min={TODAY_ISO}
              className={`form-control ${
                touched.startDate && fieldErrors.startDate ? "is-invalid" : ""
              }`}
              value={startDate}
              onChange={handleDateChange}
              onBlur={(ev) => handleBlur("startDate", ev.target.value)}
              aria-invalid={touched.startDate && !!fieldErrors.startDate}
            />
            {touched.startDate && fieldErrors.startDate && (
              <div className="invalid-feedback d-block">{fieldErrors.startDate}</div>
            )}
          </div>

          <Button type="submit" variant="success" disabled={submitting}>
            {submitting ? "Processing..." : "Confirm Purchase"}
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default PurchasePolicy;