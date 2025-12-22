
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const getNavStyle = (path, currentPath) => ({
    padding: '0.75rem 1.5rem',
    borderRadius: '16px',
    fontWeight: '600',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    background: path === currentPath ? 'rgba(255,255,255,0.3)' : 'transparent',
    backdropFilter: 'blur(20px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  return (
    <nav style={{
      /* Pink gradient navbar */
      background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff8fab 100%)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 25px 50px -12px rgba(255, 107, 157, 0.4)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <Link to="/" style={getNavStyle('/', location.pathname)}>
          🏠 Home
        </Link>
        <Link to="/courses" style={getNavStyle('/courses', location.pathname)}>
          📚 Course List
        </Link>
        <Link to="/add-course" style={getNavStyle('/add-course', location.pathname)}>
          ➕ Add Course
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
