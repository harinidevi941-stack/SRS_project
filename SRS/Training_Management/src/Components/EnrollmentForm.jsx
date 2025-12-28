import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { CourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function EnrollmentForm() {
  const {
    programs,
    enrollEmployee,
    enrollments,
    cancelEnrollment,
  } = useContext(CourseContext);
  const { user } = useAuth();
  const role = user?.role || "employee";   // default if not logged in
  
  const location = useLocation();

  const defaultProgramId = location.state?.programId || "";

  const [form, setForm] = useState({
    employeeName: "",
    employeeEmail: "",
    programId: defaultProgramId,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false); // fake API loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.employeeName.trim() ||
      !form.employeeEmail.trim() ||
      !form.programId
    ) {
      setError("All fields are required.");
      setMessage("");
      setSubmitError("");
      return;
    }
    setError("");
    setMessage("");
    setSubmitError("");
    setLoading(true);

    const program = programs.find((p) => p.id === form.programId);

    const newEnrollment = {
      id: Date.now().toString(),
      employeeName: form.employeeName,
      employeeEmail: form.employeeEmail,
      programId: form.programId,
      programName: program ? program.name : "Unknown",
      status: "Enrolled",
      sessions: program?.sessions || "",
    };

    // simulate API delay + 10% failure rate
    setTimeout(() => {
      const fail = Math.random() < 0.1; // 10% chance
      if (fail) {
        setSubmitError("Enrollment failed. Please try again.");
        setLoading(false);
        return;
      }

      enrollEmployee(newEnrollment);
      setMessage(
        `Enrolled to "${newEnrollment.programName}". ` +
          (newEnrollment.sessions
            ? `Upcoming sessions: ${newEnrollment.sessions}`
            : "You will be notified about upcoming sessions.")
      );
      setForm({
        employeeName: "",
        employeeEmail: "",
        programId: "",
      });
      setLoading(false);
    }, 800);
  };

  const handleCancel = (id) => {
    if (window.confirm("Cancel this enrollment?")) {
      cancelEnrollment(id);
    }
  };

  return (
    <div className="enroll-page">
      <h2>Employee Enrollment</h2>

      {role === "employee" ? (
        programs.length === 0 ? (
          <p>No programs available. Ask HR to create programs first.</p>
        ) : (
          <form className="enroll-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="employeeName"
              placeholder="Employee Name"
              value={form.employeeName}
              onChange={handleChange}
            />

            <input
              type="email"
              name="employeeEmail"
              placeholder="Employee Email"
              value={form.employeeEmail}
              onChange={handleChange}
            />

            <select
              name="programId"
              value={form.programId}
              onChange={handleChange}
            >
              <option value="">Select Training Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {error && <p className="error-text">{error}</p>}
            {submitError && <p className="error-text">{submitError}</p>}
            {message && <p className="success-text">{message}</p>}
            {loading && <p>Submitting enrollment...</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Enroll Employee"}
            </button>
          </form>
        )
      ) : (
        <p>Only employees can enroll in programs. Switch role to “Employee” to enroll.</p>
      )}
<div className="enrollment-list">
        <h3>Current Enrollments</h3>
        {enrollments.length === 0 ? (
          <p>No enrollments yet.</p>
        ) : (
          <ul>
            {enrollments.map((e) => (
              <li key={e.id} className="enrollment-item">
                <div>
                  <strong>{e.employeeName}</strong> – {e.programName}
                  <p>{e.employeeEmail}</p>
                  {e.sessions && (
                    <p>
                      <strong>Sessions:</strong> {e.sessions}
                    </p>
                  )}
                </div>
                {(role === "employee" || role === "hr") && (
                  <button onClick={() => handleCancel(e.id)}>Cancel</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EnrollmentForm;