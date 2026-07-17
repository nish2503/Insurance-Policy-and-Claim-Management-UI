import { useEffect, useState } from "react";
import { getMyProfile, updateCustomerProfile } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";
import api from "../../api/axios";
import { validateAge } from "../../utils/validators";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const [showOtpModal, setShowModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await getMyProfile();

      setProfile(res.data);

      setForm({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        mobileNumber: res.data.mobileNumber || "",
        dateOfBirth: res.data.dateOfBirth || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        pinCode: res.data.pinCode || "",
        nomineeName: res.data.nomineeName || "",
        nomineeRelation: res.data.nomineeRelation || "",
      });
    } catch (error) {
      setErrors({
        general: "Unable to load profile",
      });
    }
  }

  function validateForm() {
    const localErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pinRegex = /^[0-9]{6}$/;

    const cleanedMobile = form.mobileNumber.replace(/\D/g, "").slice(-10);

    const mobileRegex = /^[6-9][0-9]{9}$/;

    if (!form.fullName.trim()) localErrors.fullName = "Full name required";

    if (!form.email.trim()) localErrors.email = "Email required";
    else if (!emailRegex.test(form.email)) localErrors.email = "Invalid email";

    if (!form.mobileNumber.trim()) localErrors.mobileNumber = "Mobile required";
    else if (!mobileRegex.test(cleanedMobile))
      localErrors.mobileNumber = "Invalid mobile number";

    if (!form.dateOfBirth) localErrors.dateOfBirth = "DOB required";
    else {
      const ageError = validateAge(form.dateOfBirth, "Date of birth");
      if (ageError) localErrors.dateOfBirth = ageError;
    }

    if (!form.address.trim()) localErrors.address = "Address required";

    if (!form.city.trim()) localErrors.city = "City required";

    if (!form.state.trim()) localErrors.state = "State required";

    if (!form.pinCode.trim()) localErrors.pinCode = "PIN required";
    else if (!pinRegex.test(form.pinCode))
      localErrors.pinCode = "PIN must be 6 digits";

    if (!form.nomineeName.trim())
      localErrors.nomineeName = "Nominee name required";

    if (!form.nomineeRelation.trim())
      localErrors.nomineeRelation = "Nominee relation required";

    return localErrors;
  }

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  async function executeProfileUpdate() {
    try {
      await updateCustomerProfile({
        ...form,

        email: form.email.trim().toLowerCase(),

        mobileNumber: form.mobileNumber.replace(/\D/g, "").slice(-10),
      });

      setSuccess("Profile updated successfully");

      setEdit(false);

      setShowModal(false);

      loadProfile();
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Profile update failed",
      });
    }
  }

  async function save() {
    setSuccess("");

    setErrors({});

    setOtpError("");

    const validation = validateForm();

    if (Object.keys(validation).length) {
      setErrors({
        validationErrors: validation,
      });

      return;
    }

    const isEmailChanged =
      form.email.trim().toLowerCase() !== profile.email.trim().toLowerCase();

    if (isEmailChanged) {
      setSendingOtp(true);

      try {
        await api.post("/otp/email/send", {
          email: form.email.trim().toLowerCase(),
        });

        setShowModal(true);
      } catch (error) {
        setErrors({
          general: error.response?.data?.message || "Failed to send OTP",
        });
      } finally {
        setSendingOtp(false);
      }
    } else {
      executeProfileUpdate();
    }
  }

  async function handleVerifyOtpSubmit() {
    if (!otpValue.trim()) {
      setOtpError("Please enter OTP");

      return;
    }

    try {
      const response = await api.post("/otp/email/verify", {
        email: form.email.trim().toLowerCase(),

        otp: otpValue.trim(),
      });

      if (response.data === true) {
        executeProfileUpdate();
      } else {
        setOtpError("Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "OTP verification failed");
    }
  }

  return (
    <div className="container mt-5">
      <BackButton />

      <h3>My Profile</h3>

      {success && <div className="alert alert-success">{success}</div>}

      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}

      {profile && (
        <div className="card p-4 shadow-sm">
          {edit ? (
            <>
              {Object.keys(form).map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label text-capitalize">{field}</label>

                  <input
                    type={field === "dateOfBirth" ? "date" : "text"}
                    className={`form-control ${
                      errors.validationErrors?.[field] ? "is-invalid" : ""
                    }`}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                  />

                  {errors.validationErrors?.[field] && (
                    <div className="invalid-feedback">
                      {errors.validationErrors[field]}
                    </div>
                  )}
                </div>
              ))}

              <button className="btn btn-success" onClick={save}>
                Save Changes
              </button>
            </>
          ) : (
            <>
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h4 className="mb-0 text-primary font-weight-bold">Personal Profile Details</h4>
    <button className="btn btn-primary px-4 font-weight-bold shadow-sm" onClick={() => setEdit(true)}>
      ✏️ Edit Profile
    </button>
  </div>

  <div className="row g-3">
    {/* Basic Identity Details Card section */}
    <div className="col-md-6"><p className="mb-2"><b>Full Name:</b> {form.fullName || "N/A"}</p></div>
    <div className="col-md-6"><p className="mb-2"><b>Email Address:</b> {form.email || "N/A"}</p></div>
    <div className="col-md-6"><p className="mb-2"><b>Mobile Number:</b> {form.mobileNumber || "N/A"}</p></div>
    <div className="col-md-6"><p className="mb-2"><b>Date of Birth:</b> {form.dateOfBirth || "N/A"}</p></div>
    
    <hr className="my-3 opacity-25 text-muted" />
    <h5 className="mb-2 text-secondary font-weight-bold">Contact & Location</h5>
    
    <div className="col-md-12"><p className="mb-2"><b>Street Address:</b> {form.address || "N/A"}</p></div>
    <div className="col-md-4"><p className="mb-2"><b>City:</b> {form.city || "N/A"}</p></div>
    <div className="col-md-4"><p className="mb-2"><b>State:</b> {form.state || "N/A"}</p></div>
    <div className="col-md-4"><p className="mb-2"><b>PIN Code:</b> {form.pinCode || "N/A"}</p></div>
    
    <hr className="my-3 opacity-25 text-muted" />
    <h5 className="mb-2 text-secondary font-weight-bold">Nominee Specifications</h5>
    
    <div className="col-md-6"><p className="mb-2"><b>Nominee Name:</b> {form.nomineeName || "N/A"}</p></div>
    <div className="col-md-6"><p className="mb-2"><b>Relationship to Nominee:</b> {form.nomineeRelation || "N/A"}</p></div>
  </div>
</>
          )}
        </div>
      )}

      {showOtpModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Email Verification</h5>
              </div>

              <div className="modal-body">
                {otpError && (
                  <div className="alert alert-danger">{otpError}</div>
                )}

                <input
                  className="form-control"
                  value={otpValue}
                  maxLength="6"
                  onChange={(e) =>
                    setOtpValue(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleVerifyOtpSubmit}
                >
                  Verify & Save Profile
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
