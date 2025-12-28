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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎯 TrainingHub
        </Link>

        <div className="navbar-nav">
          {getNavItems().map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-role">
              {user.role.toUpperCase()} • 
            </span>
            <span className="user-email">
              {user.email.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;