import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function Reports() {
  const { programs, progress } = useCourseContext();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("all");

  const generateOverviewReport = () => {
    const totalEmployees = [...new Set(progress.map(p => p.employeeEmail))].length;
    const totalEnrollments = progress.length;
    const completedTrainings = progress.filter(p => p.status === 'Completed').length;
    const inProgressTrainings = progress.filter(p => p.status === 'In Progress').length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedTrainings / totalEnrollments) * 100) : 0;
    
    return {
      totalEmployees,
      totalEnrollments,
      completedTrainings,
      inProgressTrainings,
      completionRate
    };
  };

  const generateProgramReport = () => {
    return programs.map(program => {
      const programProgress = progress.filter(p => p.programId === program.id);
      const completed = programProgress.filter(p => p.status === 'Completed').length;
      const inProgress = programProgress.filter(p => p.status === 'In Progress').length;
      const completionRate = programProgress.length > 0 ? Math.round((completed / programProgress.length) * 100) : 0;
      const avgScore = programProgress.filter(p => p.score && p.score !== '').length > 0 
        ? Math.round(programProgress.filter(p => p.score && p.score !== '').reduce((acc, p) => acc + parseInt(p.score), 0) / programProgress.filter(p => p.score && p.score !== '').length)
        : 0;
      
      return {
        ...program,
        enrollments: programProgress.length,
        completed,
        inProgress,
        completionRate,
        avgScore
      };
    });
  };

  const generateEmployeeReport = () => {
    const employees = [...new Set(progress.map(p => p.employeeEmail))];
    return employees.map(email => {
      const employeeProgress = progress.filter(p => p.employeeEmail === email);
      const employeeName = employeeProgress[0]?.employeeName || email.split('@')[0];
      const completed = employeeProgress.filter(p => p.status === 'Completed').length;
      const inProgress = employeeProgress.filter(p => p.status === 'In Progress').length;
      const avgScore = employeeProgress.filter(p => p.score && p.score !== '').length > 0 
        ? Math.round(employeeProgress.filter(p => p.score && p.score !== '').reduce((acc, p) => acc + parseInt(p.score), 0) / employeeProgress.filter(p => p.score && p.score !== '').length)
        : 0;
      
      return {
        email,
        name: employeeName,
        totalEnrollments: employeeProgress.length,
        completed,
        inProgress,
        avgScore
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
          Comprehensive analytics and insights for training programs
        </p>

        {/* Report Controls */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '20px', 
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                <option value="programs">📚 Program Report</option>
                <option value="employees">👥 Employee Report</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
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

        {/* Overview Report */}
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

        {/* Program Report */}
        {selectedReport === 'programs' && (
          <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              📚 Program Performance Report
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
                      <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '1.2rem' }}>{program.inProgress}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>In Progress</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#8b5cf6', fontSize: '1.2rem' }}>{program.completionRate}%</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Completion</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#ef4444', fontSize: '1.2rem' }}>{program.avgScore || 'N/A'}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Avg Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee Report */}
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
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{employee.name}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{employee.email}</p>
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
                      <span style={{ fontWeight: '600', color: '#8b5cf6', fontSize: '1.2rem' }}>{employee.avgScore || 'N/A'}</span>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Avg Score</p>
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