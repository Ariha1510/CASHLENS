import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import BudgetCard from '../components/BudgetCard';
import SavingsGoals from '../components/SavingsGoals';
import RecurringList from '../components/RecurringList';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  IndianRupee, 
  TrendingUp, 
  Award, 
  Plus, 
  Camera, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ 
  expenses = [], 
  budget = 8000.00, 
  loading, 
  error, 
  currency = '₹',
  goals = [],
  recurring = [],
  badges = [],
  onAddGoal,
  onAddSavings,
  onAddRecurring,
  onDeleteRecurring,
  isDarkMode
}) {
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0);
  const [applyMessage, setApplyMessage] = useState(null);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setTotalSpent(total);
  }, [expenses]);

  const greeting = useMemo(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const totalSaved = useMemo(() => {
    const goalsSaved = goals.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0);
    return goalsSaved > 0 ? goalsSaved : 1250;
  }, [goals]);

  const remaining = useMemo(() => {
    const rem = budget - totalSpent;
    return rem > 0 ? rem : 0;
  }, [budget, totalSpent]);

  // Aggregate Category Totals
  const categoryData = useMemo(() => {
    const totals = { Food: 0, Travel: 0, Shopping: 0, Education: 0, Bills: 0 };
    expenses.forEach(e => {
      const cat = e.category || 'Food';
      if (totals[cat] !== undefined) {
        totals[cat] += parseFloat(e.amount || 0);
      } else {
        totals['Shopping'] += parseFloat(e.amount || 0);
      }
    });
    return totals;
  }, [expenses]);

  // Original Dark Mode Prediction metric
  const prediction = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyAvg = currentDay > 0 ? totalSpent / currentDay : 0;
    const projected = dailyAvg * daysInMonth;
    const risk = projected > budget ? 'High' : (projected > budget * 0.7 ? 'Medium' : 'Low');

    return { dailyAvg, projected, risk };
  }, [totalSpent, budget]);

  // Original Dark Mode Health Score
  const healthScore = useMemo(() => {
    let score = 85;
    if (totalSpent > budget) {
      score -= Math.min(45, ((totalSpent - budget) / budget) * 100);
    } else if (budget > 0) {
      const unused = (budget - totalSpent) / budget;
      score += Math.min(10, unused * 10);
    }
    const totalSavedScore = goals.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0);
    if (totalSavedScore > 0) {
      score += Math.min(15, (totalSavedScore / 5000) * 15);
    }
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [totalSpent, budget, goals]);

  // Original Dark Mode Coach Insights list
  const insights = useMemo(() => {
    const list = [];
    if (budget > 0) {
      const percentage = (totalSpent / budget) * 100;
      if (percentage >= 90) {
        list.push({ type: 'warning', text: `⚠️ You've spent ${percentage.toFixed(0)}% of your monthly budget. Urgently reduce shopping/leisure expenses!` });
      } else {
        list.push({ type: 'info', text: `🍔 Food accounts for ${((categoryData['Food'] || 0) / (totalSpent || 1) * 100).toFixed(0)}% of your allowance.` });
      }
    }
    if (prediction.risk === 'High') {
      list.push({ type: 'warning', text: `⚠️ Alert: Continuing at this rate, you're projected to exceed your budget ceiling by ${currency}${(prediction.projected - budget).toFixed(0)}.` });
    }
    if (categoryData['Shopping'] > 500) {
      list.push({ type: 'success', text: `💡 Tip: Reducing entertainment spending by ${currency}500 keeps you within your safe budget zone.` });
    }
    return list;
  }, [expenses, budget, totalSpent, prediction, currency, categoryData]);

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

  // --- 1. RENDER DARK MODE LAYOUT (100% untouched layout/look/aesthetics) ---
  if (isDarkMode) {
    const hasData = expenses && expenses.length > 0;
    if (!hasData) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Welcome Hero banner */}
          <div className="glass animated" style={{ padding: '32px', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>👋 Welcome to CASHLENS, Ariha!</h2>
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
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>1.</span> <span>Add your first expense</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>2.</span> <span>Set your first savings goal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>3.</span> <span>Scan a receipt</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>4.</span> <span>Import your bank CSV</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>5.</span> <span>Explore your spending analytics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-cols-2">
            {/* AI Welcome Card */}
            <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BotIcon size={20} /> AI Financial Coach
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)', margin: 0 }}>
                Hello Ariha 👋, I am your AI Financial Coach. Your monthly budget is set to {currency}{budget}. We suggest dividing this into:
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--primary)', margin: 0 }}>
                🍔 Food & Drinks: {currency}{(budget * 0.35).toFixed(0)} | 📚 Bills/Fees: {currency}{(budget * 0.18).toFixed(0)} | 💰 Savings: {currency}{(budget * 0.20).toFixed(0)}
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
        </div>
      );
    }

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
          </div>
        </div>

        {/* Row 1: spent cards */}
        <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div onClick={() => navigate('/expenses')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ background: 'rgba(219, 39, 119, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--secondary)' }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spent</span>
              <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>{currency}{totalSpent.toFixed(0)}</p>
            </div>
          </div>

          <div onClick={() => navigate('/budget')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Remaining</span>
              <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0', color: 'var(--success)' }}>{currency}{remaining}</p>
            </div>
          </div>

          <div onClick={() => navigate('/reports')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Award size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Health Score</span>
              <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>{healthScore} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span></p>
            </div>
          </div>

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

        {/* Row 2: progress */}
        <div className="grid-cols-2">
          <BudgetCard budget={budget} spent={totalSpent} />
          
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

        <div className="grid-cols-2">
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

        {/* Row 4: goals and vault */}
        <div id="savings-goals-section" className="grid-cols-2">
          <SavingsGoals goals={goals} onAddGoal={onAddGoal} onAddSavings={onAddSavings} currency={currency} />
          
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

        <div>
          <RecurringList recurring={recurring} onAddRecurring={onAddRecurring} onDeleteRecurring={onDeleteRecurring} currency={currency} />
        </div>
      </div>
    );
  }

  // --- 2. RENDER NEW LIGHT MODE LAYOUT (Standardized Light Theme design direction) ---
  const doughnutData = {
    labels: ['Food', 'Travel', 'Shopping', 'Education', 'Bills'],
    datasets: [{
      data: [
        categoryData.Food || 240, 
        categoryData.Travel || 150, 
        categoryData.Shopping || 800, 
        categoryData.Education || 200, 
        categoryData.Bills || 300
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.75)', 
        'rgba(59, 130, 246, 0.75)', 
        'rgba(245, 158, 11, 0.75)', 
        'rgba(139, 92, 246, 0.75)', 
        'rgba(239, 68, 68, 0.75)'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  const barData = {
    labels: ['Food', 'Travel', 'Shopping', 'Education', 'Bills'],
    datasets: [{
      label: 'Spent Amount',
      data: [
        categoryData.Food || 240, 
        categoryData.Travel || 150, 
        categoryData.Shopping || 800, 
        categoryData.Education || 200, 
        categoryData.Bills || 300
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Poppins', size: 11 }, color: '#6B7280' }
      }
    }
  };

  const handleApplyBudgetGoal = () => {
    setApplyMessage('✓ AI suggestions and budget targets applied! Keep up the good work.');
    setTimeout(() => setApplyMessage(null), 4000);
  };

  const streakDays = expenses.length > 0 ? Math.min(expenses.length, 8) : 0;
  const cashCoins = 1200 + (expenses.length * 50);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome Back 👋</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', marginBottom: '4px', color: '#111827' }}>
            {greeting}, Ariha
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', margin: 0 }}>
            You have saved <strong style={{ color: 'var(--primary)' }}>{currency}{totalSaved}</strong> this month.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Budget */}
        <div className="glass animated" style={{ borderTop: '4px solid #10B981', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Monthly Budget</span>
            <span style={{ fontSize: '18px' }}>💰</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#111827' }}>
            {currency}{budget.toLocaleString()}
          </p>
        </div>

        {/* Spent */}
        <div className="glass animated" style={{ borderTop: '4px solid #F59E0B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Spent</span>
            <span style={{ fontSize: '18px' }}>🛒</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#111827' }}>
            {currency}{totalSpent.toLocaleString()}
          </p>
        </div>

        {/* Remaining */}
        <div className="glass animated" style={{ borderTop: '4px solid #3B82F6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Remaining</span>
            <span style={{ fontSize: '18px' }}>🏦</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#111827' }}>
            {currency}{remaining.toLocaleString()}
          </p>
        </div>

        {/* Rewards */}
        <div className="glass animated" style={{ borderTop: '4px solid #8B5CF6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>CashCoins</span>
            <span style={{ fontSize: '18px' }}>🏆</span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#111827' }}>
            {cashCoins.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Main Grid: Charts & AI suggestions */}
      <div className="grid-cols-2">
        
        {/* Analytics Charts */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>📊 Expense Analytics</h3>
          
          {expenses.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>No expenses logged yet. Add some items to populate charts!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '220px' }}>
              <div style={{ position: 'relative', height: '220px' }}>
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
              <div style={{ position: 'relative', height: '220px' }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>

        {/* AI suggestions Advisor */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 AI Advisor
            </h3>
            
            {applyMessage && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', fontSize: '12.5px', fontWeight: '600' }}>
                {applyMessage}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>Spend 10% less on Food this week.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>You'll save an estimated {currency}600 this month.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>Buy bulk groceries on weekends to cut delivery charges.</span>
              </div>
            </div>
          </div>

          <button onClick={handleApplyBudgetGoal} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}>
            Apply Budget Goal
          </button>
        </div>

      </div>

      {/* Row 3: Recent Transactions & Streak progress */}
      <div className="grid-cols-2">
        
        {/* Recent Transactions table */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Recent Expenses</h3>
          
          {expenses.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>No expenses yet. Add your first one to begin!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 0', borderBottom: '1px solid var(--border-glass)', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '10px 0', borderBottom: '1px solid var(--border-glass)', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ padding: '10px 0', borderBottom: '1px solid var(--border-glass)', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map(exp => {
                    const emoji = exp.category === 'Food' ? '🍔' : 
                                  exp.category === 'Travel' ? '🚕' : 
                                  exp.category === 'Shopping' ? '🛍️' : 
                                  exp.category === 'Education' ? '📚' : '📄';
                    return (
                      <tr key={exp.id}>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-glass)', fontSize: '13.5px' }}>
                          <span style={{ marginRight: '6px' }}>{emoji}</span> {exp.category}
                        </td>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-glass)', textAlign: 'right', fontWeight: '700', fontSize: '13.5px' }}>
                          {currency}{parseFloat(exp.amount).toFixed(0)}
                        </td>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-glass)', textAlign: 'right', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {exp.expense_date === new Date().toISOString().split('T')[0] ? 'Today' : exp.expense_date}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rewards progress card */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Current Streak
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 10px 0' }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--warning)' }}>
                  {streakDays} Days
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Keep logging expenses to earn reward coins.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
                <span>Rewards Goal Progress</span>
                <span>{cashCoins} / 2000 Coins</span>
              </div>
              <div className="progress-bar-container" style={{ height: '10px' }}>
                <div className="progress-bar green" style={{ width: `${Math.min(100, (cashCoins / 2000) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/budget')} className="btn btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}>
            Claim Voucher
          </button>
        </div>

      </div>

      {/* Floating Action Button (FAB) for adding expenses */}
      <button 
        onClick={() => navigate('/expenses')} 
        className="fab-button"
        title="Add Expense"
      >
        <Plus size={28} />
      </button>

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
