import React from 'react';
import { Briefcase, TrendingUp, DollarSign, PieChart } from 'lucide-react';

const Portfolio = () => {
  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Portfolio Analysis</h2>
      
      <div className="grid-responsive-2" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'rgba(99, 102, 241, 0.15)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={24} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'white' }}>Total Holdings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All your investments</p>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>12</div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Different Stocks</p>
        </div>

        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '16px', 
          padding: '2rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'rgba(16, 185, 129, 0.15)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'white' }}>Best Performer</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Top gaining stock</p>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>RELIANCE</div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>+15.2% this month</p>
        </div>
      </div>

      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '2rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'rgba(245, 158, 11, 0.15)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={24} color="#f59e0b" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'white' }}>Portfolio Value</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current market value</p>
          </div>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--warning)' }}>₹68,250</div>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>+5.82% total return</p>
      </div>

      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <PieChart size={20} color="var(--primary)" />
          Sector Distribution
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'white' }}>Technology</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6366f1' }}>45%</span>
            </div>
            <div style={{ height: '4px', background: '#6366f1', borderRadius: '2px' }}></div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'white' }}>Banking</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>35%</span>
            </div>
            <div style={{ height: '4px', background: '#10b981', borderRadius: '2px' }}></div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'white' }}>Energy</span>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f59e0b' }}>20%</span>
            </div>
            <div style={{ height: '4px', background: '#f59e0b', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
