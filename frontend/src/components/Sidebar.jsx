import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut,
  Target
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar glass-card" style={{ 
      height: 'calc(100vh - 2rem)', 
      width: '240px', 
      margin: '1rem',
      position: 'fixed',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div className="logo flex-center" style={{ padding: '2rem 0', gap: '0.5rem' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--primary)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
        }}>
          <TrendingUp size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SmartInvest</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '0.75rem 1rem',
              margin: '0.5rem 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              background: activeTab === item.id ? 'var(--glass-hover)' : 'transparent',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
              border: activeTab === item.id ? '1px solid var(--border)' : '1px solid transparent'
            }}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ 
          padding: '0.75rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          color: 'var(--danger)',
          cursor: 'pointer'
        }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
