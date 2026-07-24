import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BudgetCard from '../components/BudgetCard';
import SavingsGoals from '../components/SavingsGoals';
import RecurringList from '../components/RecurringList';
import Gamification from '../components/Gamification';
import AIChatbot from '../components/AIChatbot';
import CashbackVault from '../components/CashbackVault';
import SkeletonLoader from '../components/SkeletonLoader';
import { IndianRupee, Landmark, TrendingUp, Calendar, AlertCircle, Sparkles, Info, ShieldAlert, Award, Camera, Plus, FileSpreadsheet, ArrowUpRight, CheckCircle } from 'lucide-react';

export default function Dashboard({ 
  expenses = [], 
  budget, 
  loading, 
  error, 
  currency = '₹',
  goals = [],
  recurring = [],
  badges = [],
  onAddGoal,
  onAddSavings,
  onAddRecurring,
  onDeleteRecurring
}) {
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0);
  const [todaySpent, setTodaySpent] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setTotalSpent(total);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTotal = expenses
      .filter(exp => exp.expense_date === todayStr)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setTodaySpent(todayTotal);
  }, [expenses]);

  const healthScore = useMemo(() => {
    let score = 85;
    if (totalSpent > budget) {
      score -= Math.min(45, ((totalSpent - budget) / budget) * 100);
    } else if (budget > 0) {
      const unused = (budget - totalSpent) / budget;
      score += Math.min(10, unused * 10);
    }
    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0);
    if (totalSaved > 0) {
      score += Math.min(15, (totalSaved / 5000) * 15);
    }
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [totalSpent, budget, goals]);

  const healthLevel = useMemo(() => {
    if (healthScore >= 80) return 'Excellent ★★★★★';
    if (healthScore >= 65) return 'Good ★★★★☆';
    if (healthScore >= 45) return 'Average ★★★☆☆';
    return 'Poor ★★☆☆☆';
  }, [healthScore]);

  // Linear Month-End projection
  const prediction = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyAvg = currentDay > 0 ? totalSpent / currentDay : 0;
    const projected = dailyAvg * daysInMonth;
    const risk = projected > budget ? 'High' : (projected > budget * 0.7 ? 'Medium' : 'Low');

    return {
      dailyAvg,
      projected,
      risk
    };
  }, [totalSpent, budget]);

  // AI spending insights
  const insights = useMemo(() => {
    const list = [];
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });

    if (budget > 0) {
      const percentage = (totalSpent / budget) * 100;
      if (percentage >= 90) {
        list.push({ type: 'warning', text: `⚠️ You've spent ${percentage.toFixed(0)}% of your monthly budget. Urgently reduce shopping/leisure expenses!` });
      } else {
        list.push({ type: 'info', text: `🍔 Food accounts for ${((categoryTotals['Food'] || 0) / (totalSpent || 1) * 100).toFixed(0)}% of your allowance.` });
      }
    }

    if (prediction.risk === 'High') {
      list.push({ type: 'warning', text: `⚠️ Alert: Continuing at this rate, you're projected to exceed your budget ceiling by ${currency}${(prediction.projected - budget).toFixed(0)}.` });
    }

    if (categoryTotals['Entertainment'] > 500) {
      list.push({ type: 'success', text: `💡 Tip: Reducing entertainment spending by ${currency}500 keeps you within your safe budget zone.` });
    }

    return list;
  }, [expenses, budget, totalSpent, prediction, currency]);

  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [insights]);

  if (loading) {
    return <SkeletonLoader type="dashboard" />;
  }

  const remaining = budget - totalSpent;
  const streakDays = expenses.length > 0 ? Math.min(expenses.length, 7) : 0;
  const hasData = expenses && expenses.length > 0;

  // New User Layout
  if (!hasData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Welcome Hero banner */}
        <div className="glass animated" style={{ padding: '32px', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>👋 Welcome to CASHCRUSH, Ariha!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>Let's build smarter money habits together. You've just started your financial journey.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/expenses')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13.5px' }}>
              <Plus size={16} /> Add Expense
            </button>
            <button onClick={() => navigate('/expenses')} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13.5px' }}>
              <Camera size={16} /> Scan Receipt
            </button>
          </div>
        </div>

        <div className="grid-cols-2">
          {/* Budget Card */}
          <div className="glass animated">
            <h3 style={{ marginBottom: '16px' }}>Monthly Budget Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Budget</span>
                <p style={{ fontSize: '18px', fontWeight: '700', margin: '4px 0 0 0' }}>{currency}{budget}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Spent</span>
                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', margin: '4px 0 0 0' }}>{currency}0</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remaining</span>
                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--success)', margin: '4px 0 0 0' }}>{currency}{budget}</p>
              </div>
            </div>
            <div className="progress-bar-container" style={{ height: '8px', marginBottom: '12px' }}>
              <div className="progress-bar green" style={{ width: '0%' }}></div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              💡 Great start! Your entire monthly budget is available.
            </p>
          </div>

          {/* Getting Started Checklist */}
          <div className="glass animated">
            <h3 style={{ marginBottom: '16px' }}>Getting Started Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>☐</span> <span>Add your first expense</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>☐</span> <span>Set your first savings goal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>☐</span> <span>Scan a receipt</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>☐</span> <span>Import your bank CSV</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>☐</span> <span>Ask the AI Coach a question</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-cols-2">
          {/* AI Welcome Card */}
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BotIcon size={20} /> AI Coach Welcome
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)', margin: 0 }}>
              Hello Ariha 👋, I am your financial coach. I can help you create custom budgets, predict overspending, track recurring commitments, and earn rewards.
            </p>
            <p style={{ fontSize: '12.5px', color: 'var(--primary)', margin: 0 }}>
              Try asking me: <em>"How should I split my ₹{budget} budget?"</em>
            </p>
          </div>

          {/* Rewards Journey */}
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3>Your Rewards Journey</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Coins:</span>
              <span style={{ fontWeight: '700' }}>0 Coins</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Next Achievement:</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>First Expense Badge</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completion Reward:</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>+50 Coins</span>
            </div>
          </div>
        </div>

        <div className="grid-cols-2">
          {/* Empty Savings target */}
          <div className="glass animated">
            <h3 style={{ marginBottom: '12px' }}>Savings Goals Targets</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>No goals configured yet. What are you saving for?</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['💻 Laptop', '✈️ Trip', '📚 Fees', '🚲 Bike'].map(item => (
                <span key={item} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12.5px' }}>
                  {item}
                </span>
              ))}
            </div>
            <button onClick={() => navigate('/budget')} className="btn btn-secondary" style={{ width: '100%' }}>Create Goal</button>
          </div>

          {/* Empty Activity & Analytics */}
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>📊 Analytics Placeholder</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>Charts and reports will appear here once you log a few expenses.</p>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>💸 Recent Activity</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>No transactions yet. Once you add expenses, they will appear here.</p>
            </div>
          </div>
        </div>

        <AIChatbot expenses={expenses} budget={budget} currency={currency} />
      </div>
    );
  }

  // Dashboard with data (Existing User Layout)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time statistics of your student expenditures.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/expenses')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12.5px' }}>
            <Plus size={15} /> Add Expense
          </button>
          <button onClick={() => navigate('/expenses')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12.5px' }}>
            <Camera size={15} /> Scan Receipt
          </button>
          <button onClick={() => {
            const el = document.getElementById('savings-goals-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12.5px' }}>
            <Award size={15} /> Add Goal
          </button>
          <button onClick={() => navigate('/expenses')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12.5px' }}>
            <FileSpreadsheet size={15} /> Import CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="insight-alert insight-alert-warning">
          <AlertCircle size={20} />
          <span>Error loading metrics: {error}</span>
        </div>
      )}

      {/* Today's Focus Card */}
      <div className="glass animated" style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sparkles size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <p style={{ fontSize: '13px', margin: 0, fontWeight: '500' }}>
          <strong>Today's Focus:</strong> You're on track to save {currency}{Math.round(remaining > 0 ? remaining * 0.9 : 0)} this month. Keep it up!
        </p>
      </div>

      {/* Row 1: Spent, Remaining, Health Score, Compact Cashback Coins */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {/* Spent */}
        <div onClick={() => navigate('/expenses')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(219, 39, 119, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--secondary)' }}>
            <IndianRupee size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spent</span>
            <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>{currency}{totalSpent.toFixed(0)}</p>
          </div>
        </div>

        {/* Est. Remaining */}
        <div onClick={() => navigate('/budget')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Remaining</span>
            <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0', color: 'var(--success)' }}>{currency}{(remaining > 0 ? Math.round(remaining) : 0)}</p>
          </div>
        </div>

        {/* Health Score */}
        <div onClick={() => navigate('/reports')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Health Score</span>
            <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>{healthScore} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span></p>
          </div>
        </div>

        {/* Compact Cashback Coins */}
        <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--warning)' }}>
            <span style={{ fontSize: '20px' }}>🪙</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CashCoins</span>
            <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0', color: 'var(--warning)' }}>2,400 Coins</p>
          </div>
        </div>
      </div>

      {/* Row 2: Budget Progress, Month-End Prediction */}
      <div className="grid-cols-2">
        <BudgetCard budget={budget} spent={totalSpent} />
        
        {/* Month-End Prediction */}
        <div className="glass animated">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Month-End Projection
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Predicted Month-End Total:</span>
              <strong style={{ color: prediction.risk === 'High' ? 'var(--danger)' : 'var(--success)' }}>{currency}{prediction.projected.toFixed(0)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Risk Assessment:</span>
              <strong style={{ color: prediction.risk === 'High' ? 'var(--danger)' : 'var(--success)' }}>{prediction.risk} Risk</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Spending Story, AI Coach Carousel */}
      <div className="grid-cols-2">
        {/* Compact Spending Story */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--secondary)' }} /> Spending Story
            </h3>
            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
              This month, your <strong>Food</strong> spending decreased by <strong style={{ color: 'var(--success)' }}>18%</strong>. The decrease mainly came from fewer restaurant visits. You saved <strong>{currency}620</strong> more than last month.
            </p>
          </div>
          <button onClick={() => navigate('/reports')} className="btn btn-secondary" style={{ padding: '6px', fontSize: '11px', alignSelf: 'flex-start', marginTop: '12px' }}>
            Read Full Analysis →
          </button>
        </div>

        {/* Explainable Insights Carousel */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} /> AI Coach Insights
            </h3>
            {insights.length > 0 ? (
              <div className="insight-alert animated" key={insightIndex} style={{ margin: 0, padding: '10px 14px', borderRadius: '12px', background: 'rgba(6,182,212,0.06)', border: '1px solid var(--primary)' }}>
                <span style={{ fontSize: '13px' }}>{insights[insightIndex].text}</span>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Healthy spending habits detected.</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
            {insights.map((_, idx) => (
              <div key={idx} onClick={() => setInsightIndex(idx)} style={{ width: '6px', height: '6px', borderRadius: '50%', background: idx === insightIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: AI Challenges & Achievements */}
      <div className="grid-cols-2">
        {/* Compact Challenges */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: 'var(--primary)' }} /> Active Challenge
            </h3>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '13px', margin: 0 }}>🍔 No Fast Food Online</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>3 Days left</p>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>+150 Coins</span>
            </div>
          </div>
          <button onClick={() => navigate('/budget')} className="btn btn-secondary" style={{ padding: '6px', fontSize: '11px', alignSelf: 'flex-start', marginTop: '12px' }}>
            View More Challenges →
          </button>
        </div>

        {/* Compact Achievements */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Achievements
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              You have unlocked <strong>{badges.length} Badges</strong>. Keep building streaks to unlock premium rewards!
            </p>
          </div>
          <button onClick={() => navigate('/budget')} className="btn btn-secondary" style={{ padding: '6px', fontSize: '11px', alignSelf: 'flex-start', marginTop: '12px' }}>
            View Badges →
          </button>
        </div>
      </div>

      {/* Row 5: Savings Goals & Compact Vault */}
      <div id="savings-goals-section" className="grid-cols-2">
        <SavingsGoals goals={goals} onAddGoal={onAddGoal} onAddSavings={onAddSavings} currency={currency} />
        
        {/* Compact Cashback Vault */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3>Cashback Vault</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wallet Balance</span>
              <p style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0' }}>{currency}120.00</p>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Coins Earned</span>
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--warning)', margin: '4px 0 0 0' }}>2,400 Coins</p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            🎉 You are only <strong>600 Coins away</strong> from claiming your next Domino's voucher reward!
          </p>
        </div>
      </div>

      {/* Row 6: Subscriptions */}
      <div>
        <RecurringList recurring={recurring} onAddRecurring={onAddRecurring} onDeleteRecurring={onDeleteRecurring} currency={currency} />
      </div>

      <AIChatbot expenses={expenses} budget={budget} currency={currency} />
    </div>
  );
}

// BotIcon Helper
function BotIcon({ size = 20 }) {
  return (
    <div style={{ background: 'var(--primary-glow)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
      <Sparkles size={size * 0.7} />
    </div>
  );
}
