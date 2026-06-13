import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut,
  Target,
  Newspaper
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'news', icon: Newspaper, label: 'News' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar-container" style={{ 
      height: 'calc(100vh - 2rem)', 
      width: '80px', 
      margin: '1rem',
      position: 'fixed',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 100,
      background: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
      transition: 'all 0.3s ease'
    }}>
      <div className="sidebar-logo-container" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          background: 'linear-gradient(135deg, var(--primary), #a78bfa)', 
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
          cursor: 'pointer'
        }}>
          <TrendingUp size={24} color="white" />
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation" style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="sidebar-item"
            title={item.label}
            aria-label={`Go to ${item.label}`}
            role="button"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === item.id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
              border: activeTab === item.id ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
            }}
            onMouseOver={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            <item.icon size={22} />
          </div>
        ))}
      </nav>

      <div className="sidebar-logout-container" style={{ paddingBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div 
          onClick={onLogout}
          title="Logout"
          style={{ 
          width: '50px',
          height: '50px',
          borderRadius: '16px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--danger)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: 'rgba(239, 68, 68, 0.05)'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
        >
          <LogOut size={22} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
