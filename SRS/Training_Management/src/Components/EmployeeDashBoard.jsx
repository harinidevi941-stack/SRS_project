import React from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const { progress } = useCourseContext();
  const { user } = useAuth();
  const employeeEmail = user?.email || "";
  
  const myProgress = progress.filter(r => r.employeeEmail === employeeEmail?.toLowerCase());

  return (
    <div style={{ 
      padding: '4rem 2rem', 
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem'
        }}>
          My Dashboard
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#333', marginBottom: '3rem' }}>
          Welcome back, <strong>{user?.email || 'Employee'}</strong>!
        </p>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '24px', 
          padding: '3rem', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)' 
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem' }}>
            My Progress ({myProgress.length} records)
          </h2>
          
          {myProgress.length === 0 ? (
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              No enrolled courses yet. Visit Programs to enroll in training.
            </p>
          ) : (
            myProgress.map(r => (
              <div key={r.id} style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f8ff)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(102,126,234,0.2)',
                marginBottom: '1.5rem'
              }}>
                 <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                  {r.programName}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ 
                    padding: '0.5rem 1.2rem',
                    background: r.status === 'Completed' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    borderRadius: '25px',
                    fontWeight: '600'
                  }}>
                    {r.status}
                  </span>
                  <span style={{ fontWeight: '600', color: '#666' }}>
                    {r.completion || 'N/A'}%
                  </span>
                </div>
                {r.score && (
                  <p style={{ color: '#666', margin: 0 }}>
                    Score: <strong>{r.score}</strong>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;