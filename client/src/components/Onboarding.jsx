import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Landmark, ShieldCheck } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(8000);
  const [currency, setCurrency] = useState('₹');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ budget: parseFloat(budget), currency });
    }
  };

  const getStepHeader = () => {
    switch(step) {
      case 1: return "📊 Establish Monthly Spending Goal";
      case 2: return "💱 Select Preferred Currency";
      case 3: return "🚀 Ready to Crush Budgets?";
      default: return "Onboarding";
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass animated" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Setup Wizard (Step {step}/3)
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '20px', height: '4px', background: step >= 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <span style={{ width: '20px', height: '4px', background: step >= 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <span style={{ width: '20px', height: '4px', background: step >= 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </div>
        </div>

        <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>{getStepHeader()}</h2>

        {step === 1 && (
          <div className="animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Define a realistic monthly budget ceiling. We'll send real-time warning indicators as you approach limit thresholds.
            </p>
            <div className="form-group">
              <label className="form-label">Monthly Target Limit</label>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
                className="form-control"
                placeholder="e.g. 8000"
                min="1"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Choose the default currency symbol to format all metric dashboards and expenditures.
            </p>
            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                className="form-control"
              >
                <option value="₹">₹ (INR - Rupee)</option>
                <option value="$">$ (USD - Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - Pound)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Check size={16} className="text-cyan-500" style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <span style={{ fontSize: '13.5px' }}><strong>Track Daily Spending</strong>: Log expenses instantly on the go.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Check size={16} className="text-cyan-500" style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <span style={{ fontSize: '13.5px' }}><strong>Analyze Savings</strong>: Unveil smart AI budget recommendations.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Check size={16} className="text-cyan-500" style={{ color: 'var(--primary)', marginTop: '2px' }} />
                <span style={{ fontSize: '13.5px' }}><strong>Earn Milestones</strong>: Claim saver streaks and gamification badges.</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleNext} 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '28px', justifyContent: 'center' }}
        >
          {step === 3 ? "Start Crushing!" : "Continue"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
