import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomerProfile } from "../../api/customerApi";
import { useToast } from "../../context/ToastContext";
import {
  validateAge,
  validateAddress,
  validateCity,
  validateState,
  validatePinCode,
  validateName,
  validateRelation,
  validateForm,
} from "../../utils/validators";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => {
      if (!prev[e.target.name]) return prev;
      const next = { ...prev };
      delete next[e.target.name];
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(form, {
      dateOfBirth: (v) => validateAge(v, "Date of birth"),
      address: (v) => validateAddress(v),
      city: (v) => validateCity(v),
      state: (v) => validateState(v),
      pinCode: (v) => validatePinCode(v),
      nomineeName: (v) => validateName(v, "Nominee Name"),
      nomineeRelation: (v) => validateRelation(v),
    });

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      await createCustomerProfile(form);

      toast.success("Profile created successfully.");

      navigate("/customer", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Profile creation failed."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create Customer Profile</h3>

      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>

          <input
            type="date"
            className={`form-control ${
              errors.dateOfBirth ? "is-invalid" : ""
            }`}
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />

          {errors.dateOfBirth && (
            <div className="invalid-feedback">
              {errors.dateOfBirth}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>

          <input
            className={`form-control ${
              errors.address ? "is-invalid" : ""
            }`}
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>

          <input
            className={`form-control ${
              errors.city ? "is-invalid" : ""
            }`}
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          {errors.city && (
            <div className="invalid-feedback">{errors.city}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>

          <input
            className={`form-control ${
              errors.state ? "is-invalid" : ""
            }`}
            name="state"
            value={form.state}
            onChange={handleChange}
          />

          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">PIN Code</label>

          <input
            className={`form-control ${
              errors.pinCode ? "is-invalid" : ""
            }`}
            name="pinCode"
            maxLength={6}
            inputMode="numeric"
            value={form.pinCode}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                pinCode: e.target.value.replace(/\D/g, "").slice(0, 6),
              }));

              setErrors((prev) => {
                if (!prev.pinCode) return prev;
                const next = { ...prev };
                delete next.pinCode;
                return next;
              });
            }}
          />

          {errors.pinCode && (
            <div className="invalid-feedback">{errors.pinCode}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Nominee Name</label>

          <input
            className={`form-control ${
              errors.nomineeName ? "is-invalid" : ""
            }`}
            name="nomineeName"
            value={form.nomineeName}
            onChange={handleChange}
          />

          {errors.nomineeName && (
            <div className="invalid-feedback">
              {errors.nomineeName}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Nominee Relation</label>

          <input
            className={`form-control ${
              errors.nomineeRelation ? "is-invalid" : ""
            }`}
            name="nomineeRelation"
            value={form.nomineeRelation}
            onChange={handleChange}
          />

          {errors.nomineeRelation && (
            <div className="invalid-feedback">
              {errors.nomineeRelation}
            </div>
          )}
        </div>

        <button className="btn btn-primary">
          Create Profile
        </button>
      </form>
    </div>
  );
}

export default CreateProfile;