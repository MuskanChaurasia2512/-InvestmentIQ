import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import axios from 'axios';

const InsightCard = ({ type, title, message, color }) => {
  let Icon = Lightbulb;
  if (type === 'risk') Icon = AlertTriangle;
  else if (type === 'performance') Icon = TrendingUp;
  else if (type === 'health') Icon = ShieldCheck;

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem', 
      padding: '1rem', 
      background: 'rgba(255, 255, 255, 0.03)', 
      borderRadius: '12px',
      borderLeft: `4px solid ${color}`,
      marginBottom: '1rem',
      width: '100%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '10px', 
        background: `${color}15`, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0
      }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9375rem', marginBottom: '4px', fontWeight: '600' }}>{title}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{message}</p>
      </div>
    </div>
  );
};

const AISuggestions = ({ portfolio, token }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAISuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/ai/suggestions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInsights(response.data.insights || []);
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        // Fallback error insight
        setInsights([{
          type: 'risk',
          title: 'Connection Issue',
          message: 'Unable to connect to the AI prediction engine at this time.',
          color: 'var(--danger)'
        }]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAISuggestions();
    }
  }, [portfolio, token]); // Re-fetch when portfolio changes so it gives fresh advice

  return (
    <div className="glass-card" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-center" style={{ gap: '8px' }}>
          <div style={{ color: 'var(--primary)' }}>
            <Lightbulb size={20} className={loading ? "" : "pulse"} />
          </div>
          <h3>AI Insights</h3>
        </div>
        {loading && (
           <Activity size={16} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
        )}
      </div>
      
      {!loading && insights.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No new insights available right now. Keep trading to train the AI.
        </p>
      ) : (
        <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
          {insights.map((insight, idx) => (
            <InsightCard key={idx} {...insight} />
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 
          0% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(1.1); opacity: 0.7; } 
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
};

export default AISuggestions;
