import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../api/authApi";
import { loginSuccess } from "../../features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 1. Add state to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login({ email, password });
      const data = response.data;

      dispatch(
        loginSuccess({
          token: data.jwtToken,
          role: data.userRole,
          user: data,
        })
      );

      switch (data.userRole) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "AGENT":
          navigate("/agent");
          break;
        case "CUSTOMER":
          navigate("/customer");
          break;
        default:
          alert("Invalid role");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a helper handler to switch visibility state
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h3 className="mb-4">Insurance Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

         <div className="input-group mb-3">
  <input
    className="form-control"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    className="btn btn-outline-secondary"
    type="button"
    onClick={togglePasswordVisibility}
    style={{ 
      borderLeft: "none",
      zIndex: 5 // Ensures the button outline displays clearly over the input field
    }}
  >
    {/* Clean, professional icons instead of raw emojis */}
    {showPassword ? (
      <i className="bi bi-eye-slash-fill text-muted"></i>
    ) : (
      <i className="bi bi-eye-fill text-muted"></i>
    )}
  </button>
</div>


          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
