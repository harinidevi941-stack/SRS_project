import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
function Home() {
  const userTypes = [
    {
      type: "Employee",
      icon: "👨‍💼",
      description: "Access your training dashboard, track progress, and earn certifications",
      features: ["Personal Dashboard", "Progress Tracking", "Certificate Management", "Course Enrollment"]
    },
    {
      type: "HR Manager",
      icon: "👩‍💼",
      description: "Manage employee training programs, track organization-wide progress",
      features: ["Employee Management", "Progress Analytics", "Report Generation", "Training Assignment"]
    },
    {
      type: "Instructor",
      icon: "🎓",
      description: "Create and manage training programs, monitor student performance",
      features: ["Program Creation", "Student Analytics", "Performance Tracking", "Content Management"]
    }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Hero Section */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          🎯 TrainingHub
        </h1>
        <p style={{ fontSize: '1.8rem', marginBottom: '1rem', opacity: 0.9 }}>
          Complete Employee Training Management System
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.8, maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          Streamline your organization's training programs with role-based dashboards, 
          comprehensive analytics, and seamless progress tracking.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link 
            to="/login" 
            style={{
              padding: '1.5rem 3rem',
              background: '#ffd700',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 10px 30px rgba(255,215,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 40px rgba(255,215,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(255,215,0,0.3)';
            }}
          >
            🚀 Get Started
          </Link>
          <Link 
            to="/login" 
            style={{
              padding: '1.5rem 3rem',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            👤 Login
          </Link>
        </div>
      </div>

      {/* User Types Section */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '4rem 2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
          fontWeight: 'bold'
        }}>
          Designed for Every Role
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {userTypes.map((userType, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#333',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{userType.icon}</div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>{userType.type}</h3>
                <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>{userType.description}</p>
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.2rem' }}>Key Features:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{
                      padding: '0.5rem 0',
                      color: '#666',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Instructions */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 'bold' }}>
          Try the Demo
        </h2>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '20px', 
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
            Use any email with password <strong>"123"</strong> to login:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffd700' }}>👨‍💼 Employee</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>employee@test.com</p>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffd700' }}>👩‍💼 HR Manager</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>hr@test.com</p>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffd700' }}>🎓 Instructor</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>instructor@test.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        background: 'rgba(0,0,0,0.2)', 
        padding: '2rem', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '1rem' }}>
          © 2024 TrainingHub - Professional Training Management System
        </p>
      </div>
    </div>
  );
}

export default Home;
