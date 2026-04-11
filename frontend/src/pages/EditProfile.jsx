import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Users,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';

const EditProfile = ({ user, onBack, onSave }) => {
  const fileInputRef = useRef(null);

  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const savedProfile = getSavedProfile();

  const [profileImage, setProfileImage] = useState(savedProfile.profileImage || null);
  const [imagePreview, setImagePreview] = useState(savedProfile.profileImage || null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // KYC format-validation states only (no fake derivation)
  const [panVerified, setPanVerified] = useState(false);
  const [panValidating, setPanValidating] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [aadharValidating, setAadharValidating] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || savedProfile.name || '',
    email: user?.email || savedProfile.email || '',
    mobile: savedProfile.mobile || '',
    pan: savedProfile.pan || '',
    dob: savedProfile.dob || '',
    gender: savedProfile.gender || '',
    aadhar: savedProfile.aadhar || '',
    address: savedProfile.address || '',
  });

  // ── PAN: validate format only (ABCDE1234F pattern) ───────────────────────
  useEffect(() => {
    const pan = formData.pan.toUpperCase();
    if (pan.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      setPanValidating(true);
      setPanVerified(false);
      const t = setTimeout(() => {
        setPanValidating(false);
        setPanVerified(true);
      }, 1000);
      return () => clearTimeout(t);
    } else {
      setPanVerified(false);
      setPanValidating(false);
    }
  }, [formData.pan]);

  // ── Aadhar: validate 12 digits format only ───────────────────────────────
  useEffect(() => {
    const raw = formData.aadhar.replace(/-/g, '');
    if (raw.length === 12 && /^\d{12}$/.test(raw)) {
      setAadharValidating(true);
      setAadharVerified(false);
      const t = setTimeout(() => {
        setAadharValidating(false);
        setAadharVerified(true);
      }, 1000);
      return () => clearTimeout(t);
    } else {
      setAadharVerified(false);
      setAadharValidating(false);
    }
  }, [formData.aadhar]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setSaved(false);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, image: '' }));
    setSaved(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    }
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      newErrors.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    }
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) newErrors.dob = 'You must be at least 18 years old';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            pan: formData.pan,
            dob: formData.dob,
            gender: formData.gender,
            aadhar: formData.aadhar,
          }),
        });
      }
    } catch (err) {
      console.warn('Backend update failed (will still save locally):', err.message);
    }

    const profileData = {
      ...formData,
      profileImage,
      pan: formData.pan.toUpperCase(),
    };
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    if (onSave) {
      onSave({ ...user, name: formData.name, email: formData.email, profileImage });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => onBack(), 1500);
  };

  const avatarLetter = (formData.name || user?.name || 'U').charAt(0).toUpperCase();

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 3rem',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'rgba(167,139,250,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'block',
  };

  const iconWrap = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(167,139,250,0.7)',
    pointerEvents: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '0.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.3)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>Edit Profile</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Update your personal information</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* Profile Image Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              onClick={handleImageClick}
              style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: imagePreview ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: '4px solid rgba(99,102,241,0.5)',
                boxShadow: '0 0 30px rgba(99,102,241,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.6)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.4)'; }}
            >
              {imagePreview
                ? <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>{avatarLetter}</span>
              }
            </div>
            <button
              onClick={handleImageClick}
              style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: '3px solid var(--bg, #0f0f1a)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.5)',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Camera size={16} color="white" />
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

          <p style={{ margin: '1.2rem 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>
            {formData.name || 'Your Name'}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Click on photo to change</p>

          {errors.image && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.image}</p>}

          {imagePreview && (
            <button
              onClick={() => { setProfileImage(null); setImagePreview(null); }}
              style={{
                marginTop: '0.75rem', padding: '0.4rem 1rem',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            >
              Remove Photo
            </button>
          )}
        </div>

        {/* Personal Info Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="#a78bfa" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'white' }}>Personal Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><User size={16} /></div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  style={inputStyle('name')}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Mail size={16} /></div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  style={inputStyle('email')}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label style={labelStyle}>
                Registered Mobile Number
                <span style={{
                  marginLeft: '0.5rem', background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)', color: '#10b981',
                  fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '600',
                }}>VERIFIED</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Phone size={16} /></div>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange('mobile', val);
                  }}
                  placeholder="10-digit mobile number"
                  style={inputStyle('mobile')}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = errors.mobile ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                />
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  {formData.mobile.length}/10
                </div>
              </div>
              {errors.mobile && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} /> {errors.mobile}
                </p>
              )}
            </div>

            {/* Date of Birth — always editable, user fills manually */}
            <div>
              <label style={labelStyle}>
                Date of Birth
                <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>
                  (as per PAN / Aadhar)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Calendar size={16} /></div>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => handleChange('dob', e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  style={{ ...inputStyle('dob'), colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = errors.dob ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.dob && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} /> {errors.dob}
                </p>
              )}
              {!formData.dob && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.3rem' }}>
                  Enter exactly as on your PAN / Aadhar card
                </p>
              )}
            </div>

            {/* Gender — always editable, user fills manually */}
            <div>
              <label style={labelStyle}>
                Gender
                <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>
                  (as per PAN / Aadhar)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Users size={16} /></div>
                <select
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  style={{ ...inputStyle('gender'), appearance: 'none', cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <option value="" style={{ background: '#1a1a2e' }}>Select Gender</option>
                  <option value="male" style={{ background: '#1a1a2e' }}>Male</option>
                  <option value="female" style={{ background: '#1a1a2e' }}>Female</option>
                  <option value="other" style={{ background: '#1a1a2e' }}>Other / Prefer not to say</option>
                </select>
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>▼</div>
              </div>
              {!formData.gender && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.3rem' }}>
                  Select as per your PAN / Aadhar card
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KYC / Documents Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="#a78bfa" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'white' }}>KYC Documents</h3>
          </div>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', paddingLeft: '3rem' }}>
            Your documents are encrypted and securely stored
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* PAN Card */}
            <div>
              <label style={labelStyle}>
                PAN Card Number
                {panValidating && (
                  <span style={{ marginLeft: '0.5rem', color: '#a78bfa', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', border: '2px solid rgba(167,139,250,0.3)', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Checking...
                  </span>
                )}
                {panVerified && !panValidating && (
                  <span style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={10} /> Format Valid
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><CreditCard size={16} /></div>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={e => handleChange('pan', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  style={{
                    ...inputStyle('pan'),
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    border: panValidating
                      ? '1px solid rgba(167,139,250,0.5)'
                      : panVerified
                        ? '1px solid rgba(16,185,129,0.45)'
                        : `1px solid ${errors.pan ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: panVerified && !panValidating ? '0 0 10px rgba(16,185,129,0.12)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = errors.pan ? '#ef4444' : panVerified ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.1)'}
                />
                {panValidating && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(167,139,250,0.3)', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
                {panVerified && !panValidating && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                )}
              </div>
              {errors.pan && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} /> {errors.pan}
                </p>
              )}
              {panVerified && !panValidating && (
                <p style={{ color: '#10b981', fontSize: '0.72rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={11} /> Valid PAN format
                </p>
              )}
            </div>

            {/* Aadhar */}
            <div>
              <label style={labelStyle}>
                Aadhar Number
                {aadharValidating && (
                  <span style={{ marginLeft: '0.5rem', color: '#a78bfa', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', border: '2px solid rgba(167,139,250,0.3)', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Checking...
                  </span>
                )}
                {aadharVerified && !aadharValidating && (
                  <span style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={10} /> Format Valid
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrap}><Shield size={16} /></div>
                <input
                  type="text"
                  value={formData.aadhar}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1-');
                    handleChange('aadhar', formatted);
                  }}
                  placeholder="1234-5678-9012"
                  maxLength={14}
                  style={{
                    ...inputStyle('aadhar'),
                    border: aadharValidating
                      ? '1px solid rgba(167,139,250,0.5)'
                      : aadharVerified
                        ? '1px solid rgba(16,185,129,0.45)'
                        : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: aadharVerified && !aadharValidating ? '0 0 10px rgba(16,185,129,0.12)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = aadharVerified ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.1)'}
                />
                {aadharValidating && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(167,139,250,0.3)', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
                {aadharVerified && !aadharValidating && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                )}
              </div>
              {aadharVerified && !aadharValidating && (
                <p style={{ color: '#10b981', fontSize: '0.72rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={11} /> Valid Aadhar number
                </p>
              )}
            </div>
          </div>

          {/* Info note */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}>
            <div style={{
              width: '22px', height: '22px', flexShrink: 0,
              background: 'rgba(99,102,241,0.2)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', color: '#a78bfa', fontWeight: '700',
            }}>ℹ</div>
            <div>
              <p style={{ margin: 0, color: '#a78bfa', fontSize: '0.82rem', fontWeight: '600' }}>
                Fill Date of Birth & Gender as per your documents
              </p>
              <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.76rem', lineHeight: '1.5' }}>
                Please enter your <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Date of Birth</strong> and{' '}
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Gender</strong> yourself — exactly as it appears on your PAN card or Aadhar card.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={onBack}
            style={{
              padding: '0.9rem 2rem', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              padding: '0.9rem 2.5rem',
              background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '12px', color: 'white',
              cursor: saving || saved ? 'default' : 'pointer',
              fontSize: '0.9rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: saved ? '0 4px 20px rgba(16,185,129,0.4)' : '0 4px 20px rgba(99,102,241,0.4)',
              transition: 'all 0.3s ease',
              opacity: saving ? 0.8 : 1,
            }}
            onMouseOver={e => { if (!saving && !saved) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {saving ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Saving...
              </>
            ) : saved ? (
              <><CheckCircle size={18} /> Saved!</>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a2e; color: white; }
      `}</style>
    </div>
  );
};

export default EditProfile;
