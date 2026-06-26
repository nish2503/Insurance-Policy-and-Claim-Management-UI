import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyRegister, resendOtp } from "../../api/authApi";
import useOtpTimer from "../../hooks/useOtpTimer";
import ThemeButton from "../../components/common/ThemeButton";

function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const navigate = useNavigate();
  const { timeLeft, canResend, resetTimer } = useOtpTimer(60);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyRegister({ email, mobileNumber, emailOtp, phoneOtp });
      alert("Email and Mobile verified successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      resetTimer();
      alert("OTP sent again");
    } catch (error) {
      console.log(error);
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
      `}</style>

      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      <div className="auth-core-card">
        <h3>Verify Security Account 🛡️</h3>
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <input
              className="modern-form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="modern-form-input"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="modern-form-input"
              placeholder="Email Verification OTP"
              value={emailOtp}
              maxLength="6"
              onChange={(e) => setEmailOtp(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              className="modern-form-input"
              placeholder="Phone Verification OTP"
              value={phoneOtp}
              maxLength="6"
              onChange={(e) => setPhoneOtp(e.target.value)}
              required
            />
          </div>

          <button className="btn-submit-action">
            Verify & Activate Vault
          </button>
        </form>

        <hr className="divider-line" />

        {canResend ? (
          <button className="btn-secondary-action" onClick={handleResend}>
            Resend Verification Codes
          </button>
        ) : (
          <p className="otp-timer-message">
            Resend entry available in <span style={{ color: "#3b82f6" }}>{timeLeft}s</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
