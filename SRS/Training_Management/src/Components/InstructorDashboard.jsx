import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function InstructorDashboard() {
  const { programs, instructors, progress } = useCourseContext();
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState("");

  // Get current instructor's ID based on email
  const currentInstructor = instructors.find(i => i.email === user?.email);
  const assignedPrograms = programs.filter(p => p.instructorId === currentInstructor?.id);

  const getStudentsForProgram = (programId) => {
    return progress.filter(p => p.programId === programId);
  };

  const getCompletionRate = (programId) => {
    const students = getStudentsForProgram(programId);
    if (students.length === 0) return 0;
    const completed = students.filter(s => s.status === 'Completed').length;
    return Math.round((completed / students.length) * 100);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
          Instructor Dashboard
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Welcome, <strong>{currentInstructor?.name || user?.email}</strong> - Manage your assigned training programs
        </p>

        {assignedPrograms.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#666', marginBottom: '1rem' }}>No Programs Assigned</h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              You don't have any programs assigned yet. Contact HR to get programs assigned to you.
            </p>
          </div>
        ) : (
        <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Assigned Programs Overview */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              📚 My Assigned Programs
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {assignedPrograms.map(program => (
                <div key={program.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{program.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{program.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                    <span>Duration: {program.duration}</span>
                    <span>Level: {program.level}</span>
                    <span>Category: {program.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Statistics */}
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
              📊 My Programs Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{assignedPrograms.length}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Assigned Programs</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {progress.length}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Students</p>
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
                  {Math.round(progress.filter(p => p.status === 'Completed').length / Math.max(progress.length, 1) * 100)}%
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
            🎯 Program Performance
          </h2>
          <div style={{ marginBottom: '2rem' }}>
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '10px', 
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            >
              <option value="">Select a program to view details</option>
              {assignedPrograms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProgram && (
            <div>
              {(() => {
                const program = assignedPrograms.find(p => p.id === selectedProgram);
                const students = getStudentsForProgram(selectedProgram);
                const completionRate = getCompletionRate(selectedProgram);
                
                return (
                  <div>
                    <div style={{ 
                      background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)', 
                      borderRadius: '15px', 
                      padding: '2rem', 
                      marginBottom: '2rem' 
                    }}>
                      <h3 style={{ color: '#333', marginBottom: '1rem' }}>{program?.name}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#8b5cf6' }}>
                            {students.length}
                          </h4>
                          <p style={{ margin: 0, color: '#666' }}>Enrolled Students</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#10b981' }}>
                            {completionRate}%
                          </h4>
                          <p style={{ margin: 0, color: '#666' }}>Completion Rate</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#f59e0b' }}>
                            {students.filter(s => s.score).length > 0 
                              ? Math.round(students.filter(s => s.score).reduce((acc, s) => acc + parseInt(s.score || 0), 0) / students.filter(s => s.score).length)
                              : 'N/A'
                            }
                          </h4>
                          <p style={{ margin: 0, color: '#666' }}>Avg Score</p>
                        </div>
                      </div>
                    </div>

                    <h4 style={{ color: '#333', marginBottom: '1rem' }}>Student Progress:</h4>
                    {students.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666' }}>No students enrolled yet.</p>
                    ) : (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {students.map(student => (
                          <div key={student.id} style={{
                            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                            borderRadius: '10px',
                            padding: '1rem',
                            boxShadow: '0 5px 10px rgba(0,0,0,0.05)',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: '1rem',
                            alignItems: 'center'
                          }}>
                            <div>
                              <h5 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{student.employeeName}</h5>
                              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{student.employeeEmail}</p>
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              background: student.status === 'Completed' ? '#10b981' : '#f59e0b',
                              color: 'white',
                              borderRadius: '15px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              {student.status}
                            </span>
                            <div style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
                              {student.completion || 'N/A'}%
                            </div>
                            <div style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
                              {student.score || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        </>)}
      </div>
    </div>
  );
}

export default InstructorDashboard;