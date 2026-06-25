import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * GrowthLineChart: Dual-line chart for Portfolio Value vs NIFTY 50
 */
export const GrowthLineChart = ({ data = [] }) => {
  if (!Array.isArray(data)) {
    return <div style={{ color: 'var(--danger)', padding: '1rem', textAlign: 'center' }}>Unable to load chart data</div>;
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          boxWidth: 8,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: '#64748b',
          font: { size: 10 },
          callback: (value) => '₹' + (value >= 1000 ? (value/1000).toFixed(1) + 'k' : value)
        }
      }
    }
  };

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        fill: true,
        label: 'Portfolio',
        data: data.map(d => d.value),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6
      },
      {
        label: 'NIFTY 50',
        data: data.map(d => d.market),
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };

  return <Line options={options} data={chartData} />;
};

/**
 * SectorDoughnutChart: Clean doughnut for asset allocation
 */
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
          font: { size: 11 }
        }
      }
    },
    cutout: '75%',
    borderWidth: 0
  };

  const sectorAlloc = transactions.reduce((acc, tx) => {
    const value = tx.quantity * (tx.currentPrice || tx.buyPrice || 0);
    acc[tx.sector] = (acc[tx.sector] || 0) + value;
    return acc;
  }, {});

  const labels = Object.keys(sectorAlloc);
  const data = Object.values(sectorAlloc);
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6'];

  const chartData = {
    labels,
    datasets: [{ data, backgroundColor: colors, hoverOffset: 15 }]
  };

  return <Doughnut options={options} data={chartData} />;
};

/**
 * AnalyticsBarChart: Monthly P/L visualization
 */
export const AnalyticsBarChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#64748b' } }
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Profit',
      data: [12, 19, -3, 5, 2, 3],
      backgroundColor: (context) => context.raw >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)',
      borderRadius: 6
    }]
  };

  return <Bar options={options} data={chartData} />;
};

/**
 * WinRateChart: Simple success ratio gauge
 */
export const WinRateChart = ({ rate = 75 }) => {
  const chartData = {
    labels: ['Win', 'Loss'],
    datasets: [{
      data: [rate, 100 - rate],
      backgroundColor: ['#10b981', 'rgba(255, 255, 255, 0.05)'],
      circumference: 180,
      rotation: 270,
      cutout: '85%',
      borderWidth: 0,
      borderRadius: 10
    }]
  };

  return (
    <div style={{ height: '150px', position: 'relative' }}>
      <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
      <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{rate}%</span>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Win Rate</p>
      </div>
    </div>
  );
};

/**
 * Sparkline: Tiny charts for KPI cards
 */
export const Sparkline = ({ data = [], color = '#10b981' }) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [{
      data,
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: false
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return <Line data={chartData} options={options} />;
};
