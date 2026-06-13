import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Activity, RefreshCw, ExternalLink, Clock, Zap, BarChart2, Play, Pause } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MARKET_INDICES = [
  { name: 'NIFTY 50',    base: 24520, color: '#10b981', change: '+0.82%' },
  { name: 'SENSEX',      base: 80650, color: '#6366f1', change: '+0.74%' },
  { name: 'BANK NIFTY',  base: 52340, color: '#f59e0b', change: '-0.21%' },
  { name: 'NIFTY IT',    base: 37210, color: '#22d3ee', change: '+1.15%' },
  { name: 'NIFTY MIDCAP',base: 53870, color: '#a78bfa', change: '+0.96%' },
];

const TOP_STOCKS = [
  { symbol: 'RELIANCE', price: 2985.40, change: 1.23, isUp: true },
  { symbol: 'TCS',      price: 3412.75, change: 2.18, isUp: true },
  { symbol: 'HDFC BANK',price: 1748.20, change: -0.47, isUp: false },
  { symbol: 'INFY',     price: 1521.55, change: 1.87, isUp: true },
  { symbol: 'WIPRO',    price: 468.90,  change: -0.92, isUp: false },
  { symbol: 'SBIN',     price: 821.35,  change: 0.63, isUp: true },
];

const generateChartData = (base) =>
  Array.from({ length: 40 }, (_, i) => ({
    t: i,
    v: base + (Math.sin(i * 0.3) * base * 0.015) + (Math.random() - 0.5) * base * 0.008
  }));

const CATEGORIES = ['All', 'Market', 'Economy', 'IPO', 'Results', 'Global'];

export default function News() {
  const [news, setNews]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setCategory] = useState('All');
  const [indices, setIndices]         = useState(MARKET_INDICES.map(m => ({ ...m, current: m.base })));
  const [stocks, setStocks]           = useState(TOP_STOCKS);
  const [chartData]                   = useState(generateChartData(24520));
  const [isLive, setIsLive]           = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshKey, setRefreshKey]   = useState(0);

  // Fetch news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/market-news');
      const data = await res.json();
      setNews(data.articles || []);
    } catch (e) {
      console.error('News fetch failed', e);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => { fetchNews(); }, [refreshKey]);

  // Simulate live index data
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setIndices(prev => prev.map(idx => ({
        ...idx,
        current: idx.current + (Math.random() - 0.5) * idx.base * 0.0015
      })));
      setStocks(prev => prev.map(s => ({
        ...s,
        price: +(s.price + (Math.random() - 0.5) * s.price * 0.003).toFixed(2)
      })));
    }, 1500);
    return () => clearInterval(id);
  }, [isLive]);

  const timeAgo = (iso) => {
    const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const filtered = news.filter(a => {
    if (activeCategory === 'All') return true;
    const kw = { Market: ['nifty','sensex','market','stocks'], Economy: ['rbi','gdp','inflation','economy','rate'], IPO: ['ipo','issue','subscription'], Results: ['results','earnings','profit','q4','q1'], Global: ['global','us','dollar','crude','dow'] }[activeCategory] || [];
    const text = (a.title + ' ' + a.description).toLowerCase();
    return kw.some(k => text.includes(k));
  });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* ── Page Header ────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }}>
            <Newspaper size={22} color="white" />
          </div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Market News & Pulse</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.78rem' }}>
              Live market intelligence · Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => setIsLive(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: isLive ? 'rgba(16,185,129,0.12)' : 'var(--glass)', border: `1px solid ${isLive ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`, borderRadius: 10, color: isLive ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
          >
            {isLive ? <><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} /> Live</> : <><Pause size={13} /> Paused</>}
          </button>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Market Indices Ticker ───────────────────────── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {indices.map((idx) => {
          const diff = idx.current - idx.base;
          const pct  = ((diff / idx.base) * 100).toFixed(2);
          const up   = diff >= 0;
          return (
            <div key={idx.name} style={{ flex: '0 0 auto', minWidth: 160, background: 'var(--bg-card)', border: `1px solid ${idx.color}30`, borderRadius: 14, padding: '0.85rem 1.1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: idx.color, borderRadius: '14px 14px 0 0' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, margin: '0 0 0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{idx.name}</p>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 0.2rem' }}>{idx.current.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</p>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: up ? '#10b981' : '#f43f5e', display: 'flex', alignItems: 'center', gap: 3 }}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {up ? '+' : ''}{pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 2-Column Main Layout ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── LEFT: News Feed ─────────────────────────── */}
        <div>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '0.4rem 1rem', borderRadius: 20, border: `1px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border)'}`, background: activeCategory === cat ? 'rgba(139,92,246,0.15)' : 'transparent', color: activeCategory === cat ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* News Cards */}
          {loading ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }}>
                  <div style={{ height: 14, background: 'var(--glass-hover)', borderRadius: 8, width: '85%', marginBottom: 10 }} />
                  <div style={{ height: 11, background: 'var(--glass-hover)', borderRadius: 8, width: '60%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(filtered.length ? filtered : news).map((article, i) => (
                <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid var(--border)', transition: 'all 0.25s ease', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Index Badge */}
                    <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: i < 3 ? 'rgba(99,102,241,0.15)' : 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: i < 3 ? 'var(--primary)' : 'var(--text-muted)', border: `1px solid ${i < 3 ? 'rgba(139,92,246,0.3)' : 'var(--border)'}` }}>
                      {i < 3 ? '🔥' : `#${i + 1}`}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.45rem' }}>
                        <h4 style={{ color: 'white', margin: 0, fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.45, flex: 1 }}>{article.title}</h4>
                        <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                      </div>
                      {article.description && (
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 0.6rem', fontSize: '0.8rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.description}</p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 6 }}>{article.source}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--text-muted)' }}><Clock size={11} />{timeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Market Pulse Sidebar ─────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Live Chart */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={16} color="var(--primary)" /> NIFTY 50 Chart
              </h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 6 }}>LIVE</span>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="niftyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: 'white', fontSize: '0.78rem' }} formatter={(v) => [v.toFixed(2), 'NIFTY']} />
                  <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#niftyGrad)" isAnimationActive={false} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Stocks */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart2 size={16} color="var(--warning)" /> Top Stocks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stocks.map((s) => (
                <div key={s.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${s.isUp ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: s.isUp ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.isUp ? <TrendingUp size={13} color="#10b981" /> : <TrendingDown size={13} color="#f43f5e" />}
                    </div>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.82rem' }}>{s.symbol}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'white', margin: 0, fontSize: '0.82rem', fontWeight: 700 }}>₹{s.price.toLocaleString('en-IN')}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: s.isUp ? '#10b981' : '#f43f5e', fontWeight: 600 }}>{s.isUp ? '+' : ''}{s.change}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Summary */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(139,92,246,0.25)' }}>
            <h3 style={{ color: 'white', margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={16} color="#f59e0b" /> Market Snapshot
            </h3>
            {[
              { label: 'Market Status', value: 'OPEN', color: '#10b981' },
              { label: 'Advances', value: '1,847', color: '#10b981' },
              { label: 'Declines', value: '893', color: '#f43f5e' },
              { label: 'Unchanged', value: '142', color: '#94a3b8' },
              { label: 'Total Volume', value: '₹62,450 Cr', color: 'white' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{label}</span>
                <span style={{ color, fontWeight: 700, fontSize: '0.82rem' }}>{value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 900px) {
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
