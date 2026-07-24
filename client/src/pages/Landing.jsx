import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Award, Check, DollarSign, ArrowRight, ShieldCheck, PieChart } from 'lucide-react';

export default function Landing({ user }) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '80px 20px 40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--primary-glow)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          Smart Financial Companion for Students
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.2', maxWidth: '800px', margin: 0, fontFamily: 'var(--font-family-title)' }}>
          Take Control of Your Student Finances with <span style={{ color: 'var(--primary)' }}>CASHCRUSH</span>
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

      {/* Dashboard Preview block */}
      <section className="glass animated" style={{ maxWidth: '960px', margin: '0 auto', width: '90%', padding: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>⚡ Premium Dashboard Interface Preview</h3>
        <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', background: '#0a0f1d', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>CASHCRUSH LIVE FEED</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status: Active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#13192b', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Spent This Month</p>
              <p style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>₹4,200.00</p>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#13192b', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Est. Remaining</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--success)', margin: 0 }}>₹3,800.00</p>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#13192b', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0' }}>Streak Multiplier</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--warning)', margin: 0 }}>1.2x Coins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '20px' }}>
        <p>© 2026 CASHCRUSH Inc. Built with love for students. All rights reserved.</p>
      </footer>
    </div>
  );
}
