import React, { useState, useEffect } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';

const Topbar = ({ onLogout, user, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  
  const [savedProfileImage, setSavedProfileImage] = useState(getSavedImage());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setSavedProfileImage(getSavedImage());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <header className="app-main-content" style={{ 
      padding: isScrolled ? '1rem 2rem' : '1.5rem 2rem',
      marginLeft: '80px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: isScrolled ? 'rgba(15, 23, 42, 0.75)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
      boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.3)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'white',
          margin: 0
        }}>InvestIQ</h1>
        <p className="hide-on-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Hello, <span style={{ color: '#a78bfa', fontWeight: 600 }}>{firstName}</span> 👋
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="hide-on-mobile" style={{ 
          padding: '0.5rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          width: '250px',
          borderRadius: '12px',
          background: 'var(--glass)',
          border: '1px solid var(--border)'
        }}>
          <Search size={18} color="var(--text-muted)" aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Search..." 
            aria-label="Search stocks or sectors"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              outline: 'none',
              width: '100%'
            }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--border)' }}>
            <Bell size={20} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                <img src={savedProfileImage} alt={`${user?.name || 'User'} profile avatar`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                onClick={onLogout}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--border)', 
                  padding: '8px', 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
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

