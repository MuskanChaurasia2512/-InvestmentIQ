import React, { useState } from 'react';
import { Mail, Lock, User, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
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
    <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-dark)' }}>
      <div className="glass-card" style={{ width: '400px', padding: '3rem' }}>
        <div className="flex-center" style={{ flexDirection: 'column', marginBottom: '2rem', gap: '0.5rem' }}>
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
          <h2 style={{ fontSize: '1.75rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isLogin ? 'Enter your details to access your portfolio' : 'Start tracking your investments today'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid-cols" style={{ gap: '1.25rem' }}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} color="var(--text-muted)" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Theo" required />
              </div>
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} color="var(--text-muted)" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="theo@example.com" 
                required 
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} color="var(--text-muted)" />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '6px', fontWeight: 600 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .input-group label {
          display: block;
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--glass);
          border: 1px solid var(--border);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .input-wrapper:focus-within {
          border-color: var(--primary);
          background: var(--glass-hover);
        }
        .input-wrapper input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
          font-family: inherit;
        }
        .input-wrapper color: var(--text-muted);
      `}} />
    </div>
  );
};

export default Auth;
