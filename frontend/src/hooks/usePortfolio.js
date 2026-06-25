import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const usePortfolio = (token) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we map MongoDB _id to id for existing frontend logic
      if (Array.isArray(res.data)) {
        const data = res.data.map(tx => ({ ...tx, id: tx._id, symbol: tx.stockSymbol, name: tx.companyName }));
        setTransactions(data);
      } else {
        console.error('Expected an array of transactions but received:', res.data);
        setTransactions([]);
      }
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
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [token, fetchTransactions]);

  const addTransaction = async (newTx) => {
    try {
      const res = await axios.post(`${API_URL}/api/transactions`, newTx, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const formattedTx = { ...data, id: data._id, symbol: data.stockSymbol, name: data.companyName };
      setTransactions(prev => [formattedTx, ...prev]);
    } catch (err) {
      console.error('Error adding transaction', err);
    }
  };

  const updateTransaction = async (id, updatedTx) => {
    try {
      const res = await axios.put(`${API_URL}/api/transactions/${id}`, updatedTx, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const formattedTx = { ...data, id: data._id, symbol: data.stockSymbol, name: data.companyName };
      setTransactions(prev => prev.map(tx => tx.id === id ? formattedTx : tx));
    } catch (err) {
      console.error('Error updating transaction', err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      console.error('Error deleting transaction', err);
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
    updateTransaction,
    deleteTransaction,
    calculateStats,
    loading
  };
};
