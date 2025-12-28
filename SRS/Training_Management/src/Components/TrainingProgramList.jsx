import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function TrainingProgramList() {
  const { programs, enrollEmployee, getEmployeeEnrollments } = useCourseContext();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const myEnrollments = getEmployeeEnrollments(user?.email || '');

  const getEnrollmentStatus = (programId) => {
    const enrollment = myEnrollments.find(e => e.courseId === programId);
    return enrollment ? enrollment.status : "Not Enrolled";
  };

  const getEnrollmentCount = (programId) => {
    // This would need to be implemented to count all enrollments for a program
    return myEnrollments.filter(e => e.courseId === programId).length;
  };

  const handleEnroll = (programId, programName) => {
    if (user?.role === 'employee') {
      const isAlreadyEnrolled = myEnrollments.some(e => e.courseId === programId);
      if (isAlreadyEnrolled) {
        alert('You are already enrolled in this program!');
        return;
      }
      
      enrollEmployee({
        employeeEmail: user.email,
        programId: programId
      });
      alert(`Successfully enrolled in "${programName}"!`);
    } else {
      alert("Only employees can enroll in programs.");
    }
  };

  const extendedPrograms = programs;

  const filteredPrograms = extendedPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'technical': '#3b82f6',
      'soft-skills': '#10b981',
      'leadership': '#8b5cf6',
      'compliance': '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444'
    };
    return colors[level] || '#6b7280';
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
          📚 Training Programs
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Discover and enroll in professional development programs
        </p>

        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="🔍 Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="soft-skills">Soft Skills</option>
              <option value="leadership">Leadership</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
          <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
            Found {filteredPrograms.length} programs
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {filteredPrograms.map(program => {
            const enrollmentStatus = getEnrollmentStatus(program.id);
            const enrollmentCount = getEnrollmentCount(program.id);
            
            return (
              <div key={program.id} style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>{program.name}</h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: getCategoryColor(program.category),
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {program.category.replace('-', ' ')}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', color: '#666', lineHeight: '1.5' }}>
                    {program.description}
                  </p>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  borderRadius: '10px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Duration</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>⏱️ {program.duration}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Level</span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: getLevelColor(program.level)
                    }}>
                      📊 {program.level}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Enrolled</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>👥 {enrollmentCount} students</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Status</span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: enrollmentStatus === 'Completed' ? '#10b981' : 
                             enrollmentStatus === 'In Progress' ? '#f59e0b' : '#6b7280'
                    }}>
                      {enrollmentStatus === 'Not Enrolled' ? '⭕ Not Enrolled' :
                       enrollmentStatus === 'In Progress' ? '🔄 In Progress' :
                       enrollmentStatus === 'Completed' ? '✅ Completed' : enrollmentStatus}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleEnroll(program.id, program.name)}
                  disabled={enrollmentStatus !== 'Not Enrolled' || user?.role !== 'employee'}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: (enrollmentStatus === 'Not Enrolled' && user?.role === 'employee') 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : '#e5e7eb',
                    color: (enrollmentStatus === 'Not Enrolled' && user?.role === 'employee') ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: (enrollmentStatus === 'Not Enrolled' && user?.role === 'employee') ? 'pointer' : 'not-allowed'
                  }}
                >
                  {user?.role !== 'employee' ? '🚫 Enrollment Restricted' :
                   enrollmentStatus === 'Not Enrolled' ? '🚀 Request Enrollment' :
                   enrollmentStatus === 'in-progress' ? '📚 Continue Learning' :
                   enrollmentStatus === 'completed' ? '🏆 Completed' : 'View Details'}
                </button>
              </div>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#666', fontSize: '1.5rem', marginBottom: '1rem' }}>
              🔍 No programs found
            </h3>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingProgramList;