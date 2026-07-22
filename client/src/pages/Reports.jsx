import React, { useMemo } from 'react';
import { CategoryPieChart, TrendBarChart } from '../components/Charts';
import { Activity, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';

export default function Reports({ expenses, currency = '₹' }) {
  // Statistics Calculations
  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return { total: 0, avg: 0, highest: 0, lowest: 0, count: 0, dailyAvg: 0, weeklyAvg: 0 };
    }

    const amounts = expenses.map(exp => parseFloat(exp.amount));
    const total = amounts.reduce((sum, val) => sum + val, 0);
    const avg = total / amounts.length;
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);

    // Dynamic Averages based on dates logged
    const dates = expenses.map(e => new Date(e.expense_date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const timeDiff = Math.max(maxDate - minDate, 86400000); // at least 1 day
    const daysCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const dailyAvg = total / daysCount;
    const weeklyAvg = dailyAvg * 7;

    return {
      total,
      avg,
      highest,
      lowest,
      count: expenses.length,
      dailyAvg,
      weeklyAvg
    };
  }, [expenses]);

  // Category summary for Pie Chart
  const categoryData = useMemo(() => {
    const categories = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
    });

    return {
      labels: Object.keys(categories),
      data: Object.values(categories)
    };
  }, [expenses]);

  // Date/trend summary for Bar Chart
  const trendData = useMemo(() => {
    const dates = {};
    expenses.slice().reverse().forEach(exp => {
      dates[exp.expense_date] = (dates[exp.expense_date] || 0) + parseFloat(exp.amount);
    });

    const labels = Object.keys(dates).slice(-7);
    const data = Object.values(dates).slice(-7);

    return { labels, data };
  }, [expenses]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="printable-report">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Expenditure Reports</h2>
          <p style={{ color: 'var(--text-muted)' }}>Visualize your categorical shares and daily trends.</p>
        </div>
        <button onClick={handlePrint} className="btn btn-secondary no-print">
          <Printer size={16} /> Print Report
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="glass animated" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          Please add expenses on the Expenses page to generate graphs.
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid-cols-3">
            {/* Average Daily Spending */}
            <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                background: 'rgba(99, 102, 241, 0.1)', 
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: '#6366f1',
                display: 'flex'
              }}>
                <Activity size={20} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Daily / Weekly Avg</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>
                  {currency}{stats.dailyAvg.toFixed(0)} / {currency}{stats.weeklyAvg.toFixed(0)}
                </h3>
              </div>
            </div>

            {/* Highest Spending */}
            <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: 'var(--danger)',
                display: 'flex'
              }}>
                <ArrowUpRight size={20} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Highest Expense</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px', color: 'var(--danger)' }}>
                  {currency}{stats.highest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>

            {/* Lowest Spending */}
            <div className="glass animated" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: 'var(--success)',
                display: 'flex'
              }}>
                <ArrowDownRight size={20} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lowest Expense</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '2px', color: 'var(--success)' }}>
                  {currency}{stats.lowest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid-cols-2">
            {/* Pie Chart */}
            <div className="glass animated" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '16px' }}>Categorical Distribution</h3>
              <div style={{ flex: 1, minHeight: '0' }}>
                <CategoryPieChart data={categoryData.data} labels={categoryData.labels} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass animated" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '16px' }}>Recent Spending Trend</h3>
              <div style={{ flex: 1, minHeight: '0' }}>
                <TrendBarChart data={trendData.data} labels={trendData.labels} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS rules for printing */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .glass {
            background: none !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            color: black !important;
          }
          h2, h3, h4, span, p {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
