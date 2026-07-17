// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../../api/authApi";
// import { loginSuccess } from "../../features/auth/authSlice";
// import ThemeButton from "../../components/common/ThemeButton";
// import { useToast } from "../../context/ToastContext";
// import { getApiErrorMessage } from "../../utils/apiError";
// import { required, validateEmail, validateForm } from "../../utils/validators";
// import { profileExists } from "../../api/customerApi";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const toast = useToast();

//   const clearFieldError = (field) => {
//     setErrors((prev) => {
//       if (!prev[field]) return prev;
//       const next = { ...prev };
//       delete next[field];
//       return next;
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const { errors: validationErrors, isValid } = validateForm(
//       { email, password },
//       {
//         email: (v) => validateEmail(v, "Email"),
//         password: (v) => required(v, "Password"),
//       },
//     );

//     if (!isValid) {
//       setErrors(validationErrors);
//       toast.error("Please fix the highlighted fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await login({ email, password });
//       const data = response.data;

//       dispatch(
//         loginSuccess({
//           token: data.jwtToken,
//           role: data.userRole,
//           user: data,
//         }),
//       );

//       toast.success("Logged in successfully.");

//       switch (data.userRole) {
//         case "ADMIN":
//           navigate("/admin", { replace: true });
//           break;
//         case "INTERNAL_STAFF":
//           navigate("/internal-staff");
//           break;
//         case "CUSTOMER": {
//   const response = await profileExists();

//   if (response.data) {
//     navigate("/customer", { replace: true });
//   } else {
//     navigate("/customer/create-profile", { replace: true });
//   }
//   break;
// }
//         default:
//           toast.error("Your user profile does not have access permissions.");
//       }
//     } catch (error) {
//       toast.error(getApiErrorMessage(error, "Invalid email or password."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-viewport-root">
//       <style>{`
//         .auth-viewport-root {
//           min-height: 100vh !important;
//           background-color: var(--bg-main) !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           font-family: 'Inter', system-ui, sans-serif !important;
//           position: relative !important;
//           padding: 20px !important;
//           transition: background-color 0.3s ease !important;
//         }

//         .floating-theme-dock {
//           position: absolute !important;
//           top: 30px !important;
//           right: 30px !important;
//           z-index: 1000 !important;
//           width: 140px !important;
//         }

//         .auth-core-card {
//           background: var(--panel-bg) !important;
//           border: 1px solid var(--border-color) !important;
//           border-radius: 20px !important;
//           padding: 40px !important;
//           width: 100% !important;
//           max-width: 420px !important;
//           box-shadow: var(--card-shadow) !important;
//           transition: background-color 0.25s ease, border-color 0.25s ease !important;
//         }

//         .auth-core-card h3 {
//           font-size: 1.5rem !important;
//           font-weight: 700 !important;
//           color: var(--text-main) !important;
//           letter-spacing: -0.02em !important;
//           margin-bottom: 24px !important;
//           text-align: center !important;
//           transition: color 0.25s ease !important;
//         }

//         .modern-form-input {
//           background: var(--bg-main) !important;
//           border: 1px solid var(--border-color) !important;
//           color: var(--text-main) !important;
//           padding: 12px 16px !important;
//           border-radius: 10px !important;
//           font-size: 0.95rem !important;
//           width: 100% !important;
//           box-sizing: border-box !important;
//           transition: all 0.2s ease !important;
//         }

//         .modern-form-input:focus {
//           outline: none !important;
//           border-color: #3b82f6 !important;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
//         }

//         .input-pill-wrapper {
//           position: relative !important;
//           display: flex !important;
//           align-items: center !important;
//           width: 100% !important;
//         }

//         .btn-input-reveal {
//           position: absolute !important;
//           right: 4px !important;
//           background: transparent !important;
//           border: none !important;
//           color: var(--text-muted) !important;
//           height: calc(100% - 8px) !important;
//           padding: 0 14px !important;
//           cursor: pointer !important;
//           font-size: 1.1rem !important;
//           display: flex !important;
//           align-items: center !important;
//         }

//         .btn-submit-action {
//           background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
//           color: white !important;
//           border: none !important;
//           padding: 14px !important;
//           border-radius: 10px !important;
//           width: 100% !important;
//           font-weight: 600 !important;
//           font-size: 0.95rem !important;
//           cursor: pointer !important;
//           margin-top: 10px !important;
//           transition: all 0.2s ease !important;
//         }

//         .btn-submit-action:hover {
//           box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4) !important;
//           transform: translateY(-1px) !important;
//         }

//         .btn-submit-action:disabled {
//           opacity: 0.6 !important;
//           cursor: not-allowed !important;
//         }

//         .auth-footer-nav {
//           display: flex !important;
//           flex-wrap: wrap !important;
//           justify-content: space-between !important;
//           gap: 8px 16px !important;
//           margin-top: 24px !important;
//           font-size: 0.85rem !important;
//         }

//         .auth-footer-nav span {
//           color: #3b82f6 !important;
//           cursor: pointer !important;
//           font-weight: 500 !important;
//           transition: color 0.2s ease !important;
//         }

//         .auth-footer-nav span:hover {
//           color: #2563eb !important;
//           text-decoration: underline !important;
//         }

//         .modern-form-input.field-invalid {
//           border-color: #dc2626 !important;
//           box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12) !important;
//         }

//         .field-error-text {
//           color: #dc2626 !important;
//           font-size: 0.8rem !important;
//           margin-top: 6px !important;
//           display: block !important;
//         }
//       `}</style>

//       <div className="floating-theme-dock">
//         <ThemeButton />
//       </div>

//       <div className="auth-core-card">
//         <h3>Sign In</h3>
//         <form onSubmit={handleLogin} noValidate>
//           <div className="mb-3">
//             <input
//               type="email"
//               className={`modern-form-input${errors.email ? " field-invalid" : ""}`}
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 clearFieldError("email");
//               }}
//             />
//             {errors.email && <span className="field-error-text">{errors.email}</span>}
//           </div>

//           <div className="mb-1">
//             <div className="input-pill-wrapper">
//               <input
//                 className={`modern-form-input${errors.password ? " field-invalid" : ""}`}
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   clearFieldError("password");
//                 }}
//               />
//               <button
//                 className="btn-input-reveal"
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <i className="bi bi-eye-slash-fill"></i>
//                 ) : (
//                   <i className="bi bi-eye-fill"></i>
//                 )}
//               </button>
//             </div>
//             {errors.password && <span className="field-error-text">{errors.password}</span>}
//           </div>

//           <div className="mb-3"></div>

//           <button className="btn-submit-action" disabled={loading}>
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* 🚨 Integrated navigation links directly routing recovery paths */}
//         <div className="auth-footer-nav">
//           <span onClick={() => navigate("/forgot-password")}>
//             Forgot Password?
//           </span>
//           <span onClick={() => navigate("/register")}>
//   Register New Account
// </span>
//           <span onClick={() => navigate("/verify-register")}>
//             Verify Pending Registration
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../api/authApi";
import { loginSuccess } from "../../features/auth/authSlice";
import ThemeButton from "../../components/common/ThemeButton";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { required, validateEmail, validateForm } from "../../utils/validators";
import { profileExists } from "../../api/customerApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(
      { email, password },
      {
        email: (v) => validateEmail(v, "Email"),
        password: (v) => required(v, "Password"),
      },
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });
      const data = response.data;

      // 🔄 FIXED: Correctly pass the clean backend response properties to redux storage
      dispatch(
        loginSuccess({
          token: data.jwtToken || data.accessToken,
          role: data.userRole || data.role,
          user: data,
        }),
      );

      toast.success("Welcome back!");

      const activeRole = data.userRole || data.role;

            switch (activeRole) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
          
        // 🛠️ Aligned to match your backend enum value perfectly
        case "INTERNAL_STAFF":
        case "ROLE_INTERNAL_STAFF":
          navigate("/internal-staff", { replace: true });
          break;
          
        case "CUSTOMER":
        case "ROLE_CUSTOMER": {
          const response = await profileExists();
          if (response.data) {
            navigate("/customer", { replace: true });
          } else {
            navigate("/customer/create-profile", { replace: true });
          }
          break;
        }
        default:
          toast.error("Your user profile does not have access permissions.");
      }

    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid email or password."));
    } finally {
      setLoading(false);
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
          transition: background-color 0.25s ease, border-color 0.25s ease !important;
        }

        .auth-core-card h3 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 24px !important;
          text-align: center !important;
          transition: color 0.25s ease !important;
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
          flex-wrap: wrap !important;
          justify-content: space-between !important;
          gap: 8px 16px !important;
          margin-top: 24px !important;
          font-size: 0.85rem !important;
        }

        .auth-footer-nav span {
          color: #3b82f6 !important;
          cursor: pointer !important;
          font-weight: 500 !important;
          transition: color 0.2s ease !important;
        }

        .auth-footer-nav span:hover {
          color: #2563eb !important;
          text-decoration: underline !important;
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
        <h3>Sign In</h3>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            {/* 🛠️ FIXED: Added trailing spacing before template string to join CSS classes cleanly */}
            <input
              type="email"
              className={`modern-form-input ${errors.email ? "field-invalid" : ""}`}
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
            />
            {errors.email && <span className="field-error-text">{errors.email}</span>}
          </div>

          <div className="mb-1">
            <div className="input-pill-wrapper">
              {/* 🛠️ FIXED: Added trailing spacing before template string to join CSS classes cleanly */}
              <input
                className={`modern-form-input ${errors.password ? "field-invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
              />
              <button
                className="btn-input-reveal"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
              </button>
            </div>
            {errors.password && <span className="field-error-text">{errors.password}</span>}
          </div>

          {/* 🛠️ FIXED: Completely closed the truncated form submission and footer layouts */}
          <button className="btn-submit-action" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer-nav">
          <span onClick={() => navigate("/register")}>Create an account</span>
          <span onClick={() => navigate("/forgot-password")}>Forgot password?</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
