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
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleReceiptScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setReceiptPreview(URL.createObjectURL(file));
    setScanSuccess(false);
    setScanning(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );

      // Amount extraction
      let parsedAmount = '';
      const grandTotalRegex = /(?:payable\s+amount|payable|grand\s+total|total\s+payable|net\s+due)\s*[:=]?\s*[$₹]?\s*(\d+(?:\.\d{2})?)/i;
      const grandMatch = text.match(grandTotalRegex);
      if (grandMatch) {
        parsedAmount = grandMatch[1];
      } else {
        const totalRegex = /\b(?:total|amt|due|sum)\b\s*[:=]?\s*[$₹]?\s*(\d+(?:\.\d{2})?)/i;
        const totalMatch = text.match(totalRegex);
        if (totalMatch) {
          parsedAmount = totalMatch[1];
        } else {
          const numberRegex = /(\d+\.\d{2})/g;
          const numbers = text.match(numberRegex);
          if (numbers && numbers.length > 0) {
            const parsedNums = numbers.map(n => parseFloat(n));
            parsedAmount = Math.max(...parsedNums).toString();
          }
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

      // Smarter Merchant, Title & Category classification
      const lowerText = text.toLowerCase();
      let parsedTitle = '';
      let parsedMerchant = '';
      let matchedCategory = 'Others';

      if (lowerText.includes('big bazaar') || lowerText.includes('bigbazaar')) {
        parsedTitle = 'Big Bazaar Shopping';
        parsedMerchant = 'Big Bazaar';
        matchedCategory = 'Shopping';
      } else if (lowerText.includes('starbucks')) {
        parsedTitle = 'Starbucks Coffee';
        parsedMerchant = 'Starbucks';
        matchedCategory = 'Food';
      } else if (lowerText.includes('mcdonald')) {
        parsedTitle = 'McDonalds';
        parsedMerchant = 'McDonalds';
        matchedCategory = 'Food';
      } else if (lowerText.includes('domino')) {
        parsedTitle = 'Domino\'s Pizza';
        parsedMerchant = 'Domino\'s';
        matchedCategory = 'Food';
      } else if (lowerText.includes('swiggy')) {
        parsedTitle = 'Swiggy Order';
        parsedMerchant = 'Swiggy';
        matchedCategory = 'Food';
      } else if (lowerText.includes('zomato')) {
        parsedTitle = 'Zomato Order';
        parsedMerchant = 'Zomato';
        matchedCategory = 'Food';
      } else if (lowerText.includes('uber')) {
        parsedTitle = 'Uber Ride';
        parsedMerchant = 'Uber';
        matchedCategory = 'Transport';
      } else if (lowerText.includes('amazon')) {
        parsedTitle = 'Amazon Purchase';
        parsedMerchant = 'Amazon';
        matchedCategory = 'Shopping';
      }

      // Fallback first line title extraction
      if (!parsedTitle) {
        const lines = text.split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0 && !l.toLowerCase().match(/making india beautiful|future retail|tax invoice|invoice|welcome|receipt|bill no/));
        
        parsedTitle = lines[0] || 'Scanned Expense';
        if (parsedTitle.length > 30) parsedTitle = parsedTitle.substring(0, 30);
        parsedMerchant = parsedTitle;

        // Auto Category mapping
        const lowerTitle = parsedTitle.toLowerCase();
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
        }
      }

      // Detect Payment Method
      let parsedPaymentMethod = 'UPI';
      if (lowerText.includes('cash')) {
        parsedPaymentMethod = 'Cash';
      } else if (lowerText.includes('card') || lowerText.includes('credit') || lowerText.includes('debit')) {
        parsedPaymentMethod = 'Credit Card';
      } else if (lowerText.includes('wallet') || lowerText.includes('paytm') || lowerText.includes('gpay')) {
        parsedPaymentMethod = 'Wallet';
      } else if (lowerText.includes('netbanking') || lowerText.includes('transfer')) {
        parsedPaymentMethod = 'Bank Transfer';
      }

      setTitle(parsedTitle);
      if (parsedAmount) setAmount(parsedAmount);
      setExpenseDate(parsedDate);
      setCategory(matchedCategory);
      setMerchant(parsedMerchant);
      setPaymentMethod(parsedPaymentMethod);
      setDescription('Scanned via Tesseract OCR.');
      setScanSuccess(true);

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
      setMerchant(initialData.merchant || '');
      setPaymentMethod(initialData.payment_method || 'UPI');
    } else {
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setMerchant('');
      setPaymentMethod('UPI');
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
      description,
      merchant: merchant || 'Unknown Merchant',
      payment_method: paymentMethod
    });

    if (!initialData) {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setMerchant('');
      setPaymentMethod('UPI');
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

      {!initialData && receiptPreview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Receipt Image Preview:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={receiptPreview} alt="Receipt" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }} />
            {scanSuccess ? (
              <span style={{ fontSize: '12.5px', color: 'var(--success)', fontWeight: '600' }}>
                ✓ Autofilled: "{title}" {amount ? `(${amount})` : ''}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {scanning ? 'Extracting details...' : 'Image loaded.'}
              </span>
            )}
          </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Merchant</label>
          <input 
            type="text" 
            value={merchant} 
            onChange={(e) => setMerchant(e.target.value)} 
            className="form-control" 
            placeholder="e.g. Swiggy, Amazon"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="form-control"
          >
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Wallet">Wallet</option>
            <option value="Bank Transfer">Bank Transfer</option>
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
