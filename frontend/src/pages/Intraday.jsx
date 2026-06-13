import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Activity, Shield, AlertTriangle, Play, Pause } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const initialChartData = Array.from({ length: 30 }, (_, i) => ({ time: `10:${i < 10 ? '0' + i : i}`, price: 22450 + Math.random() * 50 }));

const Intraday = () => {
  const [nifty, setNifty] = useState(22500);
  const [bankNifty, setBankNifty] = useState(48200);
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [chartData, setChartData] = useState(initialChartData);
  const [orderType, setOrderType] = useState('MIS'); // MIS or CNC
  const [tradeType, setTradeType] = useState('BUY'); // BUY or SELL
  const [symbol, setSymbol] = useState('NIFTY 23 MAY 22500 CE');
  const [qty, setQty] = useState(50);
  const [price, setPrice] = useState(145.5);
  const [orderMessage, setOrderMessage] = useState(null);

  // Simulate Live Market Data
  useEffect(() => {
    if (!isMarketOpen) return;
    const interval = setInterval(() => {
      setNifty(prev => prev + (Math.random() - 0.5) * 5);
      setBankNifty(prev => prev + (Math.random() - 0.5) * 15);
      
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastPrice = newData[newData.length - 1].price;
        const newTime = new Date();
        newData.push({ 
          time: `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`, 
          price: lastPrice + (Math.random() - 0.5) * 10 
        });
        return newData;
      });
      
      // Add randomness to price input if not touched recently
      setPrice(prev => +(prev + (Math.random() - 0.5) * 2).toFixed(2));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMarketOpen]);

  const handleOrder = () => {
    setOrderMessage({ type: 'success', text: `Order Placed: ${tradeType} ${qty} x ${symbol} @ ${price}` });
    setTimeout(() => setOrderMessage(null), 3000);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap color="#f59e0b" /> Live Terminal
          </h2>
          <button 
            onClick={() => setIsMarketOpen(!isMarketOpen)}
            style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
          >
            {isMarketOpen ? <Pause size={14} /> : <Play size={14} />} {isMarketOpen ? 'Pause' : 'Start'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '140px', background: 'var(--glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>NIFTY</span>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1rem' }}>{nifty.toFixed(2)}</span>
          </div>
          <div style={{ flex: 1, minWidth: '140px', background: 'var(--glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>BANKNIFTY</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1rem' }}>{bankNifty.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid-responsive-sidebar-content">
        {/* Left Column: Chart & Option Chain */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Live Chart */}
          <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" /> NIFTY 50 Live (1T)
            </h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                  <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Option Chain Snippet */}
          <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Options Chain (NIFTY)</h3>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.5rem' }}>Call LTP</th>
                    <th style={{ padding: '0.5rem' }}>Call OI</th>
                    <th style={{ padding: '0.5rem', color: 'white' }}>Strike</th>
                    <th style={{ padding: '0.5rem' }}>Put OI</th>
                    <th style={{ padding: '0.5rem' }}>Put LTP</th>
                  </tr>
                </thead>
                <tbody>
                  {[22400, 22450, 22500, 22550, 22600].map(strike => {
                    const isATM = strike === 22500;
                    return (
                      <tr key={strike} style={{ background: isATM ? 'rgba(255,255,255,0.05)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{((strike * 1.3) % 200).toFixed(1)}</td>
                        <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{((strike * 0.7) % 50).toFixed(1)}L</td>
                        <td style={{ padding: '0.75rem', color: 'white', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)' }}>{strike}</td>
                        <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{((strike * 0.9) % 50).toFixed(1)}L</td>
                        <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: 'bold' }}>{((strike * 2.1) % 200).toFixed(1)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Order Entry & Positions */}
        <div style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}>
          
          {/* Fast Order Panel */}
          <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setTradeType('BUY')}
                style={{ flex: 1, padding: '0.75rem', background: tradeType === 'BUY' ? '#10b981' : 'transparent', color: tradeType === 'BUY' ? 'white' : '#10b981', border: '1px solid #10b981', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
              >BUY</button>
              <button 
                onClick={() => setTradeType('SELL')}
                style={{ flex: 1, padding: '0.75rem', background: tradeType === 'SELL' ? '#ef4444' : 'transparent', color: tradeType === 'SELL' ? 'white' : '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
              >SELL</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <input type="radio" checked={orderType === 'MIS'} onChange={() => setOrderType('MIS')} style={{ marginRight: '5px' }} /> Intraday (MIS)
              </label>
              <label style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <input type="radio" checked={orderType === 'CNC'} onChange={() => setOrderType('CNC')} style={{ marginRight: '5px' }} /> Delivery (CNC)
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Symbol</label>
              <input type="text" value={symbol} onChange={e => setSymbol(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Qty</label>
                <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Price</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Margin Required</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>₹{((price * qty) / (orderType === 'MIS' ? 5 : 1)).toFixed(2)}</span>
            </div>

            <button 
              onClick={handleOrder}
              style={{ width: '100%', padding: '1rem', background: tradeType === 'BUY' ? '#10b981' : '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: tradeType === 'BUY' ? '0 5px 15px rgba(16,185,129,0.3)' : '0 5px 15px rgba(239,68,68,0.3)' }}
            >
              {tradeType} {qty} {symbol}
            </button>
            
            {orderMessage && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem', textAlign: 'center' }}>
                {orderMessage.text}
              </div>
            )}
          </div>

          {/* Live MTM Positions */}
          <div style={{ background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Open Positions</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <div>
                <p style={{ color: 'white', fontWeight: 'bold', margin: '0 0 0.25rem' }}>NIFTY 22500 CE</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>MIS • Qty: 50</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0 0 0.25rem' }}>+₹{((nifty - 22480) * 50).toFixed(2)}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>LTP: {(price + 5).toFixed(2)}</p>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total MTM</span>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>+₹{((nifty - 22480) * 50).toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Intraday;
