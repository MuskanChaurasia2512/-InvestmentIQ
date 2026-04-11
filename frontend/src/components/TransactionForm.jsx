import React, { useState } from 'react';
import { X, PlusCircle, TrendingUp, Search } from 'lucide-react';
import axios from 'axios';

const TransactionForm = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    sector: '',
    quantity: '',
    executionPrice: '',
    fees: '0',
    currentPrice: '',
    date: new Date().toISOString().split('T')[0],
    type: 'buy'
  });
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Groww style stock suggestions
  const growwStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking' },
    { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Technology' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'Technology' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecom' },
    { symbol: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automobile' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking' }
  ];

  const sectorOptions = [
    'Technology', 'Banking', 'Energy', 'Automobile', 
    'Telecom', 'Consumer Goods', 'Healthcare', 
    'Pharma', 'Insurance', 'Real Estate', 'Metals'
  ];

  const fetchStockPrice = async (symbol) => {
    if (!symbol) return;
    
    setLoadingPrice(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/stock-price/${symbol}`);
      const price = response.data.currentPrice;
      setFormData(prev => ({ 
        ...prev, 
        currentPrice: price.toString(),
        name: prev.name || response.data.symbol || symbol
      }));
    } catch (error) {
      console.error('Error fetching stock price:', error);
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleStockSelect = (selectedStock) => {
    setFormData({ 
      ...formData, 
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      sector: selectedStock.sector
    });
    fetchStockPrice(selectedStock.symbol);
  };

  const handleSectorSelect = (sector) => {
    setFormData({ ...formData, sector });
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'modalFadeIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlusCircle size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: 0 }}>Add Investment</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Start building your portfolio</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .custom-input:focus {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        `}</style>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Stock Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
              Search Stock
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}>
                <Search size={18} color="var(--text-muted)" />
              </div>
              <select 
                name="symbol" 
                required 
                value={formData.symbol}
                onChange={(e) => {
                  const selectedStock = growwStocks.find(s => s.symbol === e.target.value);
                  if (selectedStock) {
                    handleStockSelect(selectedStock);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              >
                <option value="">Search and select stock...</option>
                {growwStocks.map((stock, idx) => (
                  <option key={idx} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8l4 4 4-4" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Transaction Type and Company Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Transaction Type
              </label>
              <select 
                name="type" 
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Company Name
              </label>
              <input 
                name="name"
                type="text"
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Reliance Industries Ltd."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              />
            </div>
          </div>

          {/* Two Column Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Sector
              </label>
              <select 
                name="sector" 
                required 
                value={formData.sector}
                onChange={(e) => handleSectorSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              >
                <option value="">Select sector...</option>
                {sectorOptions.map((sector, idx) => (
                  <option key={idx} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Quantity
              </label>
              <input 
                name="quantity" 
                type="number" 
                required 
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              />
            </div>
          </div>

          {/* Price Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Transaction Price (₹)
              </label>
              <input 
                name="executionPrice" 
                type="number" 
                required 
                value={formData.executionPrice}
                onChange={handleChange}
                placeholder="2500"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Fees/Brokerage (₹)
              </label>
              <input 
                name="fees" 
                type="number" 
                value={formData.fees}
                onChange={handleChange}
                placeholder="20"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', display: 'block', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Current Price
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '0.25rem' }}>
                  {loadingPrice ? 'Fetching...' : '(Live)'}
                </span>
              </label>
              <input 
                name="currentPrice" 
                type="number" 
                required 
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="Auto-fetched"
                min="0"
                step="0.01"
                readOnly={loadingPrice}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: loadingPrice ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                  outline: 'none',
                  cursor: loadingPrice ? 'not-allowed' : 'text',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                className="custom-input"
              />
            </div>
          </div>

          {/* Investment Summary */}
          {(formData.quantity && formData.executionPrice) && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--primary)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Transaction Value:</span>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                  ₹{((parseFloat(formData.quantity) * parseFloat(formData.executionPrice)) + (formData.type === 'buy' ? parseFloat(formData.fees || 0) : -parseFloat(formData.fees || 0))).toLocaleString()}
                </span>
              </div>
              {formData.currentPrice && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Market Value:</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                    ₹{(parseFloat(formData.quantity) * parseFloat(formData.currentPrice)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#4f46e5';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.transform = 'translateY(0)';
              }}
          >
            Add Investment
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
