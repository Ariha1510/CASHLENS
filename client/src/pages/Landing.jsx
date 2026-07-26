import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Award, ArrowRight } from 'lucide-react';

export default function Landing({ user }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    { 
      title: "🤖 AI Financial Coach", 
      desc: "Get personalized spending analyses and overspending risk forecasts based on your targets, instead of guessing.", 
      icon: <Sparkles size={24} /> 
    },
    { 
      title: "📷 OCR Receipt Scanner", 
      desc: "Instantly extract merchant, category, and total payable amount with our verification confirmation step.", 
      icon: <Zap size={24} /> 
    },
    { 
      title: "🎁 Intelligent Rewards", 
      desc: "Maintain streaks and complete challenges (like No Fast Food) to claim actual Domino's and coffee vouchers.", 
      icon: <Award size={24} /> 
    }
  ];

  const faqs = [
    { q: "Is Daily Expense Tracker free to use?", a: "Yes! CASHLENS is 100% free and open-source for all college students." },
    { q: "Can I import my bank statements?", a: "Yes, you can import transaction history using standard CSV statement files." },
    { q: "Does it work on mobile devices?", a: "Absolutely! The web app is fully responsive and can be added directly to your home screen." },
    { q: "What features does the AI chat offer?", a: "The AI coach analyzes your spending, projects saving goals, and gives smart budget tips." },
    { q: "Is my financial data secure?", a: "Yes, all your records are stored securely with Supabase database integrations." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '80px 20px 40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--primary-glow)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          Smart Financial Companion for Students
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.2', maxWidth: '800px', margin: 0, fontFamily: 'var(--font-family-title)' }}>
          Take Control of Your Student Finances with <span style={{ color: 'var(--primary)' }}>CASHLENS</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '600px', margin: 0, lineHeight: '1.6' }}>
          Stop worrying about allowance limits. Monitor your student expenses, calculate saving goals with AI, and get rewarded for keeping your budget on track.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14.5px' }}>
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '14.5px' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Interactive Feature Cards */}
      <section className="glass animated" style={{ padding: '32px', maxWidth: '960px', margin: '0 auto', width: '90%' }}>
        <h2 style={{ fontSize: '26px', marginBottom: '12px', textAlign: 'center' }}>🔥 Curated Student Features</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 28px auto', textAlign: 'center', fontSize: '14px', lineHeight: '1.5' }}>
          Tailored tools designed to align your weekly allowances with real-world goals without manual complexity.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map(f => (
            <div key={f.title} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: 'var(--primary)', display: 'inline-flex' }}>{f.icon}</div>
              <h4 style={{ fontWeight: '700', fontSize: '15.5px', margin: 0 }}>{f.title}</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '90%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '26px' }}>🛠️ How It Works</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>Four simple steps to financial freedom.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto', fontWeight: '800' }}>1</div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Set Budget</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Input your monthly allowance ceiling.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto', fontWeight: '800' }}>2</div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Track Spend</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Log expenses or scan receipt bills.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto', fontWeight: '800' }}>3</div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>AI Optimization</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Let our assistant advise limits.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto', fontWeight: '800' }}>4</div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Earn Rewards</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Unlock streaks and claim vouchers.</p>
          </div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="glass animated" style={{ padding: '40px 32px', maxWidth: '960px', margin: '0 auto', width: '90%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Everything You Need</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '6px', maxWidth: '600px', margin: '6px auto 0 auto' }}>
            A complete personal finance toolkit - from daily expenses to long-term wealth tracking.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>💰</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Expense Tracking</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Track daily expenses with ease</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Real-time Dashboard</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Instant insights into spending</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>🏷️</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Category Management</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Organize expenses by category</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>🔄</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Recurring Expenses</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Track subscriptions & bills</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>🎯</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Budgets</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Set monthly budget limits</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>🧠</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>AI Chat Insights</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Ask AI about your finances</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Stats & Reports</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Detailed spending analytics</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>💾</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Import Statements</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Import transaction CSV data</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '24px' }}>☁️</span>
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Cloud Sync</h4>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>Access securely from any device</p>
          </div>
        </div>
      </section>

      {/* Install as App */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '90%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Install as App</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginTop: '6px' }}>
            Get the full app experience on your device. No app store needed - install directly from your browser.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass animated" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: 'var(--primary)' }}>iPhone / iPad (Safari)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: '1.4' }}>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--primary)' }}>1</strong> <span>Open this website in Safari browser</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--primary)' }}>2</strong> <span>Tap the Share button (square with arrow)</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--primary)' }}>3</strong> <span>Scroll down and tap "Add to Home Screen"</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--primary)' }}>4</strong> <span>Tap "Add" to install</span></div>
            </div>
          </div>
          <div className="glass animated" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: 'var(--secondary)' }}>Android (Chrome)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: '1.4' }}>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--secondary)' }}>1</strong> <span>Open this website in Chrome browser</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--secondary)' }}>2</strong> <span>Tap the three-dot menu (top right)</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--secondary)' }}>3</strong> <span>Tap "Add to Home screen" or "Install app"</span></div>
              <div style={{ display: 'flex', gap: '10px' }}><strong style={{ color: 'var(--secondary)' }}>4</strong> <span>Tap "Add" or "Install"</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '90%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '26px' }}>Frequently Asked Questions</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '28px', fontSize: '14.5px' }}>
          Everything you need to know about Daily Expense Tracker.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass animated" 
              style={{ padding: '16px 20px', cursor: 'pointer', borderRadius: '12px' }}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{faq.q}</h4>
                <span style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: 'bold' }}>{activeFaq === idx ? '−' : '+'}</span>
              </div>
              {activeFaq === idx && (
                <p style={{ margin: '12px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Creator Info */}
      <section style={{ maxWidth: '800px', margin: '0 auto', width: '90%' }}>
        <div className="glass animated" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
          <div style={{ background: 'var(--primary-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'var(--primary)', flexShrink: 0 }}>
            👤
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>👋 Hey, I'm Ariha</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              I built Daily Expense Tracker for students as a project to solve their expense tracking problems. Wishing you guys a wonderful experience!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('Terms & Conditions coming soon!')}>Terms & Conditions</span>
          <span>•</span>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('Privacy Policy coming soon!')}>Privacy Policy</span>
          <span>•</span>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('About Creator coming soon!')}>About Creator</span>
          <span>•</span>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('Changelog coming soon!')}>Changelog</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: 0 }}>
          © 2026 All rights reserved.
        </p>
      </footer>

    </div>
  );
}
