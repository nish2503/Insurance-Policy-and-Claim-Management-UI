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
  address: "Address",
  city: "City",
  state: "State",
  pinCode: "PIN code",
  nomineeName: "Nominee name",
  nomineeRelation: "Nominee relation",
};

function CreateProfile() {
  const navigate = useNavigate();
  const toast = useToast();

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

    const { errors, isValid } = validateForm(form, validatorMap);
    setFieldErrors(errors);
    setTouched(
      Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    );

    if (!isValid) return;

    setSubmitting(true);
    try {
      await createCustomerProfile(form);
      toast.success("Profile created successfully");
      navigate("/customer");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create profile"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <BackButton />

      <Card title="Create Customer Profile">
        <form onSubmit={submit} noValidate>
          {Object.keys(form).map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">
                {FIELD_LABELS[key]} <span className="text-danger">*</span>
              </label>
              <input
                type={key === "dateOfBirth" ? "date" : "text"}
                className={`form-control ${
                  touched[key] && fieldErrors[key] ? "is-invalid" : ""
                }`}
                name={key}
                value={form[key]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched[key] && !!fieldErrors[key]}
              />
              {touched[key] && fieldErrors[key] && (
                <div className="invalid-feedback d-block">
                  {fieldErrors[key]}
                </div>
              )}
            </div>
          ))}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default CreateProfile;