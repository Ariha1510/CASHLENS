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
  Search,
  CheckSquare
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
  
  // Search and Filter states for Redesigned Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Today', 'This Week', 'This Month', 'Food', 'Travel', 'Shopping'

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

  // Filtered Expenses for Redesigned Search/Filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Search filter
      const matchesSearch = 
        (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exp.category && exp.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;

      // Category / Date filters
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Food') return exp.category === 'Food';
      if (activeFilter === 'Travel') return exp.category === 'Travel';
      if (activeFilter === 'Shopping') return exp.category === 'Shopping';

      const expDate = new Date(exp.expense_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (activeFilter === 'Today') {
        return exp.expense_date === new Date().toISOString().split('T')[0];
      }
      if (activeFilter === 'This Week') {
        const diffTime = Math.abs(today - expDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (activeFilter === 'This Month') {
        return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
      }

      return true;
    });
  }, [expenses, searchQuery, activeFilter]);

  if (loading) {
    return <SkeletonLoader type="dashboard" />;
  }

  // --- 1. RENDER LIGHT MODE LAYOUT (Original simple layout) ---
  if (!isDarkMode) {
    const hasData = expenses && expenses.length > 0;
    if (!hasData) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Welcome Hero banner */}
          <div className="glass animated" style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-card)' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--text-primary)' }}>👋 Welcome to CASHLENS, Ariha!</h2>
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
              <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Monthly Budget Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Budget</span>
                  <p style={{ fontSize: '18px', fontWeight: '700', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>{currency}{budget}</p>
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
              <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Getting Started Checklist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>1.</span> <span>Add your first expense</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>2.</span> <span>Set your first savings goal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>3.</span> <span>Scan a receipt</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>4.</span> <span>Import your bank CSV</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', minWidth: '20px' }}>5.</span> <span>Explore your spending analytics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-cols-2">
            {/* AI Welcome Card */}
            <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
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
              <h3 style={{ color: 'var(--text-primary)' }}>Your Rewards Journey</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Coins:</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>0 Coins</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
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
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)' }}>Dashboard</h2>
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
            <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px', color: 'var(--secondary)' }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spent</span>
              <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{currency}{totalSpent.toFixed(0)}</p>
            </div>
          </div>

          <div onClick={() => navigate('/budget')} className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}>
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
              <p style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{healthScore} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span></p>
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
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
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
              <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
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
              <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
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
            <h3 style={{ color: 'var(--text-primary)' }}>Cashback Vault</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wallet Balance</span>
                <p style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>{currency}120.00</p>
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

  // --- 2. RENDER DARK MODE LAYOUT (Redesigned premium layout using system vars) ---
  const hasData = expenses && expenses.length > 0;
  const currentStreak = streakDays;
  const cashCoins = 1450; 
  const totalBalance = budget - totalSpent + totalSaved;

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
      borderColor: 'var(--bg-card)',
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
        labels: { font: { family: 'Poppins', size: 11 }, color: 'var(--text-muted)' }
      }
    }
  };

  const handleApplyBudgetGoal = () => {
    setApplyMessage('✓ AI suggestions and budget targets applied! Keep up the good work.');
    setTimeout(() => setApplyMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px' }}>
      
      {/* Personalized Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {greeting}, Ariha 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginTop: '4px', margin: 0 }}>
            Here's how your money is doing today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
          <span style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '12px' }}>+12% Savings</span>
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '12px' }}>-5% Spending</span>
        </div>
      </div>

      {/* Row 1: Total Balance Card (Large Card) */}
      <div className="glass animated" style={{ borderTop: '4px solid #10B981', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>💰 TOTAL BALANCE</span>
          <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            {currency}{totalBalance.toLocaleString()}
          </p>
        </div>
        <div style={{ fontSize: '32px' }}>💸</div>
      </div>

      {/* Row 2: Medium Cards (Budget, Savings, Rewards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Budget */}
        <div className="glass animated" style={{ borderTop: '4px solid #3B82F6', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>💰 Budget</span>
            <span style={{ fontSize: '16px' }}>🏦</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0', color: 'var(--text-primary)' }}>
            {currency}{budget.toLocaleString()}
          </p>
        </div>

        {/* Savings */}
        <div className="glass animated" style={{ borderTop: '4px solid #10B981', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>🎯 Savings</span>
            <span style={{ fontSize: '16px' }}>📈</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0', color: 'var(--text-primary)' }}>
            {currency}{totalSaved.toLocaleString()}
          </p>
        </div>

        {/* Rewards */}
        <div className="glass animated" style={{ borderTop: '4px solid #8B5CF6', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>🎁 Rewards</span>
            <span style={{ fontSize: '16px' }}>🏆</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0', color: 'var(--text-primary)' }}>
            {cashCoins.toLocaleString()} Coins
          </p>
        </div>

      </div>

      {/* Row 3: Charts & AI Insights */}
      <div className="grid-cols-2">
        
        {/* Charts block */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>📊 Expense Breakdown</h3>
          {!hasData ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📂</span>
              <p style={{ fontSize: '14px', margin: 0 }}>No expenses logged yet.</p>
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
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
              🤖 AI Advisor Suggestions
            </h3>
            {applyMessage && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '12.5px', fontWeight: '600' }}>
                {applyMessage}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>Food spending increased 18% compared to last week.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>You're likely to exceed your budget ceiling by {currency}750.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>Save {currency}400 by reducing food delivery orders.</span>
              </div>
            </div>
          </div>
          <button onClick={handleApplyBudgetGoal} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13.5px', borderRadius: '12px', fontWeight: '700' }}>
            Apply Budget Goal
          </button>
        </div>

      </div>

      {/* Row 4: Searchable Transactions & Streak / Savings Goal progress */}
      <div className="grid-cols-2">
        
        {/* Transaction cards list */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Recent Expenses</h3>
            
            {/* Search Input bar */}
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px 8px 36px', fontSize: '12px', borderRadius: '10px', maxWidth: '180px' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '11.5px' }}>
            {['All', 'Today', 'This Week', 'This Month', 'Food', 'Travel', 'Shopping'].map(filter => (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(filter)} 
                className="btn btn-secondary" 
                style={{ 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  background: activeFilter === filter ? 'var(--primary)' : 'transparent',
                  color: activeFilter === filter ? '#0f172a' : 'var(--text-primary)',
                  borderColor: activeFilter === filter ? 'var(--primary)' : 'var(--border-glass)'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {!hasData ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>📄</span>
              <p style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>No expenses yet</p>
              <p style={{ fontSize: '12.5px', margin: '0 0 16px 0' }}>Add your first expense to begin!</p>
              <button onClick={() => navigate('/expenses')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Add Expense
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredExpenses.slice(0, 4).map(exp => {
                const emoji = exp.category === 'Food' ? '🍔' : 
                              exp.category === 'Travel' ? '🚕' : 
                              exp.category === 'Shopping' ? '🛒' : 
                              exp.category === 'Education' ? '🎓' : 
                              exp.category === 'Rent' ? '🏠' : '⚡';
                return (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{emoji}</span>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '13.5px', margin: 0, color: 'var(--text-primary)' }}>{exp.description || exp.category}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{exp.category} • {exp.expense_date}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                      {currency}{parseFloat(exp.amount).toFixed(0)}
                    </span>
                  </div>
                );
              })}
              {filteredExpenses.length === 0 && (
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No matching expenses found.</p>
              )}
            </div>
          )}
        </div>

        {/* Streak and Savings progress card */}
        <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              🎯 Current Streak & Goal
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#F59E0B' }}>
                  {currentStreak} Days Streak
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Keep logging expenses to earn reward coins.
                </p>
              </div>
            </div>

            {/* Savings Goal Target progress */}
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                <span>Vacation Fund Goal</span>
                <span>{currency}9,500 / {currency}20,000</span>
              </div>
              <div className="progress-bar-container" style={{ height: '10px' }}>
                <div className="progress-bar green" style={{ width: '47.5%' }}></div>
              </div>
            </div>

            {/* Rewards coins progress */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
                <span>Voucher Progress</span>
                <span>{cashCoins} / 2000 Coins</span>
              </div>
              <div className="progress-bar-container" style={{ height: '8px' }}>
                <div className="progress-bar" style={{ width: '72.5%', background: 'linear-gradient(90deg, #8B5CF6, #a78bfa)' }}></div>
              </div>
            </div>

          </div>

          <button onClick={() => navigate('/budget')} className="btn btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '13.5px', borderRadius: '12px' }}>
            Claim Reward
          </button>
        </div>

      </div>

      {/* Floating Action Button (FAB) */}
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
