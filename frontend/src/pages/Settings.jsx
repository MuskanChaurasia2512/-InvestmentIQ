import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Mail, 
  Lock, 
  Smartphone,
  CreditCard,
  HelpCircle,
  FileText,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  TrendingUp
} from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    priceAlerts: true,
    weeklyReport: false
  });

  const settingsSections = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'appearance', icon: Moon, label: 'Appearance' },
    { id: 'data', icon: FileText, label: 'Data & Privacy' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' }
  ];

  const renderProfileSection = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Personal Information
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Full Name
            </label>
            <input 
              type="text" 
              defaultValue="Demo User"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input 
              type="email" 
              defaultValue="demo@groww.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Phone Number
            </label>
            <input 
              type="tel" 
              placeholder="+91 9876543210"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Investment Preferences
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Risk Tolerance
            </label>
            <select 
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Investment Goal
            </label>
            <select 
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <option value="retirement">Retirement</option>
              <option value="wealth">Wealth Building</option>
              <option value="education">Education</option>
              <option value="shortterm">Short Term</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Notification Preferences
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--text-muted)" />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>Email Notifications</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Receive investment updates via email
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: notifications.email ? 'var(--primary)' : 'var(--glass-hover)',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: "",
                  height: '18px',
                  width: '18px',
                  left: notifications.email ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={18} color="var(--text-muted)" />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>Push Notifications</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Get instant alerts on your device
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: notifications.push ? 'var(--primary)' : 'var(--glass-hover)',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: "",
                  height: '18px',
                  width: '18px',
                  left: notifications.push ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--text-muted)" />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>Price Alerts</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Alert when stocks reach target prices
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={notifications.priceAlerts}
                onChange={(e) => setNotifications({...notifications, priceAlerts: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: notifications.priceAlerts ? 'var(--primary)' : 'var(--glass-hover)',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: "",
                  height: '18px',
                  width: '18px',
                  left: notifications.priceAlerts ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--text-muted)" />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>Weekly Reports</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Get weekly portfolio summary
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={notifications.weeklyReport}
                onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: notifications.weeklyReport ? 'var(--primary)' : 'var(--glass-hover)',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: "",
                  height: '18px',
                  width: '18px',
                  left: notifications.weeklyReport ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Password & Security
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'var(--glass-hover)',
                  outline: 'none',
                  color: 'white'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              New Password
            </label>
            <input 
              type="password"
              placeholder="Enter new password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Confirm New Password
            </label>
            <input 
              type="password"
              placeholder="Confirm new password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
        </div>
        
        <button 
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Update Password
        </button>
      </div>

      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Two-Factor Authentication
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              Enable 2FA for enhanced security
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Add an extra layer of security to your account
            </p>
          </div>
          <button 
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Theme Preferences
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Moon size={18} color="var(--text-muted)" />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>Dark Mode</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Use dark theme across the application
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: darkMode ? 'var(--primary)' : 'var(--glass-hover)',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: "",
                  height: '18px',
                  width: '18px',
                  left: darkMode ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Language & Region
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Language
            </label>
            <select 
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Currency
            </label>
            <select 
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <option value="inr">Indian Rupee (Rs)</option>
              <option value="usd">US Dollar ($)</option>
              <option value="eur">Euro (â?¬)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      default:
        return (
          <div style={{
            background: 'var(--glass)',
            borderRadius: '12px',
            padding: '3rem',
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--glass-hover)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Settings size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
              Coming Soon
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              This section is under development
            </p>
          </div>
        );
    }
  };

  return (
    <div className="settings" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
      {/* Settings Sidebar */}
      <div style={{ position: 'sticky', top: '1rem', height: 'fit-content' }}>
        <div style={{
          background: 'var(--glass)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
            Settings
          </h2>
          <nav style={{ display: 'grid', gap: '0.25rem' }}>
            {settingsSections.map((section) => (
              <div
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  background: activeSection === section.id ? 'var(--glass-hover)' : 'transparent',
                  color: activeSection === section.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: activeSection === section.id ? '1px solid var(--border)' : '1px solid transparent'
                }}
              >
                <section.icon size={18} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{section.label}</span>
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
  );
};

export default Settings;
