import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import ThemeButton from "../../components/common/ThemeButton";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registration successful. Verify OTP");
      navigate("/verify-otp");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .auth-core-card h3 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 24px !important;
          text-align: center !important;
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
      `}</style>

      <div className="floating-theme-dock">
        <ThemeButton />
      </div>

      <div className="auth-core-card">
        <h3>Create Profile 📝</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              className="modern-form-input"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="modern-form-input"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="modern-form-input"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-pill-wrapper mb-4">
            <input
              className="modern-form-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              className="btn-input-reveal"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
            </button>
          </div>

          <button className="btn-submit-action">
            Register Account
          </button>
        </form>

        <div className="auth-footer-nav">
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            Already have a profile? <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
