import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Chatbot from './components/Chatbot';
import StockTicker from './components/StockTicker';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Goals = lazy(() => import('./pages/Goals'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const News = lazy(() => import('./pages/News'));
const Auth = lazy(() => import('./pages/Auth'));

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`app-wrapper ${theme === 'light' ? 'light-mode' : ''}`} style={{ background: 'var(--bg-dark)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <StockTicker />
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        <div className="main-content" style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
          <Topbar onLogout={handleLogout} user={user} setActiveTab={setActiveTab} />
          <main className="app-main-content" style={{ marginLeft: '80px', padding: '1.5rem 2rem', transition: 'all 0.3s ease' }}>
          <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-muted)' }}>Loading...</div>}>
            {activeTab === 'dashboard' && <Dashboard token={token} setActiveTab={setActiveTab} />}
            {activeTab === 'news' && <News token={token} />}
            {activeTab === 'portfolio' && <Portfolio token={token} />}
            {activeTab === 'analytics' && <Analytics token={token} />}
            {activeTab === 'goals' && <Goals token={token} />}
            {activeTab === 'transactions' && <Transactions token={token} />}
            {activeTab === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
            {activeTab === 'profile' && <Profile onLogout={handleLogout} user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'user-profile' && <UserProfile onLogout={handleLogout} user={user} />}
          </Suspense>
            {activeTab === 'detailed-profile' && <DetailedProfile onLogout={handleLogout} user={user} />}
          </main>
        </div>
      </div>
      <Chatbot token={token} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
        }
      `}} />
    </div>
  );
}

export default App;

