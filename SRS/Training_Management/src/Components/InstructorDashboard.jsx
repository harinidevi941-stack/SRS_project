import React from 'react';
import { useCourseContext } from '../Context/CourseContext';
import { useAuth } from '../Context/AuthContext';

function InstructorDashboard() {
  const { programs, getAllEnrollments, instructors } = useCourseContext();
  const { user } = useAuth();
  
  // Find instructor by matching name in email (e.g., john_instructor@gmail.com matches "John Smith")
  const instructor = instructors.find(i => {
    const firstName = i.name.split(' ')[0].toLowerCase();
    return user?.email.toLowerCase().includes(firstName);
  });
  
  // Find programs assigned to the matched instructor
  const assignedPrograms = programs.filter(p => p.instructorId === instructor?.id);
  const allEnrollments = getAllEnrollments();
  const myProgramEnrollments = allEnrollments.filter(e => 
    assignedPrograms.some(p => p.id === e.courseId)
  );
  const enrollmentsWithFeedback = myProgramEnrollments.filter(e => e.feedback);

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
          Instructor Dashboard
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Welcome, <strong>{instructor?.name || user?.email}</strong>
        </p>

        {/* Assigned Programs */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
            📚 My Assigned Programs ({assignedPrograms.length})
          </h2>
          
          {assignedPrograms.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No programs assigned yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {assignedPrograms.map(program => (
                <div key={program.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  border: '1px solid rgba(102,126,234,0.2)'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{program.name}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{program.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <span>📅 {program.duration}</span>
                    <span>📊 {program.level}</span>
                    <span>👥 {myProgramEnrollments.filter(e => e.courseId === program.id).length} students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enrolled Students */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
            👥 Enrolled Students ({myProgramEnrollments.length})
          </h2>
          
          {myProgramEnrollments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No student enrollments yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ fontWeight: '600', color: '#333' }}>Student Email</div>
                <div style={{ fontWeight: '600', color: '#333' }}>Program</div>
                <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Status</div>
                <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Progress</div>
              </div>
              {myProgramEnrollments.map(enrollment => {
                const program = programs.find(p => p.id === enrollment.courseId);
                return (
                  <div key={enrollment.id} style={{
                    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#333' }}>{enrollment.employeeId}</h4>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#333' }}>{program?.name}</h4>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        background: enrollment.status === 'completed' ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {enrollment.status}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: `conic-gradient(#10b981 ${enrollment.progressPercent * 3.6}deg, #e5e7eb 0deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <div style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          {enrollment.progressPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Student Feedback */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
            💬 Student Feedback ({enrollmentsWithFeedback.length})
          </h2>
          
          {enrollmentsWithFeedback.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No feedback received yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {enrollmentsWithFeedback.map(enrollment => {
                const program = programs.find(p => p.id === enrollment.courseId);
                return (
                  <div key={enrollment.id} style={{
                    background: 'linear-gradient(145deg, #ffffff, #f0f9ff)',
                    borderRadius: '15px',
                    padding: '2rem',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{enrollment.employeeId}</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{program?.name}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                          {'⭐'.repeat(enrollment.feedback.rating)}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {enrollment.feedback.rating}/5 Rating
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ 
                          padding: '0.5rem 1rem',
                          background: '#10b981',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          Completed
                        </span>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1.5rem', 
                      background: '#f8fafc', 
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>💭 Student Comment:</div>
                      <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                        "{enrollment.feedback.comment}"
                      </p>
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

export default InstructorDashboard;