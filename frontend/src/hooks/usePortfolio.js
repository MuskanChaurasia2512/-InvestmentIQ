import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const usePortfolio = (token) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we map MongoDB _id to id for existing frontend logic
      const data = res.data.map(tx => ({ ...tx, id: tx._id, symbol: tx.stockSymbol, name: tx.companyName }));
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions', err);
      // Auto logout on invalid or expired token
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (newTx) => {
    try {
      const res = await axios.post('http://localhost:5000/api/transactions', newTx, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const formattedTx = { ...data, id: data._id, symbol: data.stockSymbol, name: data.companyName };
      setTransactions(prev => [formattedTx, ...prev]);
    } catch (err) {
      console.error('Error adding transaction', err);
    }
  };

  const calculateStats = useCallback(() => {
    if (!transactions || transactions.length === 0) {
      return { totalInvestment: '0', currentValue: '0', profitLoss: '0', plPercentage: '0.00', isProfitable: true };
    }

    const totalInvestment = transactions.reduce((sum, tx) => sum + (tx.quantity * tx.buyPrice), 0);
    const currentValue = transactions.reduce((sum, tx) => sum + (tx.quantity * (tx.currentPrice || tx.buyPrice)), 0);
    const profitLoss = currentValue - totalInvestment;
    const plPercentage = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

    return {
      totalInvestment: totalInvestment.toLocaleString('en-IN'),
      currentValue: currentValue.toLocaleString('en-IN'),
      profitLoss: profitLoss.toLocaleString('en-IN'),
      plPercentage: plPercentage.toFixed(2),
      isProfitable: profitLoss >= 0
    };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    calculateStats,
    loading
  };
};
