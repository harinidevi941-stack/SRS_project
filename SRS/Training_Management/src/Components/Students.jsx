import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function Students() {
  const { programs, progress } = useCourseContext();
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState("");

  if (user?.role !== 'hr' && user?.role !== 'instructor') {
    return <div>Access denied</div>;
  }

  const allStudents = [...new Set(progress.map(p => p.employeeEmail))];
  const programStudents = selectedProgram ? 
    progress.filter(p => p.programId === selectedProgram) : [];

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
          marginBottom: '2rem'
        }}>
          👥 Students Overview
        </h1>

        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Total Enrolled Students: {allStudents.length}</h2>
          
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '2rem'
            }}
          >
            <option value="">All Students</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {selectedProgram ? (
            <div>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                Students in {programs.find(p => p.id === selectedProgram)?.name} ({programStudents.length})
              </h3>
              {programStudents.map(student => (
                <div key={student.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '10px',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  boxShadow: '0 5px 10px rgba(0,0,0,0.05)',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{student.employeeName}</h4>
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
                    {student.completion}%
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
                    {student.score || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>All Students ({allStudents.length})</h3>
              {allStudents.map(email => {
                const studentProgress = progress.filter(p => p.employeeEmail === email);
                const studentName = studentProgress[0]?.employeeName || email.split('@')[0];
                const completed = studentProgress.filter(p => p.status === 'Completed').length;
                const total = studentProgress.length;
                
                return (
                  <div key={email} style={{
                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                    borderRadius: '10px',
                    padding: '1rem',
                    margin: '0.5rem 0',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.05)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{studentName}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{email}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>{total} Enrolled</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#10b981' }}>{completed} Completed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;