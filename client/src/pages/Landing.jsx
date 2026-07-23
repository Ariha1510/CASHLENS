import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Zap, Award, Check, DollarSign } from 'lucide-react';

export default function Landing({ user }) {
  const features = [
    { title: "AI Financial Coach", desc: "Get real-time insights, overspending predictions, and advice about your allowance.", icon: <Sparkles size={24} /> },
    { title: "OCR Receipt Scanning", desc: "Snap a photo of your receipt to auto-fill description, amount, and category instantly.", icon: <Zap size={24} /> },
    { title: "Gamified Savings", desc: "Maintain saving streaks, complete challenges, and claim vouchers like Domino's.", icon: <Award size={24} /> },
    { title: "Data Security First", desc: "Isolate your records using Supabase Row Level Security (RLS) policies.", icon: <Shield size={24} /> }
  ];

  const faqs = [
    { q: "Is CashCrush free for students?", a: "Yes, our core tier is 100% free for students to build healthy habits." },
    { q: "Can I connect my bank account?", a: "CashCrush supports mock statement CSV imports to securely track transaction feeds." },
    { q: "Can I export my financial data?", a: "Yes, you can export your records as CSV files whenever you like." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '100px 20px 60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ background: 'var(--primary-glow)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          Smart Financial Companion for Students
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', maxWidth: '800px', margin: 0, fontFamily: 'var(--font-family-title)' }}>
          Crush Your Budget, <span style={{ color: 'var(--primary)' }}>Multiply</span> Your Savings.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: 0 }}>
          An AI-powered personal finance assistant designed to help students track spending, avoid debt, and earn rewards for healthy saving habits.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Why Section */}
      <section className="glass animated" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>🚀 Why CashCrush?</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 32px auto', fontSize: '14.5px', lineHeight: '1.6' }}>
          Traditional budget trackers are boring. CashCrush makes finance interactive with real-time AI spending diagnostics, receipt metadata extraction, saving streaks, and virtual gift vouchers.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {features.map(f => (
            <div key={f.title} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: 'var(--primary)', display: 'inline-flex' }}>{f.icon}</div>
              <h4 style={{ fontWeight: '700', fontSize: '16px' }}>{f.title}</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mock Pricing Section */}
      <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Simple Student Pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Free Tier */}
          <div className="glass animated" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px' }}>Basic Free</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Perfect for basic logging.</p>
              <h2 style={{ fontSize: '36px', marginTop: '16px' }}>₹0 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ month</span></h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> Manual Expense Tracking</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> Basic Analytics Reports</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> 3 Savings Target Goals</li>
            </ul>
            <Link to="/register" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>Get Started</Link>
          </div>

          {/* Premium Tier */}
          <div className="glass animated" style={{ padding: '32px', border: '1px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary)', color: '#000', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>POPULAR</span>
            <div>
              <h3 style={{ fontSize: '20px' }}>Premium Scholar</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Unleash smart AI diagnostics.</p>
              <h2 style={{ fontSize: '36px', marginTop: '16px' }}>₹99 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ month</span></h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> Unlimited OCR Receipt Scans</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> AI Conversational Assistant</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> Auto CSV Statement Importer</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}><Check size={16} style={{ color: 'var(--success)' }} /> Advanced Premium Themes</li>
            </ul>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>Upgrade Now</Link>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass animated" style={{ padding: '20px' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '14.5px' }}>{faq.q}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '24px', marginTop: '40px' }}>
        <p>© 2026 CashCrush Inc. Built with love for students. All rights reserved.</p>
      </footer>
    </div>
  );
}
