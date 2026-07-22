import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function CategoryPieChart({ data, labels }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spent (₹)',
        data,
        backgroundColor: [
          'rgba(6, 182, 212, 0.6)',
          'rgba(217, 70, 239, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(99, 102, 241, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(148, 163, 184, 0.6)'
        ],
        borderColor: [
          '#06b6d4',
          '#d946ef',
          '#10b981',
          '#f97316',
          '#ef4444',
          '#6366f1',
          '#eab308',
          '#94a3b8'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter' }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export function TrendBarChart({ data, labels }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Spending (₹)',
        data,
        backgroundColor: 'rgba(6, 182, 212, 0.4)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
