import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const PortfolioLineChart = ({ transactions = [] }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const chartData = useMemo(() => {
    // For a real app, this would group transactions by date over weeks/months.
    // Here we'll just simulate a trend based on the current value.
    const currentValue = transactions.reduce((sum, tx) => sum + (tx.quantity * (tx.currentPrice || tx.buyPrice)), 0);
    const totalInvestment = transactions.reduce((sum, tx) => sum + (tx.quantity * tx.buyPrice), 0);
    
    // Simulate past 7 data points leading up to the current value
    const labels = ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5', 'Point 6', 'Current'];
    let simulatedData = [0, 0, 0, 0, 0, 0, 0];
    
    if (transactions.length > 0) {
      const step = (currentValue - totalInvestment) / 6;
      simulatedData = labels.map((_, i) => i === 6 ? currentValue : totalInvestment + (step * i));
    }

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Portfolio Value',
          data: simulatedData,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }
      ]
    };
  }, [transactions]);

  return <Line options={options} data={chartData} />;
};

export const SectorDoughnutChart = ({ transactions = [] }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: 'Outfit' }
        }
      }
    },
    cutout: '70%',
    borderWidth: 0
  };

  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#333'] }] };
    }

    const sectorAlloc = transactions.reduce((acc, tx) => {
      const value = tx.quantity * (tx.currentPrice || tx.buyPrice);
      acc[tx.sector] = (acc[tx.sector] || 0) + value;
      return acc;
    }, {});

    const labels = Object.keys(sectorAlloc);
    const data = Object.values(sectorAlloc);
    const baseColors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6', '#ec4899'];
    const colors = labels.map((_, i) => baseColors[i % baseColors.length]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          hoverOffset: 10
        }
      ]
    };
  }, [transactions]);

  return <Doughnut options={options} data={chartData} />;
};
