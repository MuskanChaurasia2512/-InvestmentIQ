import React, { useState } from 'react';
import { Mail, Lock, User, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Strict Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email format.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const payload = isLogin ? { email: formData.email.trim(), password: formData.password } : formData;
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Requirement 7: Return success message after login
      alert(isLogin ? "Success: " + res.data.msg : "Account Created Successfully!");
      
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      // Requirement 10: Show error if email not found
      setError(err.response?.data?.msg || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '400px', padding: '3rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'var(--primary)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <TrendingUp size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', margin: 0 }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            {isLogin ? 'Enter your details to access your portfolio' : 'Start tracking your investments today'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid var(--danger)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            color: 'var(--danger)', 
            fontSize: '0.875rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Theo" 
                  required 
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
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
          )}
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: 'var(--glass)', 
              border: '1px solid var(--border)', 
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}>
              <Mail size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="theo@example.com" 
                required 
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
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
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: 'var(--glass)', 
              border: '1px solid var(--border)', 
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}>
              <Lock size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="•••••" 
                required 
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
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
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              marginTop: '0.5rem', 
              opacity: loading ? 0.7 : 1,
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
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '6px', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
