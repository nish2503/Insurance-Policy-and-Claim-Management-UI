import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";

import { purchasePolicy } from "../../api/customerApi";
import { validateNotPastDate } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

// Native date inputs have no built-in "no past dates" rule, so we floor the
// picker itself at today in addition to the submit-time check below — a
// policy can't retroactively start before today.
const TODAY_ISO = new Date().toISOString().split("T")[0];

function PurchasePolicy() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [startDate, setStartDate] = useState("");
  const [touched, setTouched] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(value) {
    const message = validateNotPastDate(value, "Start date");
    setFieldError(message);
    return message;
  }

  function handleChange(e) {
    setStartDate(e.target.value);
    if (touched) validate(e.target.value);
  }

  function handleBlur() {
    setTouched(true);
    validate(startDate);
  }

  async function handlePurchase(e) {
    e.preventDefault();
    setTouched(true);
    if (validate(startDate)) return;

    setSubmitting(true);
    try {
      await purchasePolicy({
        planId: Number(planId),
        startDate,
      });

      toast.success("Policy purchased successfully");
      navigate("/customer/policies");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to purchase policy"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Purchase Policy">
        <form onSubmit={handlePurchase} noValidate>
          <div className="mb-3">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              min={TODAY_ISO}
              className={`form-control ${
                touched && fieldError ? "is-invalid" : ""
              }`}
              value={startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched && !!fieldError}
            />
            {touched && fieldError && (
              <div className="invalid-feedback d-block">{fieldError}</div>
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