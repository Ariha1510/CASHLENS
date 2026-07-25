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
  Camera, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock
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
  onDeleteRecurring
}) {
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0);
  const [applyMessage, setApplyMessage] = useState(null);

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
    return goalsSaved > 0 ? goalsSaved : 1250; // Dynamic savings or premium fallback
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

  // Chart configs
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
        'rgba(16, 185, 129, 0.75)', // Emerald green
        'rgba(59, 130, 246, 0.75)', // Blue
        'rgba(245, 158, 11, 0.75)', // Warning Orange
        'rgba(139, 92, 246, 0.75)', // Purple
        'rgba(239, 68, 68, 0.75)'   // Red
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
