import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SYMBOLS = [
  { symbol: 'NIFTY50', label: 'NIFTY 50' },
  { symbol: 'SENSEX', label: 'SENSEX' },
  { symbol: 'RELIANCE', label: 'RELIANCE' },
  { symbol: 'TCS', label: 'TCS' },
  { symbol: 'HDFCBANK', label: 'HDFC BANK' },
  { symbol: 'INFY', label: 'INFOSYS' },
  { symbol: 'SBIN', label: 'SBI' },
  { symbol: 'ICICIBANK', label: 'ICICI BANK' },
  { symbol: 'BHARTIARTL', label: 'AIRTEL' },
  { symbol: 'ITC', label: 'ITC' },
  { symbol: 'MARUTI', label: 'MARUTI' },
  { symbol: 'WIPRO', label: 'WIPRO' },
];

const fetchPrice = async (symbol) => {
  try {
    const res = await fetch(`http://localhost:5000/api/stock-price/${symbol}`);
    const data = await res.json();
    return {
      label: SYMBOLS.find(s => s.symbol === symbol)?.label || symbol,
      price: data.currentPrice,
      change: parseFloat(data.changePercent),
      isUp: parseFloat(data.changePercent) >= 0,
    };
  } catch {
    return null;
  }
};

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      const results = await Promise.all(SYMBOLS.map(s => fetchPrice(s.symbol)));
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setStocks(valid);
        setLoading(false);
      }
    };
    loadAll();
    const interval = setInterval(loadAll, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '—';
    return price.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const tickerItems = [...stocks, ...stocks]; // duplicate for infinite scroll

  return (
    <div style={{
      width: '100%',
      background: '#0B0E14',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      padding: '8px 0',
      position: 'relative',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.82rem',
      fontWeight: '600'
    }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-content {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        .ticker-content:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-right: 2.5rem;
          white-space: nowrap;
          cursor: default;
        }
        .ticker-item:hover .ticker-price {
          color: #a78bfa;
          transition: color 0.2s;
        }
      `}</style>

      {loading ? (
        <div style={{ padding: '0 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
          ⏳ Fetching live market data...
        </div>
      ) : (
        <div className="ticker-content">
          {tickerItems.map((stock, idx) => (
            <div key={idx} className="ticker-item">
              <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stock.label}
              </span>
              <span className="ticker-price" style={{ color: 'white' }}>
                ₹{formatPrice(stock.price)}
              </span>
              <span style={{
                color: stock.isUp ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.78rem'
              }}>
                {stock.isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {stock.isUp ? '+' : ''}{stock.change?.toFixed(2)}%
              </span>
              <span style={{ color: '#1e293b', marginLeft: '1rem' }}>│</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockTicker;
