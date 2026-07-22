import React, { useState } from 'react';
import { RefreshCcw, Save, Trash2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Bills', 'Medical', 'Others'];

export default function RecurringList({ recurring, onAddRecurring, onDeleteRecurring, currency = '₹' }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [frequency, setFrequency] = useState('monthly');
  const [nextDueDate, setNextDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || isNaN(amount) || parseFloat(amount) <= 0 || !nextDueDate) return;

    onAddRecurring({
      title,
      amount: parseFloat(amount),
      category,
      frequency,
      next_due_date: nextDueDate
    });

    setTitle('');
    setAmount('');
    setCategory('Bills');
    setFrequency('monthly');
    setNextDueDate('');
    setShowAddForm(false);
  };

  return (
    <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCcw size={20} className="text-primary" style={{ color: 'var(--primary)' }} /> Recurring Expenses
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-secondary" 
          style={{ padding: '6px 12px', fontSize: '13px' }}
        >
          {showAddForm ? 'Cancel' : '+ New Recurring'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Subscription / Name</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-control" 
              placeholder="e.g. Netflix, Room Rent" 
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Amount ({currency})</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="form-control" 
                placeholder="e.g. 199" 
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-control"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Frequency</label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)} 
                className="form-control"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Next Due Date</label>
              <input 
                type="date" 
                value={nextDueDate} 
                onChange={(e) => setNextDueDate(e.target.value)} 
                className="form-control" 
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '13px' }}>
            <Save size={16} /> Save Subscription
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recurring.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
            No subscriptions or recurring payments registered.
          </p>
        ) : (
          recurring.map(item => (
            <div 
              key={item.id} 
              style={{ 
                padding: '12px', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-glass)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontWeight: '600', fontSize: '14px', display: 'block' }}>{item.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {item.category} • {item.frequency.toUpperCase()} • Due: {new Date(item.next_due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                  {currency}{parseFloat(item.amount).toFixed(2)}
                </span>
                <button 
                  onClick={() => onDeleteRecurring(item.id)}
                  className="btn btn-danger"
                  style={{ padding: '6px', borderRadius: '8px' }}
                  title="Delete Subscription"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
