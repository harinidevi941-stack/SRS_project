import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function HRDashboard() {
  const { programs, instructors, progress, enrollments, updateProgress, isEmployeeEnrolled, createProgram, updateProgram, deleteProgram, assignInstructor } = useCourseContext();
  const { user } = useAuth();
  const [form, setForm] = useState({
    employeeEmail: "",
    employeeName: "",
    programId: "",
    status: "In Progress",
    score: "",
    completion: ""
  });
  const [programForm, setProgramForm] = useState({
    name: "",
    description: "",
    category: "technical",
    duration: "",
    level: "Beginner"
  });
  const [editingProgram, setEditingProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("progress");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if employee is enrolled in the selected program
    if (!isEmployeeEnrolled(form.employeeEmail, form.programId)) {
      setError("Employee must be enrolled in this program before updating progress.");
      return;
    }
    
    setError("");
    setLoading(true);
    const record = {
      id: Date.now().toString(),
      ...form,
      programName: programs.find(p => p.id === form.programId)?.name || "Unknown",
    };
    setTimeout(() => {
      updateProgress(record);
      setLoading(false);
      setForm({
        employeeEmail: "",
        employeeName: "",
        programId: "",
        status: "In Progress",
        score: "",
        completion: ""
      });
    }, 1000);
  };

  const handleProgramSubmit = (e) => {
    e.preventDefault();
    if (editingProgram) {
      updateProgram({ ...programForm, id: editingProgram.id });
      setEditingProgram(null);
    } else {
      createProgram(programForm);
    }
    setProgramForm({ name: "", description: "", category: "technical", duration: "", level: "Beginner" });
  };

  const handleEditProgram = (program) => {
    setProgramForm(program);
    setEditingProgram(program);
  };

  const handleDeleteProgram = (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteProgram(programId);
    }
  };

  const handleAssignInstructor = (programId, instructorId) => {
    assignInstructor(programId, instructorId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#f59e0b';
      case 'Not Started': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '3rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          HR Dashboard
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Welcome, <strong>{user?.email}</strong> - Manage training programs and employee progress
        </p>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab("progress")}
            style={{
              padding: '1rem 2rem',
              background: activeTab === "progress" ? '#667eea' : 'transparent',
              color: activeTab === "progress" ? 'white' : '#667eea',
              border: '2px solid #667eea',
              borderRadius: '10px 0 0 10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Employee Progress
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            style={{
              padding: '1rem 2rem',
              background: activeTab === "programs" ? '#667eea' : 'transparent',
              color: activeTab === "programs" ? 'white' : '#667eea',
              border: '2px solid #667eea',
              borderRadius: '0 10px 10px 0',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Program Management
          </button>
        </div>

        {activeTab === "progress" && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Add Progress Form */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              📊 Update Employee Progress
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
              Only enrolled employees can have their progress updated
            </p>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <select
                value={form.employeeEmail}
                onChange={e => {
                  const selectedEnrollment = enrollments.find(enr => enr.employeeEmail === e.target.value);
                  setForm({
                    ...form, 
                    employeeEmail: e.target.value,
                    employeeName: selectedEnrollment?.employeeName || '',
                    programId: selectedEnrollment?.programId || ''
                  });
                }}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
                required
              >
                <option value="">Select Enrolled Employee</option>
                {enrollments.map(enrollment => (
                  <option key={enrollment.id} value={enrollment.employeeEmail}>
                    {enrollment.employeeName} ({enrollment.employeeEmail}) - {enrollment.programName}
                  </option>
                ))}
              </select>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                placeholder="Completion % (0-100)"
                type="number"
                min="0"
                max="100"
                value={form.completion}
                onChange={e => setForm({...form, completion: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
              />
              <input
                placeholder="Score (optional)"
                value={form.score}
                onChange={e => setForm({...form, score: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
              />
              <button
                type="submit"
                disabled={loading || enrollments.length === 0}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: enrollments.length === 0 ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: enrollments.length === 0 ? 'not-allowed' : 'pointer',
                  marginTop: '1rem'
                }}
              >
                {loading ? 'Updating...' : enrollments.length === 0 ? 'No Enrolled Employees' : '✅ Update Progress'}
              </button>
            </form>
            {enrollments.length === 0 && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}>
                No employees enrolled yet. Employees must enroll first before progress can be tracked.
              </p>
            )}
          </div>

          {/* Statistics */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              📈 Training Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{progress.length}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Records</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {progress.filter(p => p.status === 'Completed').length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Completed</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {progress.filter(p => p.status === 'In Progress').length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>In Progress</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {programs.length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Programs</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === "programs" && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Program Form */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              {editingProgram ? '✏️ Edit Program' : '➕ Create Program'}
            </h2>
            <form onSubmit={handleProgramSubmit}>
              <input
                placeholder="Program Name"
                value={programForm.name}
                onChange={e => setProgramForm({...programForm, name: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
                required
              />
              <textarea
                placeholder="Program Description"
                value={programForm.description}
                onChange={e => setProgramForm({...programForm, description: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px' }}
                required
              />
              <select
                value={programForm.category}
                onChange={e => setProgramForm({...programForm, category: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
              >
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
                <option value="soft-skills">Soft Skills</option>
                <option value="compliance">Compliance</option>
              </select>
              <input
                placeholder="Duration (e.g., 4 weeks)"
                value={programForm.duration}
                onChange={e => setProgramForm({...programForm, duration: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
                required
              />
              <select
                value={programForm.level}
                onChange={e => setProgramForm({...programForm, level: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '0.5rem 0', borderRadius: '10px', border: '1px solid #ddd' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                {editingProgram ? 'Update Program' : 'Create Program'}
              </button>
              {editingProgram && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProgram(null);
                    setProgramForm({ name: "", description: "", category: "technical", duration: "", level: "Beginner" });
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Program Statistics */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              📊 Program Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{programs.length}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Programs</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {programs.filter(p => p.instructorId).length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Assigned</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {programs.filter(p => !p.instructorId).length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Unassigned</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {instructors.length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Instructors</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* All Progress Records */}
        {activeTab === "progress" && (
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
            👥 All Employee Progress ({progress.length} records)
          </h2>
          
          {progress.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
              No progress records yet. Add some records above.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {progress.map(record => (
                <div key={record.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{record.employeeName}</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{record.employeeEmail}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{record.programName}</h4>
                  </div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: getStatusColor(record.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {record.status}
                  </span>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>
                      {record.completion || 'N/A'}%
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>
                      {record.score || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* All Programs List */}
        {activeTab === "programs" && (
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
            📚 All Training Programs ({programs.length} programs)
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {programs.map(program => {
              const assignedInstructor = instructors.find(i => i.id === program.instructorId);
              return (
                <div key={program.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{program.name}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{program.description}</p>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      {program.category}
                    </span>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>{program.duration}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>{program.level}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>Instructor:</span>
                      <select
                        value={program.instructorId || ""}
                        onChange={e => handleAssignInstructor(program.id, e.target.value || null)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                      >
                        <option value="">Unassigned</option>
                        {instructors.map(instructor => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.name} - {instructor.expertise}
                          </option>
                        ))}
                      </select>
                      {assignedInstructor && (
                        <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>
                          ✓ {assignedInstructor.name}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditProgram(program)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;