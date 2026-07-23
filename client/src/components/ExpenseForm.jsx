import React, { useState, useEffect } from 'react';
import { Save, X, Camera, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Bills', 'Medical', 'Others'];

export default function ExpenseForm({ onSubmit, initialData = null, onCancel }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [scanning, setScanning] = useState(false);

  const handleReceiptScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );

      // Amount extraction
      let parsedAmount = '';
      const totalRegex = /(?:total|amt|net|sum|due)\s*[:=]?\s*[$₹]?\s*(\d+(?:\.\d{2})?)/i;
      const amountMatch = text.match(totalRegex);
      if (amountMatch) {
        parsedAmount = amountMatch[1];
      } else {
        const numberRegex = /(\d+\.\d{2})/g;
        const numbers = text.match(numberRegex);
        if (numbers && numbers.length > 0) {
          const parsedNums = numbers.map(n => parseFloat(n));
          parsedAmount = Math.max(...parsedNums).toString();
        }
      }

      // Date extraction
      let parsedDate = '';
      const dateRegex = /(\d{4}[-/]\d{2}[-/]\d{2})|(\d{2}[-/]\d{2}[-/]\d{4})/;
      const dateMatch = text.match(dateRegex);
      if (dateMatch) {
        let rawDate = dateMatch[0].replace(/\//g, '-');
        if (rawDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const parts = rawDate.split('-');
          parsedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          parsedDate = rawDate;
        }
      } else {
        parsedDate = new Date().toISOString().split('T')[0];
      }

      // Merchant/Title extraction
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let parsedTitle = lines[0] || 'Scanned Expense';
      if (parsedTitle.length > 30) parsedTitle = parsedTitle.substring(0, 30);

      // Auto Category Heuristic mapping
      const lowerTitle = parsedTitle.toLowerCase();
      let matchedCategory = 'Food';
      if (lowerTitle.match(/starbucks|cafe|coffee|cafeteria|mcdonalds|food|lunch|dinner|restaurant/)) {
        matchedCategory = 'Food';
      } else if (lowerTitle.match(/uber|bus|metro|train|taxi|transport|fuel|commute/)) {
        matchedCategory = 'Transport';
      } else if (lowerTitle.match(/amazon|nike|shopping|zara|store|clothes|sneakers/)) {
        matchedCategory = 'Shopping';
      } else if (lowerTitle.match(/textbook|college|course|education|exam|school|book/)) {
        matchedCategory = 'Education';
      } else if (lowerTitle.match(/movie|cinema|netflix|spotify|gym|entertainment/)) {
        matchedCategory = 'Entertainment';
      } else if (lowerTitle.match(/rent|bill|recharge|electricity|gas|hostel/)) {
        matchedCategory = 'Bills';
      } else if (lowerTitle.match(/pharmacy|doctor|hospital|medicine|medical/)) {
        matchedCategory = 'Medical';
      } else {
        matchedCategory = 'Others';
      }

      setTitle(parsedTitle);
      if (parsedAmount) setAmount(parsedAmount);
      setExpenseDate(parsedDate);
      setCategory(matchedCategory);
      setDescription('Scanned via Tesseract OCR.');

    } catch (err) {
      console.error('OCR Error:', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || 'Food');
      setExpenseDate(initialData.expense_date || '');
      setDescription(initialData.description || '');
    } else {
      setExpenseDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    if (!expenseDate) newErrors.expenseDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      category,
      expense_date: expenseDate,
      description
    });

    if (!initialData) {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>{initialData ? '✏️ Edit Expense' : '➕ Add Expense'}</h3>

      {!initialData && (
        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-glass)', borderRadius: '10px', textAlign: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {scanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={24} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Processing receipt OCR...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Camera size={24} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Scan Receipt Image (Auto-Fill)</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleReceiptScan} 
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </label>
        </div>
      )}

      {/* Add spin animation locally in style tag */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="form-control" 
          placeholder="e.g. Campus Cafeteria, Textbooks"
        />
        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.title}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input 
            type="number" 
            step="0.01"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="form-control" 
            placeholder="e.g. 150"
          />
          {errors.amount && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.amount}</span>}
        </div>

        <div className="form-group">
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

      <div className="form-group">
        <label className="form-label">Date</label>
        <input 
          type="date" 
          value={expenseDate} 
          onChange={(e) => setExpenseDate(e.target.value)} 
          className="form-control"
        />
        {errors.expenseDate && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.expenseDate}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="form-control" 
          placeholder="Describe your student spend..."
          rows="2"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          <Save size={18} /> {initialData ? 'Update Expense' : 'Save Expense'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
