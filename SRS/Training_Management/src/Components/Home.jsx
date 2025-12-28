import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    // Redirect logged-in users to their dashboard
    switch(user.role) {
      case 'hr': navigate('/hr-dashboard'); break;
      case 'instructor': navigate('/instructor-dashboard'); break;
      default: navigate('/dashboard'); break;
    }
    return null;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">🎯 TrainingHub</h1>
          <p className="hero-subtitle">
            Your Complete Training Management Solution
          </p>
          <p className="hero-description">
            Streamline employee training, track progress, and manage certifications all in one place.
          </p>
          
          <div className="cta-section">
            <button 
              onClick={() => navigate('/login')}
              className="cta-button"
            >
              🚀 Get Started
            </button>
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">Why Choose TrainingHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Role-Based Access</h3>
              <p>Separate dashboards for employees, instructors, and HR with tailored functionality.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Course Management</h3>
              <p>Create, assign, and track training programs with interactive task completion.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certification System</h3>
              <p>Automated certificate generation with HR approval workflow.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Real-time progress monitoring and comprehensive reporting dashboard.</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2 className="demo-title">Quick Demo Access</h2>
          <div className="demo-cards">
            <div className="demo-card">
              <h3>👨‍💼 HR Dashboard</h3>
              <p>Login with any email containing "hr" + password "123"</p>
              <button onClick={() => navigate('/login')} className="demo-button">Try HR Role</button>
            </div>
            
            <div className="demo-card">
              <h3>👨‍🏫 Instructor Portal</h3>
              <p>Login with any email containing "instructor" + password "123"</p>
              <button onClick={() => navigate('/login')} className="demo-button">Try Instructor Role</button>
            </div>
            
            <div className="demo-card">
              <h3>👨‍💻 Employee Access</h3>
              <p>Login with any other email + password "123"</p>
              <button onClick={() => navigate('/login')} className="demo-button">Try Employee Role</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;