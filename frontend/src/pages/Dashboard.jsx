import React, { useState } from 'react';
import { Search, Filter, Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Star, Eye } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import TransactionForm from '../components/TransactionForm';
import AISuggestions from '../components/AISuggestions';
import { usePortfolio } from '../hooks/usePortfolio';

const Dashboard = ({ token }) => {
  const { transactions, addTransaction, calculateStats, loading } = usePortfolio(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const stats = calculateStats();

  // Groww style stat cards
  const growwStats = [
    { 
      title: 'Total Investment', 
      value: stats.totalInvestment, 
      change: '+12.5%', 
      isPositive: true, 
      icon: DollarSign, 
      color: '#6366f1',
      subtitle: 'Amount invested'
    },
    { 
      title: 'Current Value', 
      value: stats.currentValue, 
      change: '+20.5%', 
      isPositive: true, 
      icon: TrendingUp, 
      color: '#10b981',
      subtitle: 'Market value today'
    },
    { 
      title: 'Total Returns', 
      value: stats.profitLoss, 
      change: stats.plPercentage, 
      isProfitable: stats.isProfitable, 
      icon: Activity, 
      color: '#f59e0b',
      subtitle: 'Profit/Loss amount'
    },
    { 
      title: 'Day Change', 
      value: '₹2,150', 
      change: '+0.42%', 
      isPositive: true, 
      icon: PieChart, 
      color: '#f43f5e',
      subtitle: "Today's change"
    }
  ];

  return (
    <div className="dashboard">
      {/* Groww style header */}
      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Portfolio</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track your investments and performance</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass-card" style={{ 
              padding: '0.5rem 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'var(--glass)',
              borderRadius: '8px'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search stocks..." 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'white', 
                  outline: 'none',
                  width: '200px'
                }} 
              />
            </div>
            <button 
              className="btn" 
              style={{ 
                background: 'var(--glass)', 
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Groww style stats cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {growwStats.map((stat, idx) => (
          <div key={idx} style={{ 
            background: 'var(--glass)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                  {typeof stat.value === 'string' ? stat.value : `Rs ${stat.value.toLocaleString()}`}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{stat.subtitle}</p>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: `${stat.color}15`, 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: stat.isPositive ? 'var(--accent)' : 'var(--danger)',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Holdings table - Groww style */}
        <div style={{ 
          background: 'var(--glass)', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>Holdings</h3>
            <button style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--primary)', 
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              View All
            </button>
          </div>
          
          {transactions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Stock</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Qty</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Avg. Cost</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>LTP</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Investment</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Current Value</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>P&L</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((stock) => {
                    const investment = stock.quantity * stock.buyPrice;
                    const currentValue = stock.quantity * stock.currentPrice;
                    const pl = currentValue - investment;
                    const returns = ((pl / investment) * 100).toFixed(2);
                    const isProfitable = pl >= 0;
                    
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
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>Rs {stock.currentPrice}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>Rs {investment.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>Rs {currentValue.toLocaleString()}</td>
                        <td style={{ 
                          padding: '0.75rem', 
                          textAlign: 'right', 
                          fontSize: '0.875rem', 
                          color: isProfitable ? 'var(--accent)' : 'var(--danger)',
                          fontWeight: '500'
                        }}>
                          {isProfitable ? '+' : ''}Rs {pl.toLocaleString()}
                        </td>
                        <td style={{ 
                          padding: '0.75rem', 
                          textAlign: 'right', 
                          fontSize: '0.875rem', 
                          color: isProfitable ? 'var(--accent)' : 'var(--danger)',
                          fontWeight: '500'
                        }}>
                          {isProfitable ? '+' : ''}{returns}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
      <TransactionForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTransaction} 
      />
    </div>
  );
};

export default Dashboard;
