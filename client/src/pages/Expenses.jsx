import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseCard from '../components/ExpenseCard';
import { Search, Download, ArrowUpDown, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Bills', 'Medical', 'Others'];

export default function Expenses({ expenses, onAdd, onUpdate, onDelete, loading, error, showToast }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expense_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleFormSubmit = async (expenseData) => {
    if (editingExpense) {
      const success = await onUpdate(editingExpense.id, expenseData);
      if (success) setEditingExpense(null);
    } else {
      await onAdd(expenseData);
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await onDelete(id);
    }
  };

  // Filter & Search
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let fieldA = a[sortBy];
    let fieldB = b[sortBy];

    if (sortBy === 'amount') {
      fieldA = parseFloat(fieldA);
      fieldB = parseFloat(fieldB);
    } else if (sortBy === 'expense_date') {
      fieldA = new Date(fieldA);
      fieldB = new Date(fieldB);
    } else {
      fieldA = String(fieldA).toLowerCase();
      fieldB = String(fieldB).toLowerCase();
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('No expenses to export.', 'warning');
      return;
    }

    const dataToExport = expenses.map(exp => ({
      Title: exp.title,
      Amount: exp.amount,
      Category: exp.category,
      Date: exp.expense_date,
      Description: exp.description || ''
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `cashcrush_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Expenses exported successfully as CSV!', 'success');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Synching with Supabase logs...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Manage Expenditures</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track, filter, sort, and export your transactions.</p>
      </div>

      {error && (
        <div className="insight-alert insight-alert-warning">
          <AlertCircle size={20} />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Left Col: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ExpenseForm 
            onSubmit={handleFormSubmit}
            initialData={editingExpense}
            onCancel={editingExpense ? () => setEditingExpense(null) : null}
          />
        </div>

        {/* Right Col: List */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3>📋 Transactions List</h3>
            <button onClick={handleExportCSV} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Search, Filter, Sort Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search description/title..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ minWidth: '120px' }}>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-control"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => toggleSort('amount')} 
              className="btn btn-secondary" 
              style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}
            >
              Amount <ArrowUpDown size={14} />
            </button>

            <button 
              onClick={() => toggleSort('expense_date')} 
              className="btn btn-secondary" 
              style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px' }}
            >
              Date <ArrowUpDown size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {sortedExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No expenditures match the current filter.
              </div>
            ) : (
              sortedExpenses.map(exp => (
                <ExpenseCard 
                  key={exp.id} 
                  expense={exp} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteClick} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
