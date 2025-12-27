import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'hr':
        return [
          { path: '/hr-dashboard', label: '📊 HR Dashboard', icon: '📊' },
          { path: '/progress', label: '📈 Progress', icon: '📈' },
          { path: '/reports', label: '📋 Reports', icon: '📋' }
        ];
      case 'instructor':
        return [
          { path: '/instructor-dashboard', label: '🎓 Instructor Dashboard', icon: '🎓' },
          { path: '/programs', label: '📚 Programs', icon: '📚' },
          { path: '/students', label: '👥 Students', icon: '👥' }
        ];
      case 'employee':
      default:
        return [
          { path: '/dashboard', label: '🏠 My Dashboard', icon: '🏠' },
          { path: '/programs', label: '📚 Programs', icon: '📚' },
          { path: '/certification', label: '🏆 Certificates', icon: '🏆' }
        ];
    }
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🎯 TrainingHub
        </Link>

        {/* Navigation Items */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {getNavItems().map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                background: isActive(item.path) 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'transparent',
                border: isActive(item.path) 
                  ? '2px solid rgba(255,255,255,0.3)' 
                  : '2px solid transparent',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            color: 'white', 
            fontSize: '0.9rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ opacity: 0.8 }}>
              {user.role.toUpperCase()} • 
            </span>
            <span style={{ fontWeight: '600' }}>
              {user.email.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;