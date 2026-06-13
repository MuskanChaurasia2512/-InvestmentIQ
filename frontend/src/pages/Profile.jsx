import React, { useState } from 'react';
import { 
  Users, 
  Headphones, 
  AlertTriangle,
  Settings,
  LogOut,
  CheckCircle,
  User,
  TrendingUp,
  CreditCard,
  Shield,
  Calendar,
  Phone,
  Mail,
  Camera,
  Upload,
  Edit,
  Save,
  X,
  ArrowLeft,
  Building,
  MapPin,
  Globe
} from 'lucide-react';

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
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
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Shield size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', margin: 0 }}>
            Personal & KYC Details
          </h2>
        </div>
        
        <div className="grid-responsive-2" style={{ gap: '1.25rem' }}>
          {/* Email Card */}
          <div className="kyc-card" style={{
            background: 'var(--glass-hover)', padding: '1.25rem', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', cursor: 'default'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</p>
                <p style={{ fontSize: '0.95rem', color: 'white', fontWeight: '600', margin: 0 }}>{user?.email || savedProfile?.email || 'demo@groww.com'}</p>
              </div>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="kyc-card" style={{
            background: 'var(--glass-hover)', padding: '1.25rem', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', cursor: 'default'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} color="#f59e0b" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mobile Number</p>
                <p style={{ fontSize: '0.95rem', color: 'white', fontWeight: '600', margin: 0 }}>
                  {savedProfile?.mobile ? `+91 ${savedProfile.mobile}` : <span style={{ color: '#ef4444' }}>Action Required</span>}
                </p>
              </div>
            </div>
          </div>

          {/* PAN Card */}
          <div className="kyc-card" style={{
            background: 'var(--glass-hover)', padding: '1.25rem', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', cursor: 'default'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} color="#10b981" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PAN Verification</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <p style={{ fontSize: '0.95rem', color: 'white', fontWeight: '600', margin: 0 }}>
                    {savedProfile?.pan ? savedProfile.pan : <span style={{ color: '#ef4444' }}>Not Verified</span>}
                  </p>
                  {savedProfile?.pan && <CheckCircle size={14} color="#10b981" />}
                </div>
              </div>
            </div>
          </div>

          {/* Aadhar Card */}
          <div className="kyc-card" style={{
            background: 'var(--glass-hover)', padding: '1.25rem', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease', cursor: 'default'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} color="#8b5cf6" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aadhar Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <p style={{ fontSize: '0.95rem', color: 'white', fontWeight: '600', margin: 0 }}>
                    {savedProfile?.aadhar ? 'Verified KYC' : <span style={{ color: '#ef4444' }}>Pending</span>}
                  </p>
                  {savedProfile?.aadhar && <CheckCircle size={14} color="#10b981" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => {
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
            background: profileImage ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--primary)',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            overflow: 'hidden'
          }}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
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
          onClick={() => {
            const updatedProfile = { ...formData, profileImage };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            window.dispatchEvent(new Event('profileUpdated'));
            setActiveTab('overview');
          }}
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
    <div className="profile-page" style={{ 
      padding: '2rem',
      animation: 'fadeInUp 0.5s ease-out forwards'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kyc-card {
          position: relative;
          overflow: hidden;
        }
        .kyc-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
          transform: skewX(-25deg);
          transition: all 0.5s;
        }
        }
        .kyc-card:hover::after {
          left: 150%;
        }
      `}</style>

      {/* Main Header / Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
        borderRadius: '24px',
        padding: '2.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          {/* Avatar - shows uploaded image or letter */}
          <div
            style={{
              width: '90px',
              height: '90px',
              background: savedProfileImage ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '2.5rem',
              color: 'white',
              boxShadow: '0 10px 25px rgba(99,102,241,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setActiveTab('edit-profile')}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.8)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            {savedProfileImage ? (
              <img src={savedProfileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              avatarLetter
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'white', margin: '0 0 0.25rem', letterSpacing: '-0.5px' }}>
              {user?.name || 'Demo User'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
              {user?.email || 'demo@groww.com'}
            </p>
            <button
              style={{
                padding: '0.6rem 1.5rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginTop: '1.25rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '1.25rem auto 0'
              }}
              onClick={() => setActiveTab('edit-profile')}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(99,102,241,0.3)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Edit size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'edit-profile' && renderEditProfile()}
      </div>
    </div>
  );
};

export default Profile;
