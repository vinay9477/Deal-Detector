/**
 * PriceChart Component
 * Renders a line chart of price history using Chart.js
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import './PriceChart.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PriceChart = ({ priceHistory = [], productName = 'Product' }) => {
  // Format data for Chart.js
  const labels = priceHistory.map((entry) =>
    new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  );

  const prices = priceHistory.map((entry) => entry.price);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#1e1e30',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Price History — ${productName}`,
        color: '#e5e7eb',
        font: { size: 14, weight: '600' },
      },
      tooltip: {
        backgroundColor: '#1e1e30',
        titleColor: '#e5e7eb',
        bodyColor: '#34d399',
        borderColor: '#667eea',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      y: {
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          callback: (value) => `$${value}`,
        },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
      },
    },
  };

  if (priceHistory.length === 0) {
    return (
      <div className="price-chart-empty">
        <p>No price history available yet.</p>
      </div>
    );
  }

  return (
    <div className="price-chart-container" id="price-chart">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
