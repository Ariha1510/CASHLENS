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
import { 
  IndianRupee, 
  TrendingUp, 
  Award, 
  Plus, 
  Sparkles,
  CheckCircle,
  Search
} from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

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
  
  // Search and Filter states
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

  // Filtered Expenses for Search/Filters
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

  // --- RENDER UNIFIED PREMIUM LAYOUT (Used in both Light Mode & Dark Mode) ---
  const hasData = expenses && expenses.length > 0;
  const streakDays = expenses.length > 0 ? Math.min(expenses.length, 8) : 0;
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
      borderColor: isDarkMode ? '#1e293b' : '#ffffff',
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
          <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '6px 12px', borderRadius: '12px' }}>-5% Spending</span>
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
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>📊 Expense Breakdown</h3>
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
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              🤖 AI Advisor Suggestions
            </h3>
            {applyMessage && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '12.5px', fontWeight: '600' }}>
                {applyMessage}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>Food spending increased 18% compared to last week.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                <span>You're likely to exceed your budget ceiling by {currency}750.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
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
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Recent Expenses</h3>
            
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
                  color: activeFilter === filter ? '#FFFFFF' : 'var(--text-primary)',
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
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-glass)' }}>
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
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Current Streak & Goal
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--warning)' }}>
                  {currentStreak} Days Streak
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Keep logging expenses to earn reward coins.
                </p>
              </div>
            </div>

            {/* Savings Goal Target progress */}
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                <span>Vacation Fund Goal</span>
                <span>{currency}9,500 / {currency}20,000</span>
              </div>
              <div className="progress-bar-container" style={{ height: '10px' }}>
                <div className="progress-bar green" style={{ width: '47.5%' }}></div>
              </div>
            </div>

            {/* Rewards coins progress */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
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
