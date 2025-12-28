import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function Students() {
  const { programs, getAllEnrollments, instructors } = useCourseContext();
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState("");

  if (user?.role !== 'hr' && user?.role !== 'instructor') {
    return <div>Access denied</div>;
  }

  // For instructors, filter programs by their assignments
  let availablePrograms = programs;
  if (user?.role === 'instructor') {
    const instructor = instructors.find(i => {
      const firstName = i.name.split(' ')[0].toLowerCase();
      return user?.email.toLowerCase().includes(firstName);
    });
    availablePrograms = programs.filter(p => p.instructorId === instructor?.id);
  }

  const allEnrollments = getAllEnrollments();
  const filteredEnrollments = user?.role === 'instructor' 
    ? allEnrollments.filter(e => availablePrograms.some(p => p.id === e.courseId))
    : allEnrollments;

  const programEnrollments = selectedProgram ? 
    filteredEnrollments.filter(e => e.courseId === selectedProgram) : filteredEnrollments;

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
          👥 {user?.role === 'instructor' ? 'My Students' : 'Students Overview'}
        </h1>

        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>
            Total Enrolled Students: {filteredEnrollments.length}
          </h2>
          
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
            <option value="">All {user?.role === 'instructor' ? 'My' : ''} Programs</option>
            {availablePrograms.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {selectedProgram ? (
            <div>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                Students in {programs.find(p => p.id === selectedProgram)?.name} ({programEnrollments.length})
              </h3>
              {programEnrollments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No students enrolled in this program yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>Student</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Status</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Progress</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Tasks</div>
                  </div>
                  {programEnrollments.map(enrollment => {
                    const program = programs.find(p => p.id === enrollment.courseId);
                    const completedTasks = enrollment.tasks?.filter(t => t.isCompleted).length || 0;
                    const totalTasks = enrollment.tasks?.length || 0;
                    
                    return (
                      <div key={enrollment.id} style={{
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '1rem',
                        alignItems: 'center',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{enrollment.employeeId}</h4>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{program?.name}</p>
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
                            width: '50px', 
                            height: '50px', 
                            borderRadius: '50%', 
                            background: `conic-gradient(#10b981 ${enrollment.progressPercent * 3.6}deg, #e5e7eb 0deg)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}>
                            <div style={{
                              width: '35px',
                              height: '35px',
                              borderRadius: '50%',
                              background: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              color: '#333'
                            }}>
                              {enrollment.progressPercent}%
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
                          {completedTasks}/{totalTasks}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>
                All {user?.role === 'instructor' ? 'My' : ''} Students ({filteredEnrollments.length})
              </h3>
              {filteredEnrollments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No students enrolled yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>Student</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Program</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Status</div>
                    <div style={{ fontWeight: '600', color: '#333', textAlign: 'center' }}>Progress</div>
                  </div>
                  {filteredEnrollments.map(enrollment => {
                    const program = programs.find(p => p.id === enrollment.courseId);
                    
                    return (
                      <div key={enrollment.id} style={{
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '1rem',
                        alignItems: 'center',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>{enrollment.employeeId}</h4>
                        </div>
                        <div style={{ textAlign: 'center', color: '#666' }}>
                          {program?.name}
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
                        <div style={{ textAlign: 'center', fontWeight: '600', color: '#333' }}>
                          {enrollment.progressPercent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;