import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/authApi";
import ThemeButton from "../../components/common/ThemeButton";
import { useToast } from "../../context/ToastContext";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateForm,
} from "../../utils/validators";

function ForgotPassword() {
  const { token: routeToken } = useParams();
  const location = useLocation();

  const queryToken = new URLSearchParams(location.search).get("token");
  const token = routeToken || queryToken;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const hasToken = Boolean(token);

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  async function sendLink(e) {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(
      { email },
      { email: (v) => validateEmail(v, "Email") },
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword({ email });
      toast.success("Verification recovery transmission sent to mail queue.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Transmission Action Failed");
    } finally {
      setLoading(false);
    }
  }

  async function reset(e) {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(
      { newPassword, confirmPassword },
      {
        newPassword: (v) => validatePassword(v, "New password"),
        confirmPassword: (v, values) =>
          validateConfirmPassword(v, values.newPassword, "Confirm password"),
      },
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({ token, newPassword });
      toast.success("Password verification database update successful.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid or broken validation link token.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-viewport-root">
      {/* Reusing exact premium utility variable layout layers shared with Login screen */}
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
          margin-bottom: 16px !important;
          text-align: center !important;
        }

        .recovery-subheading-text {
          text-align: center !important;
          font-size: 0.88rem !important;
          color: var(--text-muted) !important;
          margin-bottom: 24px !important;
          line-height: 1.4 !important;
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

        .input-pill-wrapper {
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }

        .btn-input-reveal {
          position: absolute !important;
          right: 4px !important;
          background: transparent !important;
          border: none !important;
          color: var(--text-muted) !important;
          height: calc(100% - 8px) !important;
          padding: 0 14px !important;
          cursor: pointer !important;
          font-size: 1.1rem !important;
          display: flex !important;
          align-items: center !important;
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
          margin-top: 10px !important;
          transition: all 0.2s ease !important;
        }

        .btn-submit-action:hover {
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4) !important;
          transform: translateY(-1px) !important;
        }

        .btn-submit-action:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
        }

        .auth-footer-nav {
          display: flex !important;
          justify-content: center !important;
          margin-top: 24px !important;
          font-size: 0.85rem !important;
        }

        .auth-footer-nav span {
          color: #3b82f6 !important;
          cursor: pointer !important;
          font-weight: 500 !important;
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
      `}</style>

      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      <div className="auth-core-card">
        <h3>Forgot Password</h3>

        {!hasToken ? (
          <>
            <p className="recovery-subheading-text">
              Provide your registered Email Address.
            </p>
            <form onSubmit={sendLink} noValidate>
              <div className="mb-3">
                <input
                  className={`modern-form-input${errors.email ? " field-invalid" : ""}`}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>
              <button className="btn-submit-action" disabled={loading}>
                {loading
                  ? "Sending link..."
                  : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="recovery-subheading-text">
              Link verified. Enter your new password below to reset access.
            </p>
            <form onSubmit={reset} noValidate>
              <div className="mb-3">
                <div className="input-pill-wrapper">
                  <input
                    className={`modern-form-input${errors.newPassword ? " field-invalid" : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Access Key"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearFieldError("newPassword");
                    }}
                  />
                  <button
                    className="btn-input-reveal"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="field-error-text">{errors.newPassword}</span>
                )}
              </div>

              <div className="mb-1">
                <div className="input-pill-wrapper">
                  <input
                    className={`modern-form-input${errors.confirmPassword ? " field-invalid" : ""}`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Access Key"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                  />
                  <button
                    className="btn-input-reveal"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="mb-3"></div>

              <button className="btn-submit-action" disabled={loading}>
                {loading
                  ? "Updating Password"
                  : "Update Password"}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer-nav">
          <span onClick={() => navigate("/login")}>Return to Sign In</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;