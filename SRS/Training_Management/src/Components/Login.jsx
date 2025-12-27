import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCourseContext } from "../Context/CourseContext";

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
       <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          Training Portal
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#6b7280",
          }}
        >
          Any email + Password: 123
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              margin: "0.5rem 0",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            required
          />
          <input
            type="password"
            placeholder="123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              margin: "0.5rem 0",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            required
          />

          {error && (
            <div
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                margin: "0.8rem 0",
                fontSize: "0.9rem",
              }}
            >
              [Error - You need to specify the message]
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1.1rem",
              marginTop: "0.5rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Signing In..." : "🚀 Login"}
          </button>
        </form>
 <div
          style={{
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Hint: add <strong>"hr"</strong> in email for HR role,{" "}
          <strong>"instructor"</strong> for instructor. Others are employees.
        </div>
      </div>
    </div>
  );
}

export default Login;