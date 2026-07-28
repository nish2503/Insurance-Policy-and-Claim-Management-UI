import { useEffect, useState } from "react";
import { getMyProfile, updateCustomerProfile } from "../../api/customerApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import BackButton from "../../components/common/BackButton";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import api from "../../api/axios";
import { validateAge } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";

const HUMAN_LABELS = {
  fullName: "Full Name",
  email: "Email Address",
  mobileNumber: "Mobile Number",
  dateOfBirth: "Date of Birth",
  address: "Street Address",
  city: "City",
  state: "State",
  pinCode: "PIN Code",
  nomineeName: "Nominee Full Name",
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

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  // 🛠️ FIXED: Added the missing errors state hooks to prevent immediate thread crashes
  const [errors, setErrors] = useState({});

  const [showOtpModal, setShowModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const toast = useToast();

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
      const rawData = res.data;

      setProfile(rawData);
      setErrors({}); // Runs safely now!

      // Safely falls back to relational user nodes if fields are empty
      setForm({
        fullName: rawData.fullName || rawData.user?.fullName || "",
        email: rawData.email || rawData.user?.email || "",
        mobileNumber: rawData.mobileNumber || rawData.user?.mobileNumber || "",
        dateOfBirth: rawData.dateOfBirth || "",
        address: rawData.address || "",
        city: rawData.city || "",
        state: rawData.state || "",
        pinCode: rawData.pinCode || "",
        nomineeName: rawData.nomineeName || "",
        nomineeRelation: rawData.nomineeRelation || "",
      });
    } catch (error) {
      console.error("Network profile binding failure logs:", error);
      setErrors({
        general: "Unable to load profile data details at this moment.",
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
    const emailChanged =
      profile.email.trim().toLowerCase() !==
      form.email.trim().toLowerCase();

    await updateCustomerProfile({
      ...form,
      email: form.email.trim().toLowerCase(),
      mobileNumber: form.mobileNumber.replace(/\D/g, "").slice(-10),
    });

    setErrors({});

    if (emailChanged) {
      toast.success(
        "Email updated successfully. Please log in again using your new email."
      );

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      toast.success("Profile updated successfully!");
      setEdit(false);
      loadProfile();
    }

    setShowModal(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Profile update failed");
  }
}

  async function save() {
    setErrors({});
    setOtpError("");
    const validation = validateForm();

    if (Object.keys(validation).length) {
      setErrors({ validationErrors: validation });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const isEmailChanged =
      form.email.trim().toLowerCase() !==
      (profile?.email || "").trim().toLowerCase();

    if (isEmailChanged) {
      setSendingOtp(true);
      try {
        await api.post("/otp/email/send", {
          email: form.email.trim().toLowerCase(),
        });
        setShowModal(true);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
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
    <DashboardLayout>
      <Card title="My Profile">
        <BackButton />

        {errors.general && (
          <div className="alert alert-danger py-2 px-3 mt-3 small shadow-sm">
            <strong>Notice:</strong> {errors.general}
          </div>
        )}

        {profile && (
          <div className="mt-3">
            {edit ? (
              <form onSubmit={(e) => e.preventDefault()} noValidate>
                <h5 className="mb-4 text-primary font-weight-bold">
                  Modify Profile Information
                </h5>
                <div className="row">
                  {Object.keys(form).map((field) => (
                    <div className="col-md-6 mb-3" key={field}>
                      <label className="form-label font-weight-bold small text-muted">
                        {HUMAN_LABELS[field] || field}
                      </label>
                      <input
                        type={field === "dateOfBirth" ? "date" : "text"}
                        max={field === "dateOfBirth" ? MAX_DOB_ISO : undefined}
                        className={`form-control ${errors.validationErrors?.[field] ? "is-invalid" : ""}`}
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
                </div>
                <div className="d-flex gap-2 mt-3 pt-2 border-top">
                  <Button
                    variant="success"
                    onClick={save}
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? "Sending code..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEdit(false);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="mb-0 text-primary font-weight-bold">
                    Personal Profile Details
                  </h5>
                  <Button onClick={() => setEdit(true)}>Edit Profile</Button>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Full Name:</b> {form.fullName || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Email Address:</b> {form.email || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Mobile Number:</b> {form.mobileNumber || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Date of Birth:</b> {form.dateOfBirth || "N/A"}
                    </p>
                  </div>

                  <hr className="my-3 opacity-25 text-muted" />
                  <h6 className="mb-2 text-secondary font-weight-bold">
                    Contact & Location
                  </h6>

                  <div className="col-md-12">
                    <p className="mb-2">
                      <b>Street Address:</b> {form.address || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>City:</b> {form.city || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>State:</b> {form.state || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>PIN Code:</b> {form.pinCode || "N/A"}
                    </p>
                  </div>

                  <hr className="my-3 opacity-25 text-muted" />
                  <h6 className="mb-2 text-secondary font-weight-bold">
                    Nominee Specifications
                  </h6>

                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Nominee Name:</b> {form.nomineeName || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Relationship to Nominee:</b>{" "}
                      {form.nomineeRelation || "N/A"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* OTP Verification Modal — uses the shared Modal component so it
          automatically inherits dark-mode theming instead of hardcoding
          its own bg-white/text-dark markup. */}
      <Modal
        show={showOtpModal}
        onClose={() => setShowModal(false)}
        title="Confirm Email Update"
      >
        <p className="text-muted small mb-3">
          We have dispatched a 6-digit verification code to{" "}
          <strong>{form.email}</strong>. Please enter it below to authorize this
          change.
        </p>
        {otpError && (
          <div className="alert alert-danger p-2 small border-0 font-weight-bold mb-2">
            {otpError}
          </div>
        )}
        <div className="mb-3">
          <input
            type="text"
            className="form-control text-center font-weight-bold fs-5"
            placeholder="******"
            maxLength="6"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div className="d-flex flex-column gap-2 mt-3">
          <Button
            variant="success"
            className="w-100"
            onClick={handleVerifyOtpSubmit}
          >
            Verify and Save Account Updates
          </Button>
          <button
            type="button"
            className="btn btn-link text-muted small text-decoration-none w-100"
            onClick={() => setShowModal(false)}
          >
            Cancel Change
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default MyProfile;
