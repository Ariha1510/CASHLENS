import React, { useState, useEffect, useMemo } from 'react';
import BudgetCard from '../components/BudgetCard';
import SavingsGoals from '../components/SavingsGoals';
import RecurringList from '../components/RecurringList';
import Gamification from '../components/Gamification';
import AIChatbot from '../components/AIChatbot';
import CashbackVault from '../components/CashbackVault';
import { IndianRupee, Landmark, TrendingUp, Calendar, AlertCircle, Sparkles, Info, ShieldAlert, Award } from 'lucide-react';

export default function Dashboard({ 
  expenses, 
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
  const [totalSpent, setTotalSpent] = useState(0);
  const [todaySpent, setTodaySpent] = useState(0);

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

  const recommendedBudgets = useMemo(() => {
    return [
      { category: 'Food & Drinks', amount: budget * 0.35 },
      { category: 'Transport', amount: budget * 0.15 },
      { category: 'Shopping', amount: budget * 0.12 },
      { category: 'Bills', amount: budget * 0.18 },
      { category: 'Emergency Savings', amount: budget * 0.20 }
    ];
  }, [budget]);

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

  // AI-powered spending insights
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
      const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
      list.push({ type: 'warning', text: `⚠️ Alert: Continuing at this rate, you're projected to exceed your budget ceiling by ${currency}${(prediction.projected - budget).toFixed(0)}.` });
    }

    if (categoryTotals['Entertainment'] > 500) {
      list.push({ type: 'success', text: `💡 Tip: Reducing entertainment spending by ${currency}500 keeps you within your safe budget zone.` });
    }

    return list;
  }, [expenses, budget, totalSpent, prediction, currency]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Synching with Supabase logs...</p>
      </div>
    );
  }

  const remaining = budget - totalSpent;
  const streakDays = expenses.length > 0 ? Math.min(expenses.length, 7) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time statistics of your student expenditures.</p>
      </div>

      {error && (
        <div className="insight-alert insight-alert-warning">
          <AlertCircle size={20} />
          <span>Error loading metrics: {error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid-cols-3">
        {/* Spent */}
        <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: 'rgba(219, 39, 119, 0.1)', 
            border: '1px solid rgba(219, 39, 119, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--secondary)',
            display: 'flex'
          }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Spent</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>
              {currency}{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Today's Spending */}
        <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: 'rgba(6, 182, 212, 0.1)', 
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--primary)',
            display: 'flex'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Today's Spent</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>
              {currency}{todaySpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: remaining >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: `1px solid ${remaining >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '12px',
            padding: '12px',
            color: remaining >= 0 ? 'var(--success)' : 'var(--danger)',
            display: 'flex'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Remaining Limit</span>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              marginTop: '4px',
              color: remaining < 0 ? 'var(--danger)' : 'var(--success)'
            }}>
              {currency}{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Progress, AI Coach, and linear predictors */}
      <div className="grid-cols-2">
        <BudgetCard budget={budget} spent={totalSpent} />

        {/* Linear Month-End Predictor */}
        <div className="glass animated">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-primary" style={{ color: 'var(--primary)' }} /> Month-End Projection
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Average Daily Spend:</span>
              <span style={{ fontWeight: '600' }}>{currency}{prediction.dailyAvg.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Predicted Month-End Total:</span>
              <span style={{ fontWeight: '700', color: prediction.risk === 'High' ? 'var(--danger)' : 'var(--success)' }}>
                {currency}{prediction.projected.toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Exceeding Risk Level:</span>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '16px', 
                fontSize: '12px', 
                fontWeight: '700',
                background: prediction.risk === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: prediction.risk === 'High' ? 'var(--danger)' : 'var(--success)',
                border: `1px solid ${prediction.risk === 'High' ? 'var(--danger)' : 'var(--success)'}`
              }}>
                {prediction.risk}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health & Smart Recommendations */}
      <div className="grid-cols-2">
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} /> Financial Health Score
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
            <div>
              <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>
                {healthScore} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ 100</span>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Habits: <strong style={{ color: 'var(--text-primary)' }}>{healthLevel}</strong>
              </p>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
              <span>• Stayed under budget</span>
              <span>• Active savings target</span>
              <span>• Low impulse spend</span>
            </div>
          </div>
        </div>

        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={20} className="text-primary" style={{ color: 'var(--primary)' }} /> Smart Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendedBudgets.map(rec => (
              <div key={rec.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{rec.category}</span>
                <span style={{ fontWeight: '600' }}>{currency}{rec.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights & Achievements */}
      <div className="grid-cols-2">
        {/* Explainable Insights */}
        <div className="glass animated">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} /> Explainable Coach
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="insight-alert" 
                style={{ 
                  margin: 0,
                  background: insight.type === 'warning' ? 'rgba(249, 115, 22, 0.08)' : 'rgba(6, 182, 212, 0.08)',
                  border: `1px solid ${insight.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`
                }}
              >
                <span style={{ fontSize: '13.5px' }}>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Gamification badges={badges} streak={streakDays} />
      </div>

      {/* Savings & Cashback Vault */}
      <div className="grid-cols-2">
        <SavingsGoals goals={goals} onAddGoal={onAddGoal} onAddSavings={onAddSavings} currency={currency} />
        <CashbackVault wallet={120.00} coins={2400} currency={currency} />
      </div>

      {/* Subscriptions */}
      <div>
        <RecurringList recurring={recurring} onAddRecurring={onAddRecurring} onDeleteRecurring={onDeleteRecurring} currency={currency} />
      </div>

      <AIChatbot expenses={expenses} budget={budget} currency={currency} />
    </div>
  );
}
