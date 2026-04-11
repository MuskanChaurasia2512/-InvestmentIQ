import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, PieChart, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Analytics = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('All'); // 'All', 'Year', 'Month', 'Week'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions for analytics', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // Filter Data based on selected time frame
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.transactionDate);
      if (timeFilter === 'Week') {
        const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
        return tDate >= weekAgo;
      }
      if (timeFilter === 'Month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === 'Year') {
        return tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, timeFilter]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalFees = 0;
    let totalRealized = 0; // Money from sells

    const stocksOwned = {}; // Keep track of holdings

    filteredTransactions.forEach(t => {
      const price = t.executionPrice || t.buyPrice || 0;
      const tValue = (price * t.quantity);
      totalFees += (t.fees || 0);

      if (!stocksOwned[t.stockSymbol]) {
        stocksOwned[t.stockSymbol] = { qty: 0, invested: 0, currentPrice: 0, sector: t.sector };
      }

      if (t.type === 'buy') {
        stocksOwned[t.stockSymbol].qty += t.quantity;
        stocksOwned[t.stockSymbol].invested += tValue;
        stocksOwned[t.stockSymbol].currentPrice = t.currentPrice;
      } else if (t.type === 'sell') {
        totalRealized += tValue;
        
        // Very basic FIFO approximation for demo purposes
        if (stocksOwned[t.stockSymbol].qty >= t.quantity) {
          const avgBuyPrice = stocksOwned[t.stockSymbol].invested / stocksOwned[t.stockSymbol].qty;
          stocksOwned[t.stockSymbol].qty -= t.quantity;
          stocksOwned[t.stockSymbol].invested -= (avgBuyPrice * t.quantity);
        }
      }
    });

    Object.values(stocksOwned).forEach(s => {
      if (s.qty > 0) {
        totalInvested += s.invested;
        totalCurrentValue += (s.qty * s.currentPrice);
      }
    });

    const unrealizedPnL = totalCurrentValue - totalInvested;
    const unrealizedPercent = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;
    
    // Basic risk analysis (simulated via diversification)
    const activeSectors = new Set(Object.values(stocksOwned).filter(s => s.qty > 0).map(s => s.sector));
    const riskLevel = activeSectors.size >= 4 ? 'Low' : activeSectors.size >= 2 ? 'Moderate' : 'High';

    return { totalInvested, totalCurrentValue, unrealizedPnL, unrealizedPercent, totalFees, totalRealized, riskLevel, activeSectors: activeSectors.size };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--primary)' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="analytics" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Trading Analytics</h2>

        {/* Time Filters */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.25rem' }}>
          {['Week', 'Month', 'Year', 'All'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              style={{
                background: timeFilter === tf ? 'var(--primary)' : 'transparent',
                color: timeFilter === tf ? 'white' : 'var(--text-muted)',
                border: 'none', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontWeight: timeFilter === tf ? '600' : '500', fontSize: '0.85rem', transition: 'all 0.2s',
              }}
            >
              {tf === 'All' ? 'All-Time' : `This ${tf}`}
            </button>
          ))}
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid-cols grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: metrics.unrealizedPnL >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {metrics.unrealizedPnL >= 0 ? <TrendingUp size={20} color="#10b981" /> : <TrendingDown size={20} color="#ef4444" />}
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: metrics.unrealizedPnL >= 0 ? '#10b981' : '#ef4444' }}>
                {metrics.unrealizedPnL >= 0 ? '+' : ''}{metrics.unrealizedPercent.toFixed(2)}%
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unrealized Return</p>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{metrics.unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active Portfolio PnL</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#6366f1" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>₹{metrics.totalRealized.toLocaleString()}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Selling Output</p>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{metrics.totalFees.toLocaleString()}</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Total Brokerage Fees Paid</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>Risk: {metrics.riskLevel}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Volatility Metric</p>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{filteredTransactions.length}</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Trades in this period</p>
        </div>
      </div>

      <div className="grid-cols grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Activity size={20} color="var(--primary)" />
             Trade Activity Summary
          </h3>
          {filteredTransactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No trading activity in this period.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
                 <span>Total Invested (Held)</span>
                 <strong style={{ color: 'white' }}>₹{metrics.totalInvested.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
                 <span>Current MTM Value</span>
                 <strong style={{ color: 'var(--accent)' }}>₹{metrics.totalCurrentValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
                 <span>Total Assets Held</span>
                 <strong style={{ color: 'white' }}>{metrics.activeSectors} Industry Sectors</strong>
               </div>
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="var(--warning)" />
            Portfolio Health
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Your calculated PnL reflects only the assets currently held. Your brokerage and fees are tracked separately and deducted incrementally. Let AI analyze your trades to optimize returns.
          </p>

          <div style={{
            padding: '1.5rem', 
            background: metrics.unrealizedPnL >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
            borderRadius: '12px',
            border: `1px solid ${metrics.unrealizedPnL >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: metrics.unrealizedPnL >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
               {metrics.unrealizedPnL >= 0 ? 'Profitable PnL' : 'Negative PnL'}
            </h4>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {metrics.unrealizedPnL > 0 
                ? 'Great job keeping your holdings in the positive region. Review AI suggestions to find exit opportunities.'
                : 'Market conditions or specific sectors have dragged down your net profit. Hold off on panic-selling down assets unless fundamental data implies a chronic reversal.'
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
