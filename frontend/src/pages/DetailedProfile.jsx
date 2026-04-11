import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Calendar,
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

const DetailedProfile = ({ onLogout, user }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    pan: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
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
      dob: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      {/* Header with Company Logo */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Company Logo */}
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>
              <Building size={30} color="white" />
            </div>
            
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', margin: '0 0 0.5rem' }}>
                SmartInvest
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
                Investment Portfolio Management
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => window.history.back()}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
              Back
            </button>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <Edit size={18} style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleSave}
                  style={{
                    background: 'var(--primary)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Save size={18} style={{ marginRight: '0.5rem' }} />
                  Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <X size={18} style={{ marginRight: '0.5rem' }} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
          User Profile
        </h2>
        
        {/* Profile Image and Basic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Profile Image */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '200px',
              height: '200px',
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
                <span style={{ fontSize: '5rem', fontWeight: 'bold', color: 'white' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
              {profileImage && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '40px',
                  height: '40px',
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setProfileImage(null)}
              >
                <X size={20} color="white" />
              </div>
              )}
            </div>
            
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
              <Camera size={18} style={{ marginRight: '0.5rem' }} />
              Add Photo
            </label>
          </div>
          
          {/* User Basic Information */}
          <div style={{ display: 'grid', gap: '1rem' }}>
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
                  opacity: isEditing ? 1 : 0.8
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
                  opacity: isEditing ? 1 : 0.8
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
                  opacity: isEditing ? 1 : 0.8
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
                  opacity: isEditing ? 1 : 0.8
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
      </div>

      {/* KYC and Address Section */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
          KYC & Address Details
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* PAN Card */}
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
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
          
          {/* Date of Birth */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
              Date of Birth
            </label>
            <input 
              type="date" 
              value={isEditing ? formData.dob : ''}
              onChange={(e) => isEditing && handleInputChange('dob', e.target.value)}
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
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div style={{
        background: 'var(--glass)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
          Address Information
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <MapPin size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
              Address
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.address : ''}
              onChange={(e) => isEditing && handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="123, Main Street"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: isEditing ? 'var(--glass-hover)' : 'transparent',
                outline: 'none',
                color: 'white',
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <Building size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
              City
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.city : ''}
              onChange={(e) => isEditing && handleInputChange('city', e.target.value)}
              disabled={!isEditing}
              placeholder="Mumbai"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: isEditing ? 'var(--glass-hover)' : 'transparent',
                outline: 'none',
                color: 'white',
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <Globe size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
              State
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.state : ''}
              onChange={(e) => isEditing && handleInputChange('state', e.target.value)}
              disabled={!isEditing}
              placeholder="Maharashtra"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: isEditing ? 'var(--glass-hover)' : 'transparent',
                outline: 'none',
                color: 'white',
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Pincode
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.pincode : ''}
              onChange={(e) => isEditing && handleInputChange('pincode', e.target.value)}
              disabled={!isEditing}
              placeholder="400001"
              maxLength={6}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: isEditing ? 'var(--glass-hover)' : 'transparent',
                outline: 'none',
                color: 'white',
                opacity: isEditing ? 1 : 0.8
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedProfile;
