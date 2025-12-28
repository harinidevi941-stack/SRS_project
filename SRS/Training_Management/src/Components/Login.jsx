import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCourseContext } from "../Context/CourseContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { initializeData } = useCourseContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password === "123") {
      let role = "employee";
      const lower = email.toLowerCase();

      if (lower.includes("hr")) {
        role = "hr";
      } else if (lower.includes("instructor")) {
        role = "instructor";
      }

      login(email, role);
      initializeData();

      setTimeout(() => {
        if (role === "employee") {
          navigate("/dashboard");
        } else if (role === "hr") {
          navigate("/hr-dashboard");
        } else if (role === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/dashboard");
        }
        setLoading(false);
      }, 500);
    } else {
      setError('Password must be "123".');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Training Portal</h2>
        <p className="login-subtitle">
          Any email + Password: 123
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Signing In..." : "🚀 Login"}
          </button>
        </form>
        
        <div className="login-hint">
          Hint: add <strong>"hr"</strong> in email for HR role,{" "}
          <strong>"instructor"</strong> for instructor. Others are employees.
        </div>
      </div>
    </div>
  );
}

export default Login;