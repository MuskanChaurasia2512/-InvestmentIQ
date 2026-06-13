import React from 'react';
import { TrendingUp, Target, Award, AlertTriangle } from 'lucide-react';

const Goals = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>Investment Goals</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
              <Target size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'white' }}>Retirement Fund</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Long-term wealth building</p>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Amount</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>₹1,00,00,000</span>
            </div>
            <div style={{ height: '8px', background: 'var(--glass)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: '35%', 
                background: 'var(--accent)', 
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>₹35,00,000 saved</span>
              <span>35% achieved</span>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--glass-hover)', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <strong>Monthly Target:</strong> ₹25,000
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              On track to meet goal by age 60
            </p>
          </div>
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
              background: 'rgba(99, 102, 241, 0.15)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={24} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'white' }}>Emergency Fund</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>6 months expenses</p>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Amount</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>₹3,00,000</span>
            </div>
            <div style={{ height: '8px', background: 'var(--glass)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: '80%', 
                background: 'var(--warning)', 
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>₹2,40,000 saved</span>
              <span style={{ color: 'var(--accent)' }}>80% achieved</span>
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginTop: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#10b981' }}>
              <strong>Almost there!</strong> Just ₹60,000 to go
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '2rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <TrendingUp size={20} color="var(--primary)" />
          Investment Milestones
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--glass)', 
            borderRadius: '8px',
            borderLeft: '4px solid var(--accent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                background: 'var(--accent)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>First ₹1L</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Achieved in 6 months</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'var(--glass)', 
            borderRadius: '8px',
            borderLeft: '4px solid var(--warning)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                background: 'var(--warning)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>Diversified Portfolio</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>5+ sectors covered</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'var(--glass)', 
            borderRadius: '8px',
            borderLeft: '4px solid var(--primary)',
            opacity: '0.6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                background: 'var(--text-muted)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>○</div>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>₹10L Portfolio</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Target by end of year</p>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '2rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <AlertTriangle size={20} color="var(--warning)" />
          Recommendations
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>Increase SIP by 20%</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Based on your current savings rate, increasing your monthly SIP to ₹30,000 will help you reach your retirement goal 2 years earlier.
            </p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Review Portfolio Quarterly</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Schedule quarterly portfolio reviews to rebalance and ensure alignment with your financial goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
