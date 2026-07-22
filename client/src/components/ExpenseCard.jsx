import React from 'react';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div 
      className="glass animated" 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 20px',
        border: '1px solid var(--border-glass)',
        transition: 'var(--transition)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{expense.title}</h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            fontSize: '11px', 
            fontWeight: '600',
            color: 'var(--primary)',
            background: 'var(--primary-glow)',
            padding: '3px 8px',
            borderRadius: '12px',
            border: '1px solid var(--border-neon)'
          }}>
            <Tag size={10} /> {expense.category}
          </span>
          
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Calendar size={12} /> {formatDate(expense.expense_date)}
          </span>
        </div>

        {expense.description && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {expense.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--secondary)' }}>
          - ₹{parseFloat(expense.amount).toFixed(2)}
        </span>
        
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => onEdit(expense)} 
            className="btn btn-secondary" 
            style={{ padding: '6px', borderRadius: '8px' }}
            title="Edit Expense"
          >
            <Edit2 size={13} />
          </button>
          <button 
            onClick={() => onDelete(expense.id)} 
            className="btn btn-danger" 
            style={{ padding: '6px', borderRadius: '8px' }}
            title="Delete Expense"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
