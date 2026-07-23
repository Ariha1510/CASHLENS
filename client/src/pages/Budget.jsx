import React, { useState } from 'react';
import { Landmark, Save } from 'lucide-react';

export default function Budget({ budget, onUpdateBudget, showToast }) {
  const [newBudget, setNewBudget] = useState(budget);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNaN(newBudget) || parseFloat(newBudget) <= 0) {
      showToast('Please enter a valid positive budget amount.', 'warning');
      return;
    }

    setLoading(true);
    const success = await onUpdateBudget(parseFloat(newBudget));
    setLoading(false);
    if (success) {
      showToast('Monthly budget successfully updated!', 'success');
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', width: '100%' }}>
      <div className="glass animated" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(6, 182, 212, 0.1)', 
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--primary)',
            display: 'flex'
          }}>
            <Landmark size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '20px' }}>Budget Settings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Set your maximum expenditure ceiling.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Monthly Spending Ceiling (₹)</label>
            <input 
              type="number" 
              className="form-control"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="e.g. 8000"
              required
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              We'll trigger warning indicators at 60% and 90% utilization.
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Ceiling Limit'}
          </button>
        </form>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <div>
            <h4 style={{ fontSize: '13.5px', marginBottom: '8px' }}>🚨 Utilization Alert Levels</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)' }}>
                <span>60% Warning Threshold:</span>
                <span>₹{((newBudget || budget) * 0.6).toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                <span>90% Critical Threshold:</span>
                <span>₹{((newBudget || budget) * 0.9).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid var(--border-neon)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>AI Suggested Budget</span>
            <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>₹9,500.00 / month</p>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Based on your last 3 months of logging activity.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
