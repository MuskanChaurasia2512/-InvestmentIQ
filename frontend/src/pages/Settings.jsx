import React, { useState } from 'react';
import { 
  TrendingUp, 
  Bell, 
  Shield, 
  Monitor, 
  MonitorSmartphone,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Globe,
  DollarSign,
  Laptop
} from 'lucide-react';

const Settings = ({ theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState('trading');
  const [showPassword, setShowPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // State variables for various settings
  const [orderType, setOrderType] = useState('MIS');
  const [chartType, setChartType] = useState('Candlestick');
  const [oneClickExecution, setOneClickExecution] = useState(false);
  
  const [notifications, setNotifications] = useState({
    orderExecution: true,
    priceAlerts: true,
    dailyMtm: false,
    promotional: false
  });

  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('English');

  const handleSave = () => {
    setSaveMessage('Settings saved successfully ✓');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const settingsSections = [
    { id: 'trading', icon: TrendingUp, label: 'Trading Preferences' },
    { id: 'notifications', icon: Bell, label: 'Alerts & Notifications' },
    { id: 'security', icon: Shield, label: 'Security & Access' },
    { id: 'display', icon: Monitor, label: 'Display & Localization' }
  ];

  const ToggleSwitch = ({ checked, onChange, danger }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? (danger ? '#ef4444' : 'var(--primary)') : 'var(--glass-hover)', transition: '.4s', borderRadius: '24px' }}>
        <span style={{ position: 'absolute', height: '16px', width: '16px', left: checked ? '24px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></span>
      </span>
    </label>
  );

  const renderTradingSection = () => (
    <div style={{ display: 'grid', gap: '1.5rem', animation: 'fadeInUp 0.4s ease-out forwards' }}>
      <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Trading Defaults</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>Default Order Type</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setOrderType('MIS')}
                style={{ flex: 1, padding: '0.75rem', background: orderType === 'MIS' ? 'var(--primary)' : 'rgba(255,255,255,0.02)', color: orderType === 'MIS' ? 'white' : 'var(--text-muted)', border: orderType === 'MIS' ? '1px solid var(--primary)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}
              >Intraday (MIS)</button>
              <button 
                onClick={() => setOrderType('CNC')}
                style={{ flex: 1, padding: '0.75rem', background: orderType === 'CNC' ? 'var(--primary)' : 'rgba(255,255,255,0.02)', color: orderType === 'CNC' ? 'white' : 'var(--text-muted)', border: orderType === 'CNC' ? '1px solid var(--primary)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}
              >Delivery (CNC)</button>
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>Default Chart Type</label>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: '#1e293b', outline: 'none', cursor: 'pointer', color: 'white' }}
            >
              <option value="Candlestick" style={{ background: '#1e293b', color: 'white' }}>Candlestick</option>
              <option value="Line" style={{ background: '#1e293b', color: 'white' }}>Line / Area</option>
              <option value="HeikinAshi" style={{ background: '#1e293b', color: 'white' }}>Heikin-Ashi</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'white', fontWeight: '500' }}>1-Click Order Execution</span>
                {oneClickExecution && <AlertTriangle size={16} color="#ef4444" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Skip confirmation popups for lightning fast trades. High Risk.</p>
            </div>
            <ToggleSwitch checked={oneClickExecution} onChange={(e) => setOneClickExecution(e.target.checked)} danger />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div style={{ display: 'grid', gap: '1.5rem', animation: 'fadeInUp 0.4s ease-out forwards' }}>
      <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Alerts & Notifications</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ color: 'white', fontWeight: '500' }}>Order Execution Alerts</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Get instant push/email alerts when an order executes.</p>
            </div>
            <ToggleSwitch checked={notifications.orderExecution} onChange={(e) => setNotifications({...notifications, orderExecution: e.target.checked})} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ color: 'white', fontWeight: '500' }}>Price Target Alerts</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Notify me when a stock hits my set target.</p>
            </div>
            <ToggleSwitch checked={notifications.priceAlerts} onChange={(e) => setNotifications({...notifications, priceAlerts: e.target.checked})} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ color: 'white', fontWeight: '500' }}>Daily MTM Summary</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Email me a daily summary of my Profit & Loss.</p>
            </div>
            <ToggleSwitch checked={notifications.dailyMtm} onChange={(e) => setNotifications({...notifications, dailyMtm: e.target.checked})} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div style={{ display: 'grid', gap: '1.5rem', animation: 'fadeInUp 0.4s ease-out forwards' }}>
      <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Password Update</h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }} />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>New Password</label>
              <input type="password" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input type="password" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }} />
            </div>
          </div>
          <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', width: 'fit-content', marginTop: '0.5rem' }}>Change Password</button>
        </div>
      </div>

      <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Active Sessions</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Laptop size={24} color="var(--text-muted)" />
              <div>
                <p style={{ color: 'white', fontWeight: '500', margin: '0 0 0.25rem' }}>Windows 11 • Chrome Browser</p>
                <p style={{ color: '#10b981', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Active Now</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '4px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MonitorSmartphone size={24} color="var(--text-muted)" />
              <div>
                <p style={{ color: 'white', fontWeight: '500', margin: '0 0 0.25rem' }}>iPhone 15 Pro • App</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Last active: 2 hours ago</p>
              </div>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplaySection = () => (
    <div style={{ display: 'grid', gap: '1.5rem', animation: 'fadeInUp 0.4s ease-out forwards' }}>
      <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>Appearance & Region</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ color: 'white', fontWeight: '500' }}>Dark Mode</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Use dark theme across the trading terminal.</p>
            </div>
            <ToggleSwitch checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}><Globe size={14} style={{ display: 'inline', marginRight: '5px' }} /> Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: '#1e293b', outline: 'none', cursor: 'pointer', color: 'white' }}>
                <option value="English" style={{ background: '#1e293b', color: 'white' }}>English</option>
                <option value="Hindi" style={{ background: '#1e293b', color: 'white' }}>Hindi</option>
                <option value="Gujarati" style={{ background: '#1e293b', color: 'white' }}>Gujarati</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}><DollarSign size={14} style={{ display: 'inline', marginRight: '5px' }} /> Default Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.875rem', background: '#1e293b', outline: 'none', cursor: 'pointer', color: 'white' }}>
                <option value="INR" style={{ background: '#1e293b', color: 'white' }}>INR (₹)</option>
                <option value="USD" style={{ background: '#1e293b', color: 'white' }}>USD ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'trading': return renderTradingSection();
      case 'notifications': return renderNotificationsSection();
      case 'security': return renderSecuritySection();
      case 'display': return renderDisplaySection();
      default: return null;
    }
  };

  return (
    <div className="settings" style={{ padding: '2rem', animation: 'fadeInUp 0.5s ease-out forwards' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Terminal Settings</h1>
      </div>

      <div className="grid-responsive-sidebar-content" style={{ gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--border)' }}>
            <nav style={{ display: 'grid', gap: '0.5rem' }}>
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                    background: activeSection === section.id ? 'var(--primary)' : 'transparent',
                    color: activeSection === section.id ? 'white' : 'var(--text-muted)',
                    border: activeSection === section.id ? 'none' : '1px solid transparent'
                  }}
                  onMouseOver={(e) => { if (activeSection !== section.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseOut={(e) => { if (activeSection !== section.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <section.icon size={20} />
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{section.label}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
