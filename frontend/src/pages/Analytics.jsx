import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, PieChart, AlertCircle, Calendar, Target, Shield } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { 
  Sparkline, 
  WinRateChart, 
  AnalyticsBarChart, 
  GrowthLineChart,
  SectorDoughnutChart 
} from '../components/ChartComponents';

const Analytics = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txRes, growthRes] = await Promise.all([
          axios.get(`${API_URL}/api/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/portfolio/growth?period=${timeFilter === 'All' ? '1Y' : timeFilter === 'Week' ? '1W' : timeFilter === 'Month' ? '1M' : '1Y'}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setTransactions(txRes.data);
        setGrowthData(growthRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, timeFilter]);

  // Advanced Metrics Calculation
  const metrics = useMemo(() => {
    if (transactions.length === 0) return { winRate: 0, topStock: 'N/A', totalPnL: 0, sharpe: 0 };

    let wins = 0;
    let losses = 0;
    let stockPnL = {};

    transactions.forEach(t => {
      const value = t.quantity * (t.executionPrice || t.buyPrice || 0);
      const currentVal = t.quantity * (t.currentPrice || 0);
      const pnl = t.type === 'buy' ? (currentVal - value) : 0; // Simplified for demo
      
      stockPnL[t.stockSymbol] = (stockPnL[t.stockSymbol] || 0) + pnl;
      
      if (t.type === 'sell') {
         // Logic for win rate usually compares sell price vs buy price
         // For now, let's say a win is any profitable trade
         if (pnl > 0) wins++; else losses++;
      }
    });

    const topStock = Object.entries(stockPnL).sort(([,a],[,b]) => b - a)[0]?.[0] || 'N/A';
    const totalPnL = Object.values(stockPnL).reduce((a, b) => a + b, 0);
    const winRate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 72; // Default for demo

    return { winRate, topStock, totalPnL, sharpe: 1.8 };
  }, [transactions]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: '1rem' }}>
        <Activity style={{ animation: 'spin 1s linear infinite' }} size={48} color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Generating detailed insights...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header with Title & Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'white' }}>Analytics</h1>
            <p className="hide-on-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Advanced algorithmic breakdown of your investment history</p>
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
            {['Week', 'Month', 'Year', 'All'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                style={{
                  background: timeFilter === tf ? 'var(--primary)' : 'transparent',
                  color: timeFilter === tf ? 'white' : 'var(--text-muted)',
                  border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: '600', transition: '0.3s', fontSize: '0.85rem'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Grid - Top Row */}
      <div className="grid-responsive-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Win Rate', value: `${metrics.winRate}%`, icon: Target, color: '#10b981', spark: [30, 45, 32, 60, 75] },
          { label: 'Top Performer', value: metrics.topStock, icon: Shield, color: '#6366f1', spark: [40, 50, 45, 80, 70] },
          { label: 'Sharpe Ratio', value: metrics.sharpe, icon: TrendingUp, color: '#f59e0b', spark: [20, 30, 25, 35, 30] },
          { label: 'Risk Factor', value: 'Low', icon: AlertCircle, color: '#f43f5e', spark: [80, 70, 60, 40, 30] }
        ].map((m, i) => (
          <div key={i} style={{ 
            background: 'var(--glass)', 
            borderRadius: '16px', 
            padding: '1.25rem',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: `${m.color}15`, 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <m.icon size={18} color={m.color} />
              </div>
              <div style={{ width: '60px', height: '24px' }}>
                <Sparkline data={m.spark} color={m.color} />
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{m.label}</p>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid-responsive-sidebar-content" style={{ gap: '2rem', marginBottom: '2rem' }}>
        {/* Profit Trend (Multi-Line Chart) */}
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <Calendar size={20} color="var(--primary)" /> Growth Benchmarking
          </h3>
          <div style={{ height: '300px' }}>
            <GrowthLineChart data={growthData} />
          </div>
        </div>

        {/* Win/Loss Analysis (Gauge) */}
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{ marginBottom: '1.5rem', alignSelf: 'flex-start', color: 'white' }}>Success Probability</h3>
          <WinRateChart rate={metrics.winRate} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem', maxWidth: '200px' }}>
            Your strategy is yielding a high accuracy rate based on {transactions.length} signals.
          </p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid-responsive-2" style={{ marginBottom: '2rem' }}>
        {/* Sectoral Breakdown */}
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Asset Allocation</h3>
          <div style={{ height: '250px' }}>
            <SectorDoughnutChart transactions={transactions} />
          </div>
        </div>

        {/* Monthly Performance Bar */}
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Monthly Yield Distribution</h3>
          <div style={{ height: '250px' }}>
            <AnalyticsBarChart transactions={transactions} />
          </div>
        </div>
      </div>

      {/* AI Suggestion Pulse Card */}
      <div style={{ 
        borderRadius: '16px', 
        marginTop: '2rem', 
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderLeft: '4px solid var(--primary)',
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              padding: '10px', 
              background: 'var(--primary)', 
              borderRadius: '50%', 
              color: 'white',
              animation: 'pulse 2s infinite'
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>AI Insight: Divergent Growth Potential</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '0.9rem' }}>
                Your current exposure to {metrics.topStock} suggests a high correlation with sector volatility. 
                Consider rebalancing 12% of this holding into defensive assets to maintain a Sharpe ratio above 2.0.
              </p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              const btn = e.currentTarget;
              const originalText = btn.innerHTML;
              const originalBg = btn.style.background;
              
              btn.innerHTML = 'Strategy Applied ✓';
              btn.style.background = '#10b981'; // Success green
              
              setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg;
              }, 3000);
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(99,102,241,0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            Apply Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
