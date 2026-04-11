import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Camera, 
  Upload,
  Edit,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';

const UserProfile = ({ onLogout, user }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = () => {
    // Save logic here
    console.log('Saving profile data:', formData);
    console.log('Profile image:', profileImage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      mobile: '',
      pan: '',
      aadhar: '',
      gender: ''
    });
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => window.history.back()}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--primary)',
              boxShadow: '0 0 25px rgba(99,102,241,0.4)'
            }}>
              {!profileImage && (
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0 0 0.5rem' }}>
                {user?.name || 'Demo User'}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
                {user?.email || 'demo@groww.com'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <Edit size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleSave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Profile Image Section */}
        <div style={{
          background: 'var(--glass)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Profile Picture
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid var(--primary)',
              boxShadow: '0 0 30px rgba(99,102,241,0.3)',
              position: 'relative'
            }}>
              {!profileImage && (
                <span style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
              {profileImage && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '30px',
                  height: '30px',
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setProfileImage(null)}
              >
                <X size={16} color="white" />
              </div>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'inline-block',
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
                  disabled={!isEditing}
                />
                <Upload size={18} style={{ marginRight: '0.5rem' }} />
                Upload Photo
              </label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Upload a clear photo of your face. JPG, PNG format. Max size 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{
          background: 'var(--glass)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Personal Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                <User size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                Full Name
              </label>
              <input 
                type="text" 
                value={isEditing ? formData.name : user?.name || ''}
                onChange={(e) => isEditing && handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  color: 'white',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                <Mail size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input 
                type="email" 
                value={isEditing ? formData.email : user?.email || ''}
                onChange={(e) => isEditing && handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  color: 'white',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                <Phone size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                Mobile Number
              </label>
              <input 
                type="tel" 
                value={isEditing ? formData.mobile : ''}
                onChange={(e) => isEditing && handleInputChange('mobile', e.target.value)}
                disabled={!isEditing}
                placeholder="+91 9876543210"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  color: 'white',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Gender
              </label>
              <select 
                value={isEditing ? formData.gender : ''}
                onChange={(e) => isEditing && handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  color: 'white',
                  opacity: isEditing ? 1 : 0.7
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
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            KYC Documents
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                <CreditCard size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                PAN Card Number
              </label>
              <input 
                type="text" 
                value={isEditing ? formData.pan : ''}
                onChange={(e) => isEditing && handleInputChange('pan', e.target.value)}
                disabled={!isEditing}
                placeholder="ABCDE1234F"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  color: 'white',
                  textTransform: 'uppercase',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                <Shield size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                Aadhar Number
              </label>
              <input 
                type="text" 
                value={isEditing ? formData.aadhar : ''}
                onChange={(e) => isEditing && handleInputChange('aadhar', e.target.value)}
                disabled={!isEditing}
                placeholder="1234-5678-9012"
                maxLength={14}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: isEditing ? 'var(--glass-hover)' : 'transparent',
                  outline: 'none',
                  color: 'white',
                  opacity: isEditing ? 1 : 0.7
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
