import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";

import {
  issuePolicy,
  getInternalStaffCustomers,
  getPlans,
} from "../../api/internalStaffApi";

import { required, validateForm, validateNotPastDate } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

// Native date inputs have no built-in "no past dates" rule, so we floor the
// picker itself at today in addition to the submit-time check below — a
// policy can't retroactively be issued to start before today.
const TODAY_ISO = new Date().toISOString().split("T")[0];

function IssuePolicy() {
  const toast = useToast();

  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    planId: "",
    startDate: "",
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadCustomers();
    loadPlans();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getInternalStaffCustomers();
      setCustomers(res.data.records || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load customers"));
    }
  }

  async function loadPlans() {
    try {
      const res = await getPlans();
      setPlans(res.data.records || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load plans"));
    }
  }

  const validatorMap = {
    customerId: (value) => required(value, "Customer"),
    planId: (value) => required(value, "Plan"),
    startDate: (value) => validateNotPastDate(value, "Start date"),
  };

  function runFieldValidation(field, value) {
    const message = validatorMap[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) runFieldValidation(name, value);
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    runFieldValidation(name, value);
  }

  async function submit(e) {
    e.preventDefault();

    const { errors, isValid } = validateForm(form, validatorMap);
    setFieldErrors(errors);
    setTouched({ customerId: true, planId: true, startDate: true });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await issuePolicy({
        customerId: Number(form.customerId),
        planId: Number(form.planId),
        startDate: form.startDate,
      });

      toast.success("Policy issued successfully");

      setForm({ customerId: "", planId: "", startDate: "" });
      setTouched({});
      setFieldErrors({});
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to issue policy"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Issue Policy">
        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label">
              Customer <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${
                touched.customerId && fieldErrors.customerId ? "is-invalid" : ""
              }`}
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.customerId && !!fieldErrors.customerId}
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.fullName}
                </option>
              ))}
            </select>
            {touched.customerId && fieldErrors.customerId && (
              <div className="invalid-feedback d-block">
                {fieldErrors.customerId}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Plan <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${
                touched.planId && fieldErrors.planId ? "is-invalid" : ""
              }`}
              name="planId"
              value={form.planId}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.planId && !!fieldErrors.planId}
            >
              <option value="">Select Plan</option>
              {plans.map((p) => (
                <option key={p.planId} value={p.planId}>
                  {p.planName}
                </option>
              ))}
            </select>
            {touched.planId && fieldErrors.planId && (
              <div className="invalid-feedback d-block">
                {fieldErrors.planId}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${
                touched.startDate && fieldErrors.startDate ? "is-invalid" : ""
              }`}
              type="date"
              min={TODAY_ISO}
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.startDate && !!fieldErrors.startDate}
            />
            {touched.startDate && fieldErrors.startDate && (
              <div className="invalid-feedback d-block">
                {fieldErrors.startDate}
              </div>
            )}
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Issuing..." : "Issue Policy"}
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default IssuePolicy;