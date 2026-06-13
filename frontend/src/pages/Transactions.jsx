import React, { useState } from 'react';
import { Plus, Filter, Search, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Pencil, Trash2 } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import TransactionForm from '../components/TransactionForm';

const Transactions = ({ token }) => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = usePortfolio(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    <div style={{ padding: '2rem' }}>
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
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setEditTransaction(null);
              setIsModalOpen(true);
            }}
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

      {/* Transaction List */}
      <div style={{ 
        background: 'var(--glass)', 
        borderRadius: '16px', 
        padding: '2rem',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
          Transaction History
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No transactions found matching your criteria.</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, idx) => (
              <div key={idx} style={{
                background: 'var(--glass-hover)',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: transaction.type === 'buy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {transaction.type === 'buy' ? (
                      <TrendingUp size={20} color="#10b981" />
                    ) : (
                      <TrendingDown size={20} color="#ef4444" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 0.25rem 0' }}>
                      {transaction.companyName}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0' }}>
                      {transaction.symbol} • {transaction.sector}
                    </p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {transaction.quantity} shares @ Rs {transaction.buyPrice}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                    Rs {(transaction.quantity * transaction.currentPrice).toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: transaction.type === 'buy' ? 'var(--accent)' : 'var(--danger)' 
                  }}>
                    {transaction.type === 'buy' ? '+' : '-'} 
                    Rs {Math.abs(transaction.quantity * (transaction.currentPrice - transaction.buyPrice)).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                  <button 
                    onClick={() => {
                      setEditTransaction(transaction);
                      setIsModalOpen(true);
                    }}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Edit Transaction"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this transaction?')) {
                        deleteTransaction(transaction.id);
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Delete Transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--glass)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: 0 }}>
                Add Transaction
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.5rem'
                }}
              >
                ×
              </button>
            </div>
            <TransactionForm 
              initialData={editTransaction}
              onAdd={(newTransaction) => {
                addTransaction(newTransaction);
                setIsModalOpen(false);
              }}
              onUpdate={(id, updated) => {
                updateTransaction(id, updated);
                setIsModalOpen(false);
                setEditTransaction(null);
              }}
              onClose={() => {
                setIsModalOpen(false);
                setEditTransaction(null);
              }}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
