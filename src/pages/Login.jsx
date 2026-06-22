import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      localStorage.setItem(
        "token",
        response.data.jwtToken
      );

      localStorage.setItem(
        "role",
        response.data.userRole
      );

      localStorage.setItem(
        "email",
        response.data.userEmail
      );

      console.log(
        "ROLE SAVED:",
        response.data.userRole
      );

      const role = response.data.userRole;

      if (role === "ADMIN") {

        navigate("/admin");

      } else if (role === "AGENT") {

        navigate("/agent");

      } else if (role === "CUSTOMER") {

        navigate("/customer");

      } else {

        alert("Unknown Role");
      }

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Invalid Credentials"
      );
    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Insurance Login
              </h3>

              <form onSubmit={handleLogin}>

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;