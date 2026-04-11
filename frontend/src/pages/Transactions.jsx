import React, { useState } from 'react';
import { Plus, Filter, Search, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import TransactionForm from '../components/TransactionForm';

const Transactions = ({ token }) => {
  const { transactions, addTransaction, calculateStats } = usePortfolio(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = calculateStats();

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'buy', label: 'Buy Only' },
    { value: 'sell', label: 'Sell Only' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  // Industry-wise data
  const industryData = transactions.reduce((acc, transaction) => {
    const industry = transaction.sector;
    const investment = transaction.quantity * transaction.buyPrice;
    const currentValue = transaction.quantity * transaction.currentPrice;
    const profit = currentValue - investment;
    
    if (!acc[industry]) {
      acc[industry] = {
        name: industry,
        totalInvestment: 0,
        currentValue: 0,
        profit: 0,
        count: 0,
        stocks: []
      };
    }
    
    acc[industry].totalInvestment += investment;
    acc[industry].currentValue += currentValue;
    acc[industry].profit += profit;
    acc[industry].count += 1;
    acc[industry].stocks.push(transaction);
    
    return acc;
  }, {});

  const industryArray = Object.values(industryData);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.sector.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'buy') return matchesSearch && transaction.type !== 'sell';
    if (filter === 'sell') return matchesSearch && transaction.type === 'sell';
    if (filter === 'today') {
      const today = new Date().toDateString();
      return matchesSearch && new Date(transaction.transactionDate).toDateString() === today;
    }
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && new Date(transaction.transactionDate) >= weekAgo;
    }
    if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return matchesSearch && new Date(transaction.transactionDate) >= monthAgo;
    }
    return matchesSearch;
  });

  return (
    <div className="transactions">
      {/* Header */}
      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Transactions</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your investment history and industry performance</p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem'
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ 
            position: 'relative', 
            flex: 1,
            maxWidth: '300px'
          }}>
            <Search size={18} color="var(--text-muted)" style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }} />
            <input 
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'var(--glass-hover)',
                outline: 'none',
                color: 'white'
              }}
            />
          </div>
          
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'var(--glass-hover)',
              outline: 'none',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Industry-wise Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        {industryArray.map((industry, idx) => (
          <div key={idx} style={{
            background: 'var(--glass)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                  {industry.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  {industry.count} transactions
                </p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Investment</span>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                  Rs {industry.totalInvestment.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Value</span>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                  Rs {industry.currentValue.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Profit/Loss</span>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: industry.profit >= 0 ? 'var(--accent)' : 'var(--danger)' 
                }}>
                  {industry.profit >= 0 ? '+' : ''}Rs {industry.profit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
            Transaction History
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {filteredTransactions.length} transactions
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Stock</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Industry</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Quantity</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Buy Rate</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Current Rate</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Total Investment</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Current Value</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>P&L</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '500' }}>Returns</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, idx) => {
                  const investment = transaction.quantity * transaction.buyPrice;
                  const currentValue = transaction.quantity * transaction.currentPrice;
                  const pl = currentValue - investment;
                  const returns = ((pl / investment) * 100).toFixed(2);
                  const isProfitable = pl >= 0;
                  
                  return (
                    <tr key={transaction.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'white' }}>
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            background: 'var(--glass-hover)', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white'
                          }}>
                            {transaction.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'white', margin: 0 }}>
                              {transaction.symbol}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                              {transaction.companyName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: 'var(--glass-hover)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: 'white'
                        }}>
                          {transaction.sector}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>
                        {transaction.quantity}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>
                        Rs {transaction.buyPrice}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>
                        Rs {transaction.currentPrice}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>
                        Rs {investment.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'white' }}>
                        Rs {currentValue.toLocaleString()}
                      </td>
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
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>No transactions found</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              {searchTerm ? 'Try adjusting your search or filters' : 'Start by adding your first investment'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                style={{ borderRadius: '8px' }}
              >
                Add First Transaction
              </button>
            )}
          </div>
        )}
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

export default Transactions;
