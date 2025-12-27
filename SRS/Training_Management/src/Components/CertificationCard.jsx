import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function CertificationCard() {
  const { progress } = useCourseContext();
  const { user } = useAuth();
  const [decisions, setDecisions] = useState({});

  const completed = progress.filter(r => r.status === "Completed" && r.completion === "100");
  const approved = completed.filter(r => decisions[r.id] === "approved");
  const userCompleted = progress.filter(r => 
    r.employeeEmail === user?.email?.toLowerCase() && 
    r.status === "Completed" && 
    r.completion === "100"
  );

  // HR View - Certificate Approval
  if (user?.role === 'hr') {
    return (
      <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Certificate Approval</h1>
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
            📋 Certificate Requests
          </h2>
          
          {completed.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
              Complete courses with 100% to request certificates.
            </p>
          ) : (
            completed.map(r => (
              <div key={r.id} style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '1.5rem', 
                margin: '1rem 0', 
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{r.employeeName}</strong> - {r.programName} ({r.completion}%)
                </div>
                <button 
                  onClick={() => setDecisions({...decisions, [r.id]: "approved"})}
                  disabled={decisions[r.id] === "approved"}
                  style={{ 
                    background: decisions[r.id] === "approved" ? '#10b981' : '#667eea', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: '25px', 
                    fontWeight: 'bold',
                    cursor: decisions[r.id] === "approved" ? 'default' : 'pointer'
                  }}
                >
                  {decisions[r.id] === "approved" ? '✅ Approved' : 'Approve Certificate'}
                </button>
              </div>
            ))
          )}
        </div>
          
          <h2 style={{ marginTop: '3rem' }}>Approved ({approved.length})</h2>
          {approved.map(r => (
            <div key={r.id} style={{ 
              background: 'rgba(16,185,129,0.2)', 
              padding: '1.5rem', 
              margin: '1rem 0', 
              borderRadius: '15px',
              borderLeft: '5px solid #10b981'
            }}>
              ✅ {r.employeeName} - {r.programName} - APPROVED
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Employee View - View Certificates Only
  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>My Certificates</h1>
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        {userCompleted.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '3rem', 
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <h3>No certificates available</h3>
            <p>Complete training programs to earn certificates</p>
          </div>
        ) : (
          userCompleted.map(r => (
            <div key={r.id} style={{ 
              background: 'rgba(255,255,255,0.95)', 
              color: '#333',
              padding: '2rem', 
              margin: '1rem 0', 
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>🏆 Certificate of Completion</h2>
              <h3 style={{ marginBottom: '0.5rem' }}>{r.programName}</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Awarded to: <strong>{r.employeeName}</strong></p>
              <p style={{ color: '#666' }}>Completion: {r.completion}% | Score: {r.score || 'N/A'}</p>
              <div style={{ 
                marginTop: '2rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderRadius: '10px'
              }}>
                Status: {decisions[r.id] === "approved" ? "✅ Approved" : "⏳ Pending HR Approval"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CertificationCard;