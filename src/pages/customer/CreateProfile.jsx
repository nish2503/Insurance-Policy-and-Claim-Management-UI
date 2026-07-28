import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import BackButton from "../../components/common/BackButton";

import { createCustomerProfile } from "../../api/customerApi";
import {
  required,
  validateAge,
  validatePinCode,
  validateForm,
} from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

const FIELD_LABELS = {
  dateOfBirth: "Date of birth",
  address: "Street Address",
  city: "City",
  state: "State",
  pinCode: "PIN code",
  nomineeName: "Nominee full name",
  nomineeRelation: "Relationship to Nominee",
};

// validateAge() also enforces a minimum age of 18, but that check only fires
// on submit — a date picker with no max still lets someone pick "1 day old"
// as their DOB. Capping the picker at "18 years ago today" blocks that at
// selection time instead of only after the fact.
const MAX_DOB_ISO = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
})();

function CreateProfile() {
  const navigate = useNavigate();
  const toast = useToast();

  // 📦 Core demographic state setup only - completely free from email/phone redundancy
  const [form, setForm] = useState({
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 🛠️ Aligned validation rules map matching only the exact fields on screen
  const validatorMap = {
    dateOfBirth: (value) => validateAge(value, FIELD_LABELS.dateOfBirth),
    address: (value) => required(value, FIELD_LABELS.address),
    city: (value) => required(value, FIELD_LABELS.city),
    state: (value) => required(value, FIELD_LABELS.state),
    pinCode: (value) => validatePinCode(value, FIELD_LABELS.pinCode),
    nomineeName: (value) => required(value, FIELD_LABELS.nomineeName),
    nomineeRelation: (value) => required(value, FIELD_LABELS.nomineeRelation),
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

    // Validates only the exact properties managed inside local component state fields
    const { errors, isValid } = validateForm(form, validatorMap);
    setFieldErrors(errors);
    
    setTouched(
      Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (!isValid) {
      toast.error("Please clean up the highlighted fields before saving.");
      return;
    }

    setSubmitting(true);
    try {
      // 🚀 Hits your standard POST /api/customers/profile route mapping securely
      await createCustomerProfile(form);
      
      toast.success("Profile created successfully! Welcome to your dashboard.");
      navigate("/customer");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to finalize customer profile creation setup."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Complete Your Personal Profile">
        <p className="text-muted small mb-4">
          Please provide your contact information and nominee details below to unlock full account features.
        </p>

        <form onSubmit={submit} noValidate>
          <div className="row">
            {Object.keys(form).map((key) => (
              <div className={key === "address" ? "col-12 mb-3" : "col-md-6 mb-3"} key={key}>
                <label className="form-label font-weight-bold text-secondary small">
                  {FIELD_LABELS[key]} <span className="text-danger">*</span>
                </label>
                <input
                  type={key === "dateOfBirth" ? "date" : "text"}
                  max={key === "dateOfBirth" ? MAX_DOB_ISO : undefined}
                  className={`form-control ${touched[key] && fieldErrors[key] ? "is-invalid" : ""}`}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={touched[key] && !!fieldErrors[key]}
                />
                {touched[key] && fieldErrors[key] && (
                  <div className="invalid-feedback d-block">{fieldErrors[key]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-top mt-4 d-flex justify-content-end">
            <Button type="submit" variant="success" className="px-4 font-weight-bold shadow-sm py-2" disabled={submitting}>
              {submitting ? "Processing creation..." : "Complete Profile Setup ➔"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default CreateProfile;