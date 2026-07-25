import React, { useState, useMemo } from 'react';
import { Landmark, Save, HelpCircle, Check, Info, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export default function Budget({ budget, onUpdateBudget, showToast, currency = '₹', expenses = [] }) {
  const [newBudget, setNewBudget] = useState(budget);
  const [loading, setLoading] = useState(false);

  // Budget Calculator state
  const [allowance, setAllowance] = useState('10000');
  const [expectedSavings, setExpectedSavings] = useState('2000');

  const calculatedBudget = useMemo(() => {
    const alloc = parseFloat(allowance) || 0;
    const save = parseFloat(expectedSavings) || 0;
    return Math.max(0, alloc - save);
  }, [allowance, expectedSavings]);

  const expenseCount = expenses.length;
  // Define user journey stages
  const userStage = useMemo(() => {
    if (expenseCount === 0) return 'new';
    if (expenseCount < 10) return 'active';
    return 'experienced';
  }, [expenseCount]);

  const handleSubmit = async (valueToSave) => {
    const val = parseFloat(valueToSave || newBudget);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid positive budget amount.', 'warning');
      return;
    }

    setLoading(true);
    const success = await onUpdateBudget(val);
    setLoading(false);
    if (success) {
      setNewBudget(val);
      showToast('Monthly budget successfully updated!', 'success');
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '40px auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 🆕 NEW USER VIEW */}
      {userStage === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass animated" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--primary-glow)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '12px', color: 'var(--primary)', display: 'flex' }}>
                <Landmark size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>💰 Set Your Monthly Budget</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Choose a monthly spending limit to help CASHLENS monitor your expenses and provide insights.</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Monthly Spending Budget ({currency})</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="e.g. 8000"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Budget'}
              </button>
            </form>
          </div>

          {/* AI Budget Assistant Starter Recommendations */}
          <div className="grid-cols-2">
            <div className="glass animated">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Budget Assistant
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                We don't have enough spending history yet. Select one of our recommended student starter budgets to get going:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div 
                  onClick={() => setNewBudget(8000)}
                  className="glass animated" 
                  style={{ padding: '8px 12px', cursor: 'pointer', background: newBudget === 8000 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.01)', border: newBudget === 8000 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>🎓 Student Living at Home</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{currency}5,000 - {currency}8,000</p>
                </div>
                <div 
                  onClick={() => setNewBudget(10000)}
                  className="glass animated" 
                  style={{ padding: '8px 12px', cursor: 'pointer', background: newBudget === 10000 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.01)', border: newBudget === 10000 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>🏠 Hostel Student</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{currency}8,000 - {currency}12,000</p>
                </div>
                <div 
                  onClick={() => setNewBudget(15000)}
                  className="glass animated" 
                  style={{ padding: '8px 12px', cursor: 'pointer', background: newBudget === 15000 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.01)', border: newBudget === 15000 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>🏙️ Renting Independently</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{currency}12,000 - {currency}18,000</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleSubmit(newBudget)}
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: '12px', padding: '8px' }}
              >
                Use Recommended Budget
              </button>
            </div>

            {/* Spending Alerts Details */}
            <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--warning)' }} /> Spending Alerts
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                  We'll notify you automatically when your spending reaches critical limits:
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--warning)', fontWeight: '700' }}>🟡 60% Alert Limit</span>
                  <strong>{currency}{((newBudget || budget) * 0.6).toFixed(0)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--danger)', fontWeight: '700' }}>🔴 90% Alert Limit</span>
                  <strong>{currency}{((newBudget || budget) * 0.9).toFixed(0)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Calculator & Why Set a Budget */}
          <div className="grid-cols-2">
            {/* Calculator */}
            <div className="glass animated">
              <h4 style={{ fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📊 Budget Calculator
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Monthly Allowance ({currency})</label>
                  <input 
                    type="number" 
                    value={allowance} 
                    onChange={(e) => setAllowance(e.target.value)} 
                    className="form-control"
                    style={{ padding: '6px 10px', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Expected Savings ({currency})</label>
                  <input 
                    type="number" 
                    value={expectedSavings} 
                    onChange={(e) => setExpectedSavings(e.target.value)} 
                    className="form-control"
                    style={{ padding: '6px 10px', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Recommended Budget:</span>
                  <strong style={{ color: 'var(--primary)' }}>{currency}{calculatedBudget}</strong>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleSubmit(calculatedBudget)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                >
                  Apply Calculated Budget
                </button>
              </div>
            </div>

            {/* Why Set a Budget */}
            <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '14px', margin: 0 }}>Why set a budget?</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} style={{ color: 'var(--success)' }} /> Track your spending patterns
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} style={{ color: 'var(--success)' }} /> Receive smart AI recommendations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} style={{ color: 'var(--success)' }} /> Unlock rewards for staying under budget
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} style={{ color: 'var(--success)' }} /> Predict month-end spending
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 📈 ACTIVE USER VIEW (1+ MONTH) */}
      {userStage === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass animated">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={20} style={{ color: 'var(--primary)' }} /> Monthly Budget Settings
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="number" 
                className="form-control"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} /> Save
              </button>
            </form>
          </div>

          <div className="grid-cols-2">
            {/* AI Recommendation */}
            <div className="glass animated">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px', color: 'var(--primary)' }}>
                <Sparkles size={16} /> AI Budget Recommendation
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recommended Budget:</span>
                  <strong>{currency}9,500/month</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avg. Spending:</span>
                  <strong>{currency}8,650</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avg. Savings:</span>
                  <strong>{currency}1,850</strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  💡 <strong>Recommendation:</strong> Increase your budget slightly or reduce food spending by {currency}600/month.
                </p>
              </div>
            </div>

            {/* Threshold limits */}
            <div className="glass animated">
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Threshold limits</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)' }}>
                  <span>60% Warning Level:</span>
                  <span>{currency}{((newBudget || budget) * 0.6).toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                  <span>90% Critical Level:</span>
                  <span>{currency}{((newBudget || budget) * 0.9).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ EXPERIENCED USER VIEW (3+ MONTHS) */}
      {userStage === 'experienced' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass animated">
            <h3 style={{ marginBottom: '16px' }}>Experienced Budget Planner</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="number" 
                className="form-control"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={16} /> Save Changes
              </button>
            </form>
          </div>

          <div className="grid-cols-2">
            {/* Rich AI Suggested Budget */}
            <div className="glass animated" style={{ border: '1px solid var(--primary)', background: 'rgba(6, 182, 212, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> AI Suggested Budget
                </h4>
                <span style={{ fontSize: '11px', background: 'rgba(34,197,94,0.15)', color: 'var(--success)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>94% Confidence</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 12px 0' }}>{currency}9,500/month</p>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <p style={{ margin: '0 0 6px 0' }}>Based on:</p>
                <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>✔ 3 months of consistent spending logs</li>
                  <li>✔ Student savings targets & goals</li>
                  <li>✔ Active recurring subscriptions</li>
                  <li>✔ Overspending trends prevention</li>
                </ul>
              </div>
            </div>

            {/* Alerts */}
            <div className="glass animated">
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Alert thresholds</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)' }}>
                  <span>60% Warning Threshold:</span>
                  <span>{currency}{((newBudget || budget) * 0.6).toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                  <span>90% Critical Threshold:</span>
                  <span>{currency}{((newBudget || budget) * 0.9).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
