import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import DetailedProfile from './pages/DetailedProfile';
import EditProfile from './pages/EditProfile';
import Auth from './pages/Auth';

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

  const handleLogin = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Topbar onLogout={handleLogout} user={user} setActiveTab={setActiveTab} />
        <main style={{ marginLeft: '280px', padding: '1rem 2rem' }}>
          {activeTab === 'dashboard' && <Dashboard token={token} />}
          {activeTab === 'portfolio' && <Portfolio token={token} />}
          {activeTab === 'analytics' && <Analytics token={token} />}
          {activeTab === 'goals' && <Goals token={token} />}
          {activeTab === 'transactions' && <Transactions token={token} />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'profile' && <Profile onLogout={handleLogout} user={user} setActiveTab={setActiveTab} />}
          {activeTab === 'user-profile' && <UserProfile onLogout={handleLogout} user={user} />}
          {activeTab === 'detailed-profile' && <DetailedProfile onLogout={handleLogout} user={user} />}
          {activeTab === 'edit-profile' && (
            <EditProfile
              user={user}
              onBack={() => setActiveTab('profile')}
              onSave={handleProfileSave}
            />
          )}
        </main>
      </div>
      
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

