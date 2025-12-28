import React from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const { programs, progress, enrollments, trackMaterialView, getMaterialProgress, calculateCompletionPercentage, getEmployeeEnrollments } = useCourseContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const employeeEmail = user?.email || "";
  
  const myEnrollments = getEmployeeEnrollments(employeeEmail);
  const myProgress = progress.filter(r => r.employeeEmail === employeeEmail?.toLowerCase());
  const completedCourses = myEnrollments.filter(e => e.status === 'completed');
  const approvedCertificates = completedCourses.filter(e => e.certificateApprovedByHr);

  const handleMaterialClick = (programId, materialIndex) => {
    trackMaterialView(employeeEmail, programId, materialIndex);
  };

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
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem' }}>
            My Enrolled Courses ({myEnrollments.length})
          </h2>
          
          {myEnrollments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <h3 style={{ marginBottom: '1rem' }}>No Enrolled Courses</h3>
              <p style={{ marginBottom: '1.5rem' }}>Study materials are available only for enrolled programs.</p>
              <button
                onClick={() => navigate('/programs')}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse & Enroll in Programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {myEnrollments.map(enrollment => {
                const program = programs.find(p => p.id === enrollment.courseId);
                const completionPercentage = enrollment.progressPercent;
                
                return (
                  <div key={enrollment.id} style={{
                    background: 'linear-gradient(145deg, #ffffff, #f0f8ff)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(102,126,234,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(`/course/${enrollment.courseId}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  }}
                  >
                    <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                      {program?.name}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                      {program?.description}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Progress</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>{completionPercentage}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${completionPercentage}%`,
                          height: '100%',
                          background: completionPercentage === 100 ? '#10b981' : '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem',
                        background: enrollment.status === 'completed' ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      padding: '1rem',
                      background: '#f0f9ff',
                      borderRadius: '10px',
                      marginTop: '1rem',
                      border: '2px solid #3b82f6',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}>
                      <span style={{ color: '#1d4ed8', fontWeight: '600' }}>🎯 Click to Start Course</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {completedCourses.length > 0 && (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '24px', 
            padding: '3rem', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#333', marginBottom: '2rem' }}>
              🏆 My Certificates ({completedCourses.length} completed)
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {completedCourses.map(enrollment => {
                const program = programs.find(p => p.id === enrollment.courseId);
                const isApproved = enrollment.certificateApprovedByHr;
                
                return (
                  <div key={enrollment.id} style={{
                    background: isApproved ? 'linear-gradient(145deg, #dcfce7, #bbf7d0)' : 'linear-gradient(145deg, #fef3c7, #fde68a)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    border: `2px solid ${isApproved ? '#10b981' : '#f59e0b'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      {isApproved ? '🏆' : '⏳'}
                    </div>
                    <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                      {program?.name}
                    </h3>
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: isApproved ? '#10b981' : enrollment.certificateStatus === 'denied' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '1rem'
                    }}>
                      {isApproved ? '✅ HR Approved' : enrollment.certificateStatus === 'denied' ? '❌ HR Denied' : '⏳ Pending HR Approval'}
                    </div>
                    {isApproved && (
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `data:text/plain;charset=utf-8,Certificate of Completion%0A%0AThis certifies that ${user?.email} has successfully completed the ${program?.name} training program.%0A%0ADate: ${new Date().toLocaleDateString()}`;
                          link.download = `${program?.name.replace(/\s+/g, '_')}_Certificate.txt`;
                          link.click();
                        }}
                        style={{
                          padding: '1rem 2rem',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '25px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        📥 Download Certificate
                      </button>
                    )}
                    {!isApproved && enrollment.certificateStatus !== 'denied' && (
                      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                        Your certificate is being reviewed by HR
                      </p>
                    )}
                    {enrollment.certificateStatus === 'denied' && (
                      <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>
                        Certificate request was denied by HR
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '24px', 
          padding: '3rem', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)' 
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem' }}>
            📊 Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => navigate('/programs')}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🎯 Browse Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;