import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';

const Topbar = ({ onLogout, user, setActiveTab }) => {
  // Extract first name from full name
  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'User';
  const avatarLetter = firstName.charAt(0).toUpperCase();

  // Load saved profile image from localStorage
  const getSavedImage = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved).profileImage || null : null;
    } catch { return null; }
  };
  const savedProfileImage = getSavedImage();

  return (
    <header className="flex-between" style={{ 
      padding: '1.5rem 2rem',
      marginLeft: '280px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h1 className="text-gradient">Portfolio Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Hello, <span style={{ color: '#a78bfa', fontWeight: 600 }}>{firstName}</span> 👋 &nbsp;Welcome back!
        </p>
      </div>

      <div className="flex-center" style={{ gap: '1.5rem' }}>
        <div className="glass-card" style={{ 
          padding: '0.5rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          width: '300px',
          borderRadius: '12px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search stocks, sectors..." 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              outline: 'none',
              width: '100%'
            }} 
          />
        </div>

        <div className="flex-center" style={{ gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '10px' }}>
            <Bell size={20} color="var(--text-muted)" />
          </div>
          <div className="flex-center" style={{ gap: '10px' }}>
            {/* Avatar with user's first letter */}
            <div 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: savedProfileImage ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'white',
                boxShadow: '0 0 12px rgba(99,102,241,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                overflow: 'hidden',
                border: savedProfileImage ? '2px solid rgba(99,102,241,0.5)' : 'none',
              }}
              onClick={() => setActiveTab('profile')}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {savedProfileImage ? (
                <img src={savedProfileImage} alt={avatarLetter} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                avatarLetter
              )}
            </div>
            {/* User name text */}
            <span 
              style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onClick={() => setActiveTab('profile')}
              onMouseOver={(e) => e.target.style.color = 'white'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              {firstName}
            </span>
            {onLogout && (
              <button 
                className="btn" 
                onClick={onLogout}
                style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px', display: 'flex', alignItems: 'center' }}
                title="Log out"
              >
                <LogOut size={16} color="var(--danger)" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

