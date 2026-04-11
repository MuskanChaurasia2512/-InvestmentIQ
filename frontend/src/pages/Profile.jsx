import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  Smartphone, 
  CreditCard, 
  Users, 
  HeadphonesIcon, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Settings,
  Gift,
  LogOut,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  Shield,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

const Profile = ({ onLogout, user, setActiveTab: navigateTo }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Load saved profile image from localStorage
  const getSavedImage = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved).profileImage || null : null;
    } catch { return null; }
  };
  const savedProfileImage = getSavedImage();

  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'User';
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  })();

  const renderOverview = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
          Personal & KYC Details
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</p>
            <p style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>{user?.email || savedProfile?.email || 'demo@groww.com'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Mobile Number</p>
            <p style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>
              {savedProfile?.mobile ? `+91 ${savedProfile.mobile}` : 'Not added'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>PAN Verification</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>
                {savedProfile?.pan ? savedProfile.pan : 'Not verified'}
              </p>
              {savedProfile?.pan && <CheckCircle size={14} color="#10b981" />}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Aadhar Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>
                {savedProfile?.aadhar ? 'Verified' : 'Not verified'}
              </p>
              {savedProfile?.aadhar && <CheckCircle size={14} color="#10b981" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'var(--glass)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <HeadphonesIcon size={28} color="white" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 0.5rem' }}>
            Customer Support
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
            Get help from our support team
          </p>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            Contact Support
          </button>
        </div>

        <div style={{
          background: 'var(--glass)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--danger)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <AlertTriangle size={28} color="white" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 0.5rem' }}>
            Report Issue
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
            Report problems or bugs
          </p>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--danger)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            Report Now
          </button>
        </div>
      </div>

      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { question: 'How do I add money to my wallet?', answer: 'Click on "Add Money" button and select your payment method.' },
            { question: 'How to transfer money using UPI?', answer: 'Go to UPI section and enter recipient details.' },
            { question: 'How do I link a new bank account?', answer: 'Click on "Add New Bank Account" in Bank section.' }
          ].map((faq, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              background: 'var(--glass-hover)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', margin: 0 }}>
                  {faq.question}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>▼</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    pan: '',
    aadhar: '',
    gender: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Profile Image Section */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
          Profile Picture
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--primary)',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)'
          }}>
            {!profileImage && (
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              Upload Photo
            </label>
            
            {profileImage && (
              <button 
                onClick={() => setProfileImage(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
          Personal Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
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
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              Mobile Number
            </label>
            <input 
              type="tel" 
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
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
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Gender
            </label>
            <select 
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
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
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* KYC Documents */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
          KYC Documents
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              PAN Card Number
            </label>
            <input 
              type="text" 
              value={formData.pan}
              onChange={(e) => handleInputChange('pan', e.target.value)}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white',
                textTransform: 'uppercase'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Aadhar Number
            </label>
            <input 
              type="text" 
              value={formData.aadhar}
              onChange={(e) => handleInputChange('aadhar', e.target.value)}
              placeholder="1234-5678-9012"
              maxLength={14}
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
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          style={{
            padding: '1rem 2rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Save Changes
        </button>
        
        <button 
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '1rem 2rem',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--glass-hover)';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--text-muted)';
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="profile-page" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
          {/* Avatar - shows uploaded image or letter */}
          <div
            style={{
              width: '80px',
              height: '80px',
              background: savedProfileImage ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '2rem',
              color: 'white',
              boxShadow: '0 0 25px rgba(99,102,241,0.4)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              overflow: 'hidden',
              border: '3px solid rgba(99,102,241,0.5)',
            }}
            onClick={() => navigateTo && navigateTo('edit-profile')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {savedProfileImage ? (
              <img src={savedProfileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              avatarLetter
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0 0 0.5rem' }}>
              {user?.name || 'Demo User'}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
              {user?.email || 'demo@groww.com'}
            </p>
            <button
              style={{
                padding: '0.5rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '8px',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginTop: '1rem',
                transition: 'all 0.2s ease',
              }}
              onClick={() => navigateTo && navigateTo('edit-profile')}
              onMouseOver={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.35))';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))';
                e.currentTarget.style.color = '#a78bfa';
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '12px',
        padding: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'support', label: 'Support', icon: HeadphonesIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              fontWeight: '500'
            }}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'support' && renderSupport()}
        {activeTab === 'edit-profile' && renderEditProfile()}
      </div>
    </div>
  );
};

export default Profile;
