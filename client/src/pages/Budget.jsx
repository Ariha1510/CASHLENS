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
      </div>
    </div>
  );
}
