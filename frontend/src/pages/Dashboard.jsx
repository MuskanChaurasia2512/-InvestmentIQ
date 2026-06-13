import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Filter, Plus, PlusCircle, BarChart2, TrendingUp, TrendingDown, DollarSign, PieChart, Activity, X, Briefcase, Zap } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import TransactionForm from '../components/TransactionForm';
import AISuggestions from '../components/AISuggestions';
import { usePortfolio } from '../hooks/usePortfolio';
import { GrowthLineChart } from '../components/ChartComponents';

const Dashboard = ({ token, setActiveTab }) => {
  const { transactions, addTransaction, calculateStats } = usePortfolio(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoldingsModalOpen, setIsHoldingsModalOpen] = useState(false);
  const [graphPeriod, setGraphPeriod] = useState('1M');
  const [performanceData, setPerformanceData] = useState([]);
  const [showMovers, setShowMovers] = useState(false);
  const [movers, setMovers] = useState([]);
  const [moversLoading, setMoversLoading] = useState(false);

  const stats = calculateStats();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolio/growth?period=${graphPeriod}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerformanceData(res.data);
      } catch (err) {
        console.error('Error fetching performance', err);
      }
    };
    if (token) fetchPerformance();
  }, [graphPeriod, token, transactions]);

  // Growth style stat cards
  const growthStats = [
    {
      title: 'Total Investment',
      value: stats.totalInvestment,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: '#6366f1',
      subtitle: 'Amount invested',
      detailTab: 'portfolio'
    },
    {
      title: 'Current Value',
      value: stats.currentValue,
      change: '+20.5%',
      isPositive: true,
      icon: TrendingUp,
      color: '#10b981',
      subtitle: 'Market value today',
      detailTab: 'portfolio'
    },
    {
      title: 'Total Returns',
      value: stats.profitLoss,
      change: stats.plPercentage,
      isProfitable: stats.isProfitable,
      icon: Activity,
      color: '#f59e0b',
      subtitle: 'Profit/Loss amount',
      detailTab: 'analytics'
    },
    {
      title: 'Day Change',
      value: '₹2,150',
      change: '+0.42%',
      isPositive: true,
      icon: PieChart,
      color: '#f43f5e',
      subtitle: "Today's change",
      detailTab: 'analytics'
    }
  ];

  // Fetch market movers (top NSE stocks by price change)
  const fetchMovers = async () => {
    setMoversLoading(true);
    const symbols = [
      { symbol: 'RELIANCE', name: 'Reliance' },
      { symbol: 'TCS', name: 'TCS' },
      { symbol: 'INFY', name: 'Infosys' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'SBIN', name: 'SBI' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank' },
      { symbol: 'WIPRO', name: 'Wipro' },
      { symbol: 'BHARTIARTL', name: 'Airtel' },
      { symbol: 'MARUTI', name: 'Maruti' },
      { symbol: 'ITC', name: 'ITC' },
    ];
    try {
      const results = await Promise.all(
        symbols.map(s =>
          fetch(`http://localhost:5000/api/stock-price/${s.symbol}`)
            .then(r => r.json())
            .then(d => ({ ...s, change: parseFloat(d.changePercent), price: d.currentPrice, isUp: parseFloat(d.changePercent) >= 0 }))
            .catch(() => null)
        )
      );
      const valid = results.filter(Boolean).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
      setMovers(valid);
    } catch (e) {
      console.error(e);
    } finally {
      setMoversLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Market Movers Modal */}
      {showMovers && (
        <div onClick={() => setShowMovers(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '1.75rem', width: '420px', maxWidth: '95vw',
            maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>📈 Market Movers</h3>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>Top NSE stocks by % change</p>
              </div>
              <button onClick={() => setShowMovers(false)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={16} />
              </button>
            </div>
            {moversLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Fetching live data...</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {movers.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${m.isUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: m.isUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: '700',
                        color: m.isUp ? '#10b981' : '#ef4444'
                      }}>{i + 1}</div>
                      <div>
                        <p style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{m.symbol}</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.72rem' }}>{m.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>₹{m.price?.toLocaleString('en-IN')}</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '700', color: m.isUp ? '#10b981' : '#ef4444' }}>
                        {m.isUp ? '+' : ''}{m.change?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Links Menu */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '0.75rem 0 1.5rem 0',
        width: '100%',
        gap: '1rem'
      }}>
        {[
          { icon: Briefcase, label: 'Portfolio', color: '#6366f1', action: () => setActiveTab('portfolio') },
          { icon: Activity, label: 'Analytics', color: '#10b981', action: () => setActiveTab('analytics') },
          { icon: Zap, label: 'Transactions', color: '#f59e0b', action: () => setActiveTab('transactions') },
          { icon: PlusCircle, label: 'Add Trade', color: '#22d3ee', action: () => setIsModalOpen(true) },
          { icon: PieChart, label: 'Goals', color: '#f43f5e', action: () => setActiveTab('goals') },
          { icon: BarChart2, label: 'Market Movers', color: '#a78bfa', action: () => { fetchMovers(); setShowMovers(true); } },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            title={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${item.color}50`,
              transition: 'all 0.3s ease',
              color: item.color
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = item.color + '20';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${item.color}35`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <item.icon size={18} />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: 0 }}>Trade Ideas ⚡</h2>

      </div>

      {/* Main Performance Chart */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>Portfolio Performance</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: stats.isProfitable ? 'var(--accent)' : 'var(--danger)' }}>
                {stats.isProfitable ? '+' : ''}{stats.plPercentage}%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>vs Nifty 50</span>
            </div>
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
            {['1D', '1W', '1M', '1Y'].map(p => (
              <button
                key={p}
                onClick={() => setGraphPeriod(p)}
                style={{
                  background: graphPeriod === p ? 'var(--primary)' : 'transparent',
                  color: graphPeriod === p ? 'white' : 'var(--text-muted)',
                  border: 'none', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 'bold', transition: 'all 0.2s'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '350px', width: '100%' }}>
          {performanceData.length > 0 ? (
            <GrowthLineChart data={performanceData} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Activity size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '10px' }} />
              <span>Analyzing market data...</span>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary Cards (Trade Idea Style) */}
      <div className="grid-responsive-4" style={{ marginBottom: '3rem' }}>
        {growthStats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {/* Tag Badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 158, 11, 0.1)',
              color: '#f59e0b',
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '0.7rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              {stat.title.split(' ')[0]}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: `${stat.color}20`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <h4 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: '700' }}>{stat.title}</h4>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.75rem' }}>{stat.subtitle}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: 0 }}>
                  {typeof stat.value === 'string' ? stat.value : `Rs ${stat.value.toLocaleString()}`}
                </h3>
              </div>
              <div style={{
                background: stat.isPositive || stat.isProfitable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: stat.isPositive || stat.isProfitable ? 'var(--accent)' : 'var(--danger)',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {stat.isPositive || stat.isProfitable ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 2m ago</span>
              <button
                onClick={() => setActiveTab(stat.detailTab)}
                onMouseOver={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1)'; }}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Grid */}
      <div className="grid-responsive-sidebar-content" style={{ marginBottom: '2rem' }}>
        {/* Left: Portfolio Growth Chart */}
        <div style={{
          background: 'var(--glass)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>Portfolio Performance</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: stats.isProfitable ? 'var(--accent)' : 'var(--danger)' }}>
                  {stats.isProfitable ? '+' : ''}{stats.plPercentage}%
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>vs Nifty 50</span>
              </div>
            </div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
              {['1D', '1W', '1M', '1Y'].map(p => (
                <button
                  key={p}
                  onClick={() => setGraphPeriod(p)}
                  style={{
                    background: graphPeriod === p ? 'var(--primary)' : 'transparent',
                    color: graphPeriod === p ? 'white' : 'var(--text-muted)',
                    border: 'none', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 'bold', transition: 'all 0.2s'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '350px', width: '100%' }}>
            {performanceData.length > 0 ? (
              <GrowthLineChart data={performanceData} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                <Activity size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '10px' }} />
                <span>Analyzing market data...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Holdings Table */}
        <div style={{
          background: 'var(--glass)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>Holdings</h3>
          </div>

          {transactions.length > 0 ? (
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Stock</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Qty</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Avg. Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 3).map((stock) => {
                    return (
                      <tr key={stock.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: 'var(--glass-hover)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              color: 'white'
                            }}>
                              {stock.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'white' }}>{stock.symbol}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.companyName}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>{stock.quantity}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>Rs {stock.buyPrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {transactions.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <button
                    onClick={() => setIsHoldingsModalOpen(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.6rem 1rem',
                      color: 'var(--primary)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      textAlign: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'var(--primary)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--glass-hover)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <TrendingUp size={24} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>No holdings yet</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Start investing to build your portfolio</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                style={{ borderRadius: '8px' }}
              >
                Add First Investment
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar - AI Suggestions */}
        <div>
          <AISuggestions portfolio={transactions} token={token} />
        </div>
      </div>

      {/* Transaction Form Modal */}
      {isModalOpen && (
        <TransactionForm
          onAdd={(newTransaction) => {
            addTransaction(newTransaction);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          token={token}
        />
      )}

      {/* Holdings Details Modal — rendered via Portal directly on document.body */}
      {isHoldingsModalOpen && ReactDOM.createPortal(
        <div
          onClick={() => setIsHoldingsModalOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0B0E14',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '20px',
              padding: '1.75rem 2rem',
              width: '100%',
              maxWidth: '960px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.1)',
              animation: 'slideUp 0.25s ease'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💼 Detailed Holdings
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                  {transactions.length} stock{transactions.length !== 1 ? 's' : ''} in your portfolio
                </p>
              </div>
              <button
                onClick={() => setIsHoldingsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#f43f5e'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Stock', 'Qty', 'Avg. Cost', 'LTP', 'Investment', 'Current Value', 'P&L', 'Returns'].map((h, i) => (
                      <th key={h} style={{ padding: '0.85rem 1rem', textAlign: i === 0 ? 'left' : 'right', color: '#64748b', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((stock, idx) => {
                    const investment = stock.quantity * stock.buyPrice;
                    const currentValue = stock.quantity * stock.currentPrice;
                    const pl = currentValue - investment;
                    const returns = ((pl / investment) * 100).toFixed(2);
                    const isProfitable = pl >= 0;
                    return (
                      <tr
                        key={stock.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: `hsl(${(idx * 47) % 360}, 60%, 25%)`,
                              border: `1px solid hsl(${(idx * 47) % 360}, 60%, 40%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.72rem', fontWeight: '800',
                              color: `hsl(${(idx * 47) % 360}, 80%, 75%)`
                            }}>
                              {stock.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <p style={{ fontWeight: '700', fontSize: '0.88rem', color: 'white', margin: 0 }}>{stock.symbol}</p>
                              <p style={{ fontSize: '0.73rem', color: '#64748b', margin: 0 }}>{stock.companyName}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>{stock.quantity}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: '#94a3b8' }}>₹{stock.buyPrice.toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>₹{stock.currentPrice.toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: '#94a3b8' }}>₹{investment.toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>₹{currentValue.toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: isProfitable ? '#10b981' : '#f43f5e', fontWeight: '700' }}>
                          {isProfitable ? '+' : ''}₹{Math.abs(pl).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            background: isProfitable ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                            color: isProfitable ? '#10b981' : '#f43f5e',
                            border: `1px solid ${isProfitable ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`
                          }}>
                            {isProfitable ? '+' : ''}{returns}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
              {(() => {
                const totalInvested = transactions.reduce((s, t) => s + t.quantity * t.buyPrice, 0);
                const totalCurrent = transactions.reduce((s, t) => s + t.quantity * t.currentPrice, 0);
                const totalPL = totalCurrent - totalInvested;
                const totalReturn = totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0;
                const isProfit = totalPL >= 0;
                return [
                  { label: 'Total Invested', value: `₹${totalInvested.toLocaleString()}`, color: 'white' },
                  { label: 'Current Value', value: `₹${totalCurrent.toLocaleString()}`, color: 'white' },
                  { label: 'Total P&L', value: `${isProfit ? '+' : ''}₹${Math.abs(totalPL).toLocaleString()}`, color: isProfit ? '#10b981' : '#f43f5e' },
                  { label: 'Total Returns', value: `${isProfit ? '+' : ''}${totalReturn}%`, color: isProfit ? '#10b981' : '#f43f5e' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                    <p style={{ color, fontSize: '1rem', margin: 0, fontWeight: 800 }}>{value}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Dashboard;
