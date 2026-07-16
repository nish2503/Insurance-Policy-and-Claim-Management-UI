import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { verifyRegister, resendOtp } from "../../api/authApi";
import useOtpTimer from "../../hooks/useOtpTimer";
import ThemeButton from "../../components/common/ThemeButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { validateEmail, validateMobile, validateOtp, validateForm, toE164India } from "../../utils/validators";


function VerifyOtp() {
  const location = useLocation();
  const fromRegister = !!location.state;
const [email, setEmail] = useState(location.state?.email || "");
const [mobileNumber, setMobileNumber] = useState(
  location.state?.mobileNumber || ""
);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { timeLeft, canResend, resetTimer } = useOtpTimer(60);

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(
      { email, mobileNumber, emailOtp, phoneOtp },
      {
        email: (v) => validateEmail(v, "Email"),
        mobileNumber: (v) => validateMobile(v, "Mobile number"),
        emailOtp: (v) => validateOtp(v, "Email OTP"),
        phoneOtp: (v) => validateOtp(v, "Phone OTP"),
      },
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);
      await verifyRegister({
        email,
        mobileNumber: toE164India(mobileNumber),
        emailOtp,
        phoneOtp,
      });
      toast.success("Email and Mobile verified successfully");
      navigate("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "OTP verification failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const { errors: validationErrors, isValid } = validateForm(
      { email, mobileNumber },
      {
        email: (v) => validateEmail(v, "Email"),
        mobileNumber: (v) => validateMobile(v, "Mobile number"),
      },
    );

    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      await resendOtp({ email, mobileNumber: toE164India(mobileNumber) });
      resetTimer();
      toast.success("OTP sent again");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to resend OTP"));
    }
  };

  return (
    <div className="auth-viewport-root">
      <style>{`
        .auth-viewport-root {
          min-height: 100vh !important;
          background-color: var(--bg-main) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-family: 'Inter', system-ui, sans-serif !important;
          position: relative !important;
          padding: 20px !important;
          transition: background-color 0.3s ease !important;
        }

        .floating-theme-dock {
          position: absolute !important;
          top: 30px !important;
          right: 30px !important;
          z-index: 1000 !important;
          width: 140px !important;
        }

        .auth-core-card {
          background: var(--panel-bg) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 20px !important;
          padding: 40px !important;
          width: 100% !important;
          max-width: 420px !important;
          box-shadow: var(--card-shadow) !important;
          transition: all 0.25s ease !important;
        }

        .auth-core-card h3 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 24px !important;
          text-align: center;
        }

        .modern-form-input {
          background: var(--bg-main) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-main) !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          font-size: 0.95rem !important;
          width: 100% !important;
          box-sizing: border-box !important;
          transition: all 0.2s ease !important;
        }

        .modern-form-input:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
        }

        .btn-submit-action {
          background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
          color: white !important;
          border: none !important;
          padding: 14px !important;
          border-radius: 10px !important;
          width: 100% !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .btn-submit-action:hover {
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4) !important;
          transform: translateY(-1px) !important;
        }

        .btn-secondary-action {
          background: transparent !important;
          color: var(--text-muted) !important;
          border: 1px solid var(--border-color) !important;
          padding: 12px !important;
          border-radius: 10px !important;
          width: 100% !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .btn-secondary-action:hover {
          background: var(--bg-main) !important;
          color: var(--text-main) !important;
        }

        .otp-timer-message {
          text-align: center !important;
          font-size: 0.88rem !important;
          color: var(--text-muted) !important;
          margin: 10px 0 0 0 !important;
          font-weight: 500 !important;
        }

        .divider-line {
          border: none !important;
          border-top: 1px solid var(--border-color) !important;
          margin: 24px 0 !important;
        }

        .modern-form-input.field-invalid {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12) !important;
        }

        .field-error-text {
          color: #dc2626 !important;
          font-size: 0.8rem !important;
          margin-top: 6px !important;
          display: block !important;
        }

        .mobile-input-wrapper {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 10px !important;
          background: var(--bg-main) !important;
          transition: all 0.2s ease !important;
        }

        .mobile-input-wrapper.field-invalid {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12) !important;
        }

        .mobile-input-wrapper:focus-within {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
        }

        .mobile-input-prefix {
          padding: 12px 10px 12px 16px !important;
          color: var(--text-muted) !important;
          font-size: 0.95rem !important;
          border-right: 1px solid var(--border-color) !important;
          user-select: none !important;
        }

        .mobile-input-wrapper .modern-form-input {
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      <div className="auth-core-card">
        <h3>Verify Security Account 🛡️</h3>
        <form onSubmit={handleVerify} noValidate>
          <div className="mb-3">
            <input
              className={`modern-form-input${errors.email ? " field-invalid" : ""}`}
              placeholder="Email Address"
              value={email}
              readOnly={fromRegister}
               style={{
    backgroundColor: fromRegister ? "#f5f5f5" : "",
    cursor: fromRegister ? "not-allowed" : "text",
  }}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
            />
            {errors.email && <span className="field-error-text">{errors.email}</span>}
          </div>

          <div className="mb-3">
            <div className={`mobile-input-wrapper${errors.mobileNumber ? " field-invalid" : ""}`}>
              <span className="mobile-input-prefix">+91</span>
              <input
                className="modern-form-input"
                type="tel"
                inputMode="numeric"
                placeholder="10 digit mobile number"
                value={mobileNumber}
                readOnly={fromRegister}
                style={{
    backgroundColor: fromRegister ? "#f5f5f5" : "",
    cursor: fromRegister ? "not-allowed" : "text",
  }}
                maxLength="10"
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                  clearFieldError("mobileNumber");
                }}
              />
            </div>
            {errors.mobileNumber && (
              <span className="field-error-text">{errors.mobileNumber}</span>
            )}
          </div>

          <div className="mb-3">
            <input
              className={`modern-form-input${errors.emailOtp ? " field-invalid" : ""}`}
              placeholder="Email Verification OTP"
              value={emailOtp}
              maxLength="6"
              onChange={(e) => {
                setEmailOtp(e.target.value);
                clearFieldError("emailOtp");
              }}
            />
            {errors.emailOtp && <span className="field-error-text">{errors.emailOtp}</span>}
          </div>

          <div className="mb-1">
            <input
              className={`modern-form-input${errors.phoneOtp ? " field-invalid" : ""}`}
              placeholder="Phone Verification OTP"
              value={phoneOtp}
              maxLength="6"
              onChange={(e) => {
                setPhoneOtp(e.target.value);
                clearFieldError("phoneOtp");
              }}
            />
            {errors.phoneOtp && <span className="field-error-text">{errors.phoneOtp}</span>}
          </div>

          <div className="mb-3"></div>

          <button className="btn-submit-action" disabled={submitting}>
            {submitting ? "Verifying..." : "Verify & Activate Vault"}
          </button>
        </form>

        <hr className="divider-line" />

        {canResend ? (
          <button className="btn-secondary-action" onClick={handleResend}>
            Resend Verification Codes
          </button>
        ) : (
          <p className="otp-timer-message">
            Resend entry available in{" "}
            <span style={{ color: "#3b82f6" }}>{timeLeft}s</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;