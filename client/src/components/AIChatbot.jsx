import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

export default function AIChatbot({ expenses, budget, currency = '₹' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey there! I am your CASHCRUSH AI Coach. Ask me anything about your student spending logs!' }
  ]);
  const [input, setInput] = useState('');

  const analyzeData = (query) => {
    const q = query.toLowerCase();
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    // Category totals
    const categories = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
    });

    if (q.includes('pizza') || q.includes('order food') || q.includes('can i order')) {
      const foodLimit = budget * 0.35; // 35% suggested food budget
      const foodSpent = categories['Food'] || 0;
      const pizzaCost = 450;
      const remainingFood = foodLimit - foodSpent;
      const pctUsed = foodLimit > 0 ? (foodSpent / foodLimit) * 100 : 0;

      if (pctUsed > 75) {
        return `You've already spent ${pctUsed.toFixed(0)}% of your food budget. Ordering this ${currency}${pizzaCost} pizza will leave only ${currency}${(remainingFood - pizzaCost).toFixed(0)} for the rest of the month. Recommendation: Wait until next week.`;
      } else {
        return `You have ${currency}${remainingFood.toFixed(0)} remaining in your food allowance. You can afford this ${currency}${pizzaCost} pizza, but eating at home will help you earn more streak points!`;
      }
    }

    if (q.includes('why') || q.includes('spend so much') || q.includes('overspend')) {
      if (expenses.length === 0) return "You haven't logged any expenses yet! Add transactions on the Expenses page so I can analyze them.";
      // Find top category
      let topCat = '';
      let maxVal = 0;
      Object.entries(categories).forEach(([cat, val]) => {
        if (val > maxVal) {
          maxVal = val;
          topCat = cat;
        }
      });
      return `Your primary spending category is ${topCat} with a total of ${currency}${maxVal.toFixed(2)} (${((maxVal/totalSpent)*100).toFixed(0)}% of total spend). Try scaling back on ${topCat} to save allowance!`;
    }

    if (q.includes('save') || q.includes('how to save')) {
      const target = q.match(/\d+/) ? q.match(/\d+/)[0] : '1000';
      return `To save ${currency}${target} this month, try adjusting non-essential budgets. For instance, trimming 20% off your 'Shopping' or 'Entertainment' transactions will yield immediate results.`;
    }

    if (q.includes('biggest') || q.includes('highest') || q.includes('large')) {
      if (expenses.length === 0) return "No transactions found.";
      const sorted = [...expenses].sort((a,b) => parseFloat(b.amount) - parseFloat(a.amount));
      const biggest = sorted[0];
      return `Your highest individual expense is "${biggest.title}" costing ${currency}${parseFloat(biggest.amount).toFixed(2)} in the category "${biggest.category}".`;
    }

    if (q.includes('compare') || q.includes('difference') || q.includes('last month')) {
      // Mock month comparisons using date calculations
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentMonthSpend = expenses
        .filter(e => new Date(e.expense_date).getMonth() === currentMonth)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

      const lastMonthSpend = expenses
        .filter(e => new Date(e.expense_date).getMonth() === (currentMonth - 1 + 12) % 12)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

      if (lastMonthSpend === 0) {
        return `You spent ${currency}${currentMonthSpend.toFixed(2)} this month. I don't have enough history for last month to draw a comparison.`;
      }
      const diff = currentMonthSpend - lastMonthSpend;
      const pct = (diff / lastMonthSpend) * 100;
      return `You spent ${currency}${currentMonthSpend.toFixed(2)} this month compared to ${currency}${lastMonthSpend.toFixed(2)} last month. That's a ${Math.abs(pct).toFixed(0)}% ${pct >= 0 ? 'increase' : 'decrease'}!`;
    }

    return "I can help analyze your spending! Try asking:\n- 'Why did I spend so much?'\n- 'How can I save ₹1000?'\n- 'Show me my biggest expenses.'\n- 'Compare this month with last month.'";
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInput('');

    setTimeout(() => {
      const response = analyzeData(query);
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          padding: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px var(--primary-glow)'
        }}
        title="AI Financial Coach"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Drawer Overlay */}
      {isOpen && (
        <div 
          className="glass animated"
          style={{
            position: 'fixed',
            bottom: '96px',
            left: '24px',
            width: '360px',
            height: '480px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-neon)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: '700', fontSize: '15px' }}>AI Financial Coach</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', paddingRight: '4px' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end',
                  background: m.sender === 'bot' ? 'rgba(255,255,255,0.03)' : 'var(--primary-glow)',
                  border: `1px solid ${m.sender === 'bot' ? 'var(--border-glass)' : 'var(--primary)'}`,
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <button 
              onClick={() => handleSend("Why did I spend so much?")}
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Why did I spend so much?
            </button>
            <button 
              onClick={() => handleSend("How can I save ₹1000?")}
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              How can I save?
            </button>
          </div>

          {/* Input field */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              placeholder="Ask advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
            <button 
              onClick={() => handleSend()}
              className="btn btn-primary"
              style={{ padding: '8px 12px' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
