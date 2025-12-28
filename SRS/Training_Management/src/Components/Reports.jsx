import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function Reports() {
  const { programs, getAllEnrollments } = useCourseContext();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState("overview");

  const enrollments = getAllEnrollments();
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const inProgressEnrollments = enrollments.filter(e => e.status === 'in-progress');

  const generateOverviewReport = () => {
    const totalEmployees = [...new Set(enrollments.map(e => e.employeeId))].length;
    const completionRate = enrollments.length > 0 ? Math.round((completedEnrollments.length / enrollments.length) * 100) : 0;
    const avgProgress = enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / enrollments.length) : 0;
    
    return {
      totalEmployees,
      totalEnrollments: enrollments.length,
      completedTrainings: completedEnrollments.length,
      inProgressTrainings: inProgressEnrollments.length,
      completionRate,
      avgProgress
    };
  };

  const generateProgramReport = () => {
    return programs.map(program => {
      const programEnrollments = enrollments.filter(e => e.courseId === program.id);
      const completed = programEnrollments.filter(e => e.status === 'completed').length;
      const inProgress = programEnrollments.filter(e => e.status === 'in-progress').length;
      const completionRate = programEnrollments.length > 0 ? Math.round((completed / programEnrollments.length) * 100) : 0;
      const avgProgress = programEnrollments.length > 0 ? Math.round(programEnrollments.reduce((acc, e) => acc + e.progressPercent, 0) / programEnrollments.length) : 0;
      const feedbackCount = programEnrollments.filter(e => e.feedback).length;
      const avgRating = feedbackCount > 0 ? (programEnrollments.filter(e => e.feedback).reduce((acc, e) => acc + e.feedback.rating, 0) / feedbackCount).toFixed(1) : 'N/A';
      
      return {
        ...program,
        enrollments: programEnrollments.length,
        completed,
        inProgress,
        completionRate,
        avgProgress,
        avgRating,
        feedbackCount
      };
    });
  };

  const generateEmployeeReport = () => {
    const employees = [...new Set(enrollments.map(e => e.employeeId))];
    return employees.map(employeeId => {
      const employeeEnrollments = enrollments.filter(e => e.employeeId === employeeId);
      const completed = employeeEnrollments.filter(e => e.status === 'completed').length;
      const inProgress = employeeEnrollments.filter(e => e.status === 'in-progress').length;
      const avgProgress = employeeEnrollments.length > 0 ? Math.round(employeeEnrollments.reduce((acc, e) => acc + e.progressPercent, 0) / employeeEnrollments.length) : 0;
      
      return {
        employeeId,
        totalEnrollments: employeeEnrollments.length,
        completed,
        inProgress,
        avgProgress
      };
    });
  };

  const overviewData = generateOverviewReport();
  const programData = generateProgramReport();
  const employeeData = generateEmployeeReport();

  const exportReport = () => {
    const reportData = {
      overview: overviewData,
      programs: programData,
      employees: employeeData,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.email
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)',
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
          📊 Training Reports
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Employee progress and program effectiveness analytics
        </p>

        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            >
              <option value="overview">📈 Overview Report</option>
              <option value="programs">📚 Program Effectiveness</option>
              <option value="employees">👥 Employee Progress</option>
            </select>
            <button
              onClick={exportReport}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              📥 Export Report
            </button>
          </div>
        </div>

        {selectedReport === 'overview' && (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              📈 Training Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{overviewData.totalEmployees}</h3>
                <p style={{ margin: 0, fontSize: '1rem' }}>Active Employees</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{overviewData.totalEnrollments}</h3>
                <p style={{ margin: 0, fontSize: '1rem' }}>Total Enrollments</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{overviewData.completedTrainings}</h3>
                <p style={{ margin: 0, fontSize: '1rem' }}>Completed</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '15px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{overviewData.completionRate}%</h3>
                <p style={{ margin: 0, fontSize: '1rem' }}>Completion Rate</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'programs' && (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              📚 Program Effectiveness Report
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {programData.map(program => (
                <div key={program.id} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{program.name}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{program.duration} • {program.level}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333', fontSize: '1.2rem' }}>{program.enrollments}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Enrollments</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#10b981', fontSize: '1.2rem' }}>{program.completed}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Completed</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '1.2rem' }}>{program.completionRate}%</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Completion Rate</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#8b5cf6', fontSize: '1.2rem' }}>{program.avgProgress}%</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Avg Progress</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#ef4444', fontSize: '1.2rem' }}>{program.avgRating}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Rating ({program.feedbackCount})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'employees' && (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              👥 Employee Progress Report
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {employeeData.map((employee, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{employee.employeeId}</h4>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333', fontSize: '1.2rem' }}>{employee.totalEnrollments}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Enrollments</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#10b981', fontSize: '1.2rem' }}>{employee.completed}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Completed</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '1.2rem' }}>{employee.inProgress}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>In Progress</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#8b5cf6', fontSize: '1.2rem' }}>{employee.avgProgress}%</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Avg Progress</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;