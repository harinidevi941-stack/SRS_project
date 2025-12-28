import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../Context/CourseContext';
import { useAuth } from '../Context/AuthContext';

function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { programs, enrollments, updateTaskCompletion, submitCourseFeedback, getEnrollment } = useCourseContext();
  const { user } = useAuth();
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const employeeId = user?.email || '';
  const program = programs.find(p => p.id === courseId);
  const enrollment = getEnrollment(employeeId, courseId);
  
  if (!program || !enrollment) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>Course not found or not enrolled</h2>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleTaskToggle = (taskId) => {
    updateTaskCompletion(employeeId, courseId, taskId);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitCourseFeedback(employeeId, courseId, { rating, comment: feedback });
    setFeedback('');
    setRating(5);
  };

  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '1rem' }}>← Back to Dashboard</button>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>{program.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>{program.description}</p>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Progress: {enrollment.tasks.filter(t => t.isCompleted).length}/{enrollment.tasks.length} tasks completed</span>
              <span style={{ fontWeight: 'bold' }}>{enrollment.progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${enrollment.progressPercent}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>📚 Course Tasks</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {enrollment.tasks.map((task) => (
                <div key={task.id} style={{ 
                  padding: '1.5rem', 
                  border: '2px solid ' + (task.isCompleted ? '#10b981' : '#e5e7eb'), 
                  borderRadius: '10px',
                  background: task.isCompleted ? '#f0fdf4' : '#ffffff',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleTaskToggle(task.id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{task.title}</h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem',
                        background: task.isCompleted ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {task.isCompleted ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>💬 Course Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Rating:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '5px' }}>
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Poor</option>
                  <option value={1}>⭐ Very Poor</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Feedback:</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  rows={4}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '5px', resize: 'vertical' }}
                />
              </div>
              
              <button type="submit" style={{ 
                padding: '1rem 2rem', 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;