import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AIChatbot({ expenses, budget, currency = '₹', goals = [], recurring = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey there! I am your CASHLENS AI Coach. Ask me anything about your student spending logs!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Capture snapshot of history before state updates asynchronously
    const currentHistory = [...messages];

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    try {
      const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const categoryTotals = {};
      expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
      });

      const context = {
        currency,
        monthlyBudget: budget,
        totalSpent,
        categoryTotals,
        goals,
        recurring
      };

      const { data, error: invokeError } = await supabase.functions.invoke('ai-chat', {
        body: { query, chatHistory: currentHistory, context }
      });

      if (invokeError) throw invokeError;

      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || "Coach offline. Let's try again in a bit!" }]);
    } catch (err) {
      console.error("AI Coach Error:", err);
      const errMsg = err?.message || JSON.stringify(err);
      setMessages(prev => [...prev, { sender: 'bot', text: `AI Coach offline (${errMsg}). Let's try again in a bit!` }]);
    } finally {
      setIsTyping(false);
    }
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
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '4px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{ background: 'var(--primary-glow)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Bot size={16} />
                  </div>
                )}
                <div
                  style={{
                    background: m.sender === 'bot' ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: m.sender === 'bot' ? 'var(--text-primary)' : '#0f172a',
                    border: m.sender === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    padding: '10px 14px',
                    borderRadius: m.sender === 'bot' ? '0px 16px 16px 16px' : '16px 16px 0px 16px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                <div style={{ background: 'var(--primary-glow)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <Bot size={16} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '0px 16px 16px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                  <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }}></span>
                </div>
              </div>
            )}

            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1.0); }
              }
            `}</style>
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
