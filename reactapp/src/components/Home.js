import React, { useState } from "react";

const Home = () => {
  const [hoverCard, setHoverCard] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #a8e6cf 50%, #b8e6ff 100%)',
      padding: '6rem 2rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      
      {/* Hero Text */}
      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 5rem)',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #ff6b9d 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem',
        animation: 'glow 2s ease-in-out infinite alternate'
      }}>
        Welcome to the Course Management System ✨
      </h1>

      <p style={{
        fontSize: '1.4rem',
        color: 'rgba(26,32,44,0.9)',
        maxWidth: '500px',
        marginBottom: '4rem',
        background: 'rgba(255,255,255,0.6)',
        padding: '1.5rem 2rem',
        borderRadius: '20px',
        backdropFilter: 'blur(15px)'
      }}>
        Create, manage, and track courses with magic! 🚀
      </p>

      {/* Interactive Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        maxWidth: '800px'
      }}>
        {[
          { icon: '📚', title: 'Courses', desc: 'Unlimited', color: '#ff6b9d' },
          { icon: '🎯', title: 'Success', desc: '100%', color: '#3b82f6' },
          { icon: '⚡', title: 'Fast', desc: 'Lightning', color: '#10b981' }
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transform: hoverCard === i ? 'scale(1.1) translateY(-15px)' : 'scale(1)',
              transition: 'all 0.4s ease',
              boxShadow: hoverCard === i 
                ? `0 25px 50px ${card.color}40` 
                : '0 15px 30px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={() => setHoverCard(i)}
            onMouseLeave={() => setHoverCard(null)}
          >
             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.icon}</div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              color: card.color,
              marginBottom: '0.5rem' 
            }}>
              {card.title}
            </h3>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: 'white',
              textShadow: `0 2px 10px ${card.color}30`
            }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px rgba(255,107,157,0.5)); }
          to { filter: drop-shadow(0 0 30px rgba(59,130,246,0.6)); }
        }
      `}</style>
    </div>
  );
};

export default Home;