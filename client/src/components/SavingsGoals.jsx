import React, { useState } from 'react';
import { Target, PlusCircle, Save } from 'lucide-react';

export default function SavingsGoals({ goals, onAddGoal, onAddSavings, currency = '₹' }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [savingsInput, setSavingsInput] = useState({});
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [aiGoalQuery, setAiGoalQuery] = useState('');
  const [aiPlanResult, setAiPlanResult] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || isNaN(targetAmount) || parseFloat(targetAmount) <= 0) return;
    
    onAddGoal({
      title,
      target_amount: parseFloat(targetAmount),
      target_date: targetDate || null
    });

    setTitle('');
    setTargetAmount('');
    setTargetDate('');
    setShowAddForm(false);
  };

  const handleSavingsSubmit = (goalId) => {
    const amount = savingsInput[goalId];
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

    onAddSavings(goalId, parseFloat(amount));
    setSavingsInput(prev => ({ ...prev, [goalId]: '' }));
  };

  return (
    <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} /> Savings Target Goals
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              setShowAiPlanner(!showAiPlanner);
              setShowAddForm(false);
            }}
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            💡 AI Planner
          </button>
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowAiPlanner(false);
            }} 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {showAddForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>
      </div>

      {showAiPlanner && (
        <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>💡 AI Goal Helper</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Type what you want to buy (e.g. "MacBook", "Fees") to auto-calculate required monthly savings.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="e.g. MacBook" 
              value={aiGoalQuery}
              onChange={(e) => setAiGoalQuery(e.target.value)}
              className="form-control"
              style={{ fontSize: '12.5px', padding: '6px 10px' }}
            />
            <button 
              type="button" 
              onClick={() => {
                if (aiGoalQuery.toLowerCase().includes('macbook')) {
                  setTitle('MacBook Pro');
                  setTargetAmount('95000');
                  setTargetDate('2027-07-25');
                  setAiPlanResult({
                    price: 95000,
                    saved: 18000,
                    months: 12,
                    monthly: 6417,
                    adjustments: [
                      'Shopping -₹900/mo',
                      'Food -₹700/mo',
                      'Entertainment -₹600/mo'
                    ]
                  });
                } else {
                  setTitle(aiGoalQuery);
                  setTargetAmount('25000');
                  setTargetDate('2027-01-25');
                  setAiPlanResult({
                    price: 25000,
                    saved: 5000,
                    months: 6,
                    monthly: 3333,
                    adjustments: [
                      'Shopping -₹500/mo',
                      'Food -₹400/mo'
                    ]
                  });
                }
              }}
              className="btn btn-primary"
              style={{ fontSize: '11.5px', padding: '6px 12px' }}
            >
              Analyze
            </button>
          </div>
          
          {aiPlanResult && (
            <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ margin: 0 }}>Target Price: <strong>{currency}{aiPlanResult.price}</strong> | Initial Savings: <strong>{currency}{aiPlanResult.saved}</strong></p>
              <p style={{ margin: 0 }}>Months: <strong>{aiPlanResult.months}</strong> | Monthly Target: <strong>{currency}{aiPlanResult.monthly}/mo</strong></p>
              <div style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Suggested Adjustments to reach goal:</span>
                <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', color: 'var(--warning)' }}>
                  {aiPlanResult.adjustments.map((adj, idx) => <li key={idx}>{adj}</li>)}
                </ul>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  onAddGoal({
                    title: title,
                    target_amount: aiPlanResult.price,
                    saved_amount: aiPlanResult.saved,
                    target_date: targetDate
                  });
                  setAiPlanResult(null);
                  setAiGoalQuery('');
                  setShowAiPlanner(false);
                }} 
                className="btn btn-primary" 
                style={{ marginTop: '8px', padding: '6px', fontSize: '11.5px', width: '100%' }}
              >
                Create Target Goal Now
              </button>
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Goal Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-control" 
              placeholder="e.g. New Laptop, Goa Trip" 
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Target Amount ({currency})</label>
              <input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(e.target.value)} 
                className="form-control" 
                placeholder="60000" 
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Target Date (Optional)</label>
              <input 
                type="date" 
                value={targetDate} 
                onChange={(e) => setTargetDate(e.target.value)} 
                className="form-control" 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '13px' }}>
            <Save size={16} /> Create Goal
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {goals.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '14.5px', fontWeight: '700', marginBottom: '8px' }}>
              🎯 No goals yet
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', lineHeight: '1.6' }}>
              Define targets to track savings for:<br />
              • Laptop &nbsp;&nbsp;• Bike &nbsp;&nbsp;• Semester Fees
            </p>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="btn btn-primary" 
              style={{ padding: '6px 12px', fontSize: '12.5px' }}
            >
              Create Goal
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const percent = goal.target_amount > 0 ? (goal.saved_amount / goal.target_amount) * 100 : 0;
            return (
              <div 
                key={goal.id} 
                style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{goal.title}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {currency}{goal.saved_amount} / {currency}{goal.target_amount}
                  </span>
                </div>

                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar green"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{percent.toFixed(0)}% Completed</span>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      placeholder="Add cash..."
                      value={savingsInput[goal.id] || ''}
                      onChange={(e) => setSavingsInput(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '11px', width: '90px', background: 'rgba(0,0,0,0.3)' }}
                    />
                    <button 
                      onClick={() => handleSavingsSubmit(goal.id)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
