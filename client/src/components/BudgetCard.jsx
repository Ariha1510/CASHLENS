import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function BudgetCard({ budget, spent }) {
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  let progressColorClass = 'green';
  let alertMessage = '';
  let alertType = '';

  if (percentage >= 90) {
    progressColorClass = 'red';
    alertMessage = "Warning: Spent over 90% of your student monthly budget limit!";
    alertType = 'danger';
  } else if (percentage >= 60) {
    progressColorClass = 'orange';
    alertMessage = "Watch out: Budget utilization has crossed 60%.";
    alertType = 'warning';
  } else {
    progressColorClass = 'green';
    alertMessage = "Splendid! You are spending within your safe zone.";
    alertType = 'success';
  }

  return (
    <div className="glass animated" style={{ flex: 1 }}>
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={20} className="text-cyan-500" style={{ color: 'var(--primary)' }} /> Budget Progress
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ceiling Limit</span>
          <p style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-family-title)' }}>
            ₹{budget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Remaining</span>
          <p style={{ 
            fontSize: '24px', 
            fontWeight: '800', 
            fontFamily: 'var(--font-family-title)',
            color: remaining < 0 ? 'var(--danger)' : 'var(--success)'
          }}>
            ₹{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="progress-bar-container" style={{ margin: '16px 0 8px 0' }}>
        <div 
          className={`progress-bar ${progressColorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>Spent: ₹{spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹{budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        <span>{percentage.toFixed(0)}% used</span>
      </div>

      {alertMessage && (
        <div 
          className="insight-alert" 
          style={{ 
            marginTop: '16px',
            background: alertType === 'danger' ? 'rgba(239, 68, 68, 0.1)' : alertType === 'warning' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${alertType === 'danger' ? 'var(--danger)' : alertType === 'warning' ? 'var(--warning)' : 'var(--success)'}`,
            color: alertType === 'danger' ? 'var(--danger)' : alertType === 'warning' ? 'var(--warning)' : 'var(--success)'
          }}
        >
          {alertType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{alertMessage}</span>
        </div>
      )}
    </div>
  );
}
