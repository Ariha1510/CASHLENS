import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Budget from './pages/Budget';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import NotificationDrawer from './components/NotificationDrawer';

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(8000.00);
  const [profile, setProfile] = useState({ currency: '₹', onboarded: false });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [themeAccent, setThemeAccent] = useState(localStorage.getItem('theme-accent') || '');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', text: 'Welcome to CashCrush! Let\'s build a budget.', time: 'Just now' },
    { id: 2, type: 'success', text: 'Cashback Credited: +20 Coins added to vault.', time: '2 mins ago' }
  ]);

  const handleUpdateProfile = async (profileData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, ...profileData }));
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { error: err };
    }
  };

  // Theme Accent Effect
  useEffect(() => {
    document.documentElement.classList.remove('theme-emerald', 'theme-ocean', 'theme-purple', 'theme-sunset');
    if (themeAccent) {
      document.documentElement.classList.add(themeAccent);
    }
    localStorage.setItem('theme-accent', themeAccent);
  }, [themeAccent]);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.remove('light');
    }
  }, []);

  // Offline Queue Syncing Effect
  useEffect(() => {
    if (user) {
      const handleOnlineStatus = () => {
        if (navigator.onLine) {
          syncOfflineQueue();
        }
      };
      window.addEventListener('online', handleOnlineStatus);
      return () => window.removeEventListener('online', handleOnlineStatus);
    }
  }, [user]);

  const syncOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('offline-expenses') || '[]');
    if (queue.length === 0) return;

    showToast('Reconnecting! Syncing offline transactions...', 'info');
    let successCount = 0;

    for (const item of queue) {
      try {
        const { error } = await supabase
          .from('expenses')
          .insert([{ ...item, user_id: user.id }]);
        if (!error) successCount++;
      } catch (e) {
        console.error('Offline Sync error:', e);
      }
    }

    localStorage.removeItem('offline-expenses');
    if (successCount > 0) {
      showToast(`Successfully synced ${successCount} offline transactions!`, 'success');
      fetchData();
    }
  };

  // Listen to Supabase auth events
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when user sessions are resolved
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setExpenses([]);
      setBudget(8000.00);
      setProfile({ currency: '₹', onboarded: false });
      setSavingsGoals([]);
      setRecurringExpenses([]);
      setBadges([]);
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch budget
      const { data: budgetData } = await supabase
        .from('budgets')
        .select('monthly_budget')
        .eq('user_id', user.id)
        .maybeSingle();

      if (budgetData) {
        setBudget(parseFloat(budgetData.monthly_budget));
      } else {
        await supabase.from('budgets').insert([{ user_id: user.id, monthly_budget: 8000.00 }]);
        setBudget(8000.00);
      }

      // 2. Fetch profile (with fallback if profile table columns missing)
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('currency, onboarded')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          setProfile({
            currency: profileData.currency || '₹',
            onboarded: profileData.onboarded !== undefined ? profileData.onboarded : false
          });
        }
      } catch (e) {
        console.warn("Could not query profiles columns, using safe memory defaults.");
      }

      // 3. Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      setExpenses(expensesData || []);

      // 4. Fetch savings goals
      try {
        const { data: goalsData } = await supabase
          .from('savings_goals')
          .select('*')
          .eq('user_id', user.id);
        setSavingsGoals(goalsData || []);
      } catch (e) {
        console.warn("Could not query savings_goals table, using default empty array.");
      }

      // 5. Fetch recurring expenses
      try {
        const { data: recurringData } = await supabase
          .from('recurring_expenses')
          .select('*')
          .eq('user_id', user.id);
        setRecurringExpenses(recurringData || []);
      } catch (e) {
        console.warn("Could not query recurring_expenses table, using default empty.");
      }

      // 6. Fetch badges
      try {
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);
        setBadges(badgesData || []);
      } catch (e) {
        console.warn("Could not query user_badges table, using default empty.");
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Onboarding Completion
  const handleOnboardingComplete = async (setupData) => {
    try {
      // Update budgets
      await supabase
        .from('budgets')
        .update({ monthly_budget: setupData.budget })
        .eq('user_id', user.id);

      // Update profiles
      try {
        await supabase
          .from('profiles')
          .update({ currency: setupData.currency, onboarded: true })
          .eq('id', user.id);
      } catch (e) {
        console.warn("Profiles update failed, utilizing memory fallback.");
      }

      setBudget(setupData.budget);
      setProfile({ currency: setupData.currency, onboarded: true });
      showToast('Wizard setup complete! Welcome to CASHCRUSH!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Add Expense
  const handleAddExpense = async (expenseData) => {
    // Offline caching handling
    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('offline-expenses') || '[]');
      const tempId = 'offline-' + Date.now();
      const offlineItem = { ...expenseData, id: tempId, user_id: user.id };
      localStorage.setItem('offline-expenses', JSON.stringify([...queue, expenseData]));
      setExpenses(prev => [offlineItem, ...prev]);
      showToast('Offline Mode: Saved locally. Will sync once reconnected!', 'warning');
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expenseData, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setExpenses(prev => [data[0], ...prev]);
        showToast('Expense logged successfully!', 'success');
        
        // Gamification trigger: Check for savers badges
        if (expenses.length + 1 >= 5 && !badges.some(b => b.badge_name === '7-Day Saver')) {
          const newBadge = { badge_name: '7-Day Saver', description: 'Maintained expense logging.' };
          try {
            await supabase.from('user_badges').insert([{ ...newBadge, user_id: user.id }]);
            setBadges(prev => [...prev, newBadge]);
            showToast('Achievement Unlocked: 7-Day Saver! 🏆', 'success');
          } catch(e) {}
        }
        return true;
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Update Expense
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...expenseData } : exp));
      showToast('Expense updated successfully!', 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      showToast('Expense deleted successfully!', 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Update Budget
  const handleUpdateBudget = async (newAmount) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({ monthly_budget: newAmount })
        .eq('user_id', user.id);

      if (error) throw error;
      setBudget(newAmount);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Savings Goal CRUD operations
  const handleAddGoal = async (goalData) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{ ...goalData, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setSavingsGoals(prev => [...prev, data[0]]);
        showToast('Savings Target added!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddSavings = async (goalId, savingsAmount) => {
    try {
      const targetGoal = savingsGoals.find(g => g.id === goalId);
      if (!targetGoal) return;

      const newSaved = parseFloat(targetGoal.saved_amount || 0) + savingsAmount;
      const { error } = await supabase
        .from('savings_goals')
        .update({ saved_amount: newSaved })
        .eq('id', goalId);

      if (error) throw error;
      setSavingsGoals(prev => prev.map(g => g.id === goalId ? { ...g, saved_amount: newSaved } : g));
      showToast(`Added ${profile.currency}${savingsAmount} savings!`, 'success');

      // Gamification check: Saved over 5000
      if (newSaved >= 5000 && !badges.some(b => b.badge_name === 'Savings Master')) {
        const newBadge = { badge_name: 'Savings Master', description: 'Saved more than ₹5,000 this month.' };
        try {
          await supabase.from('user_badges').insert([{ ...newBadge, user_id: user.id }]);
          setBadges(prev => [...prev, newBadge]);
          showToast('Achievement Unlocked: Savings Master! 🏆', 'success');
        } catch(e) {}
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Recurring payments CRUD operations
  const handleAddRecurring = async (recurringData) => {
    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .insert([{ ...recurringData, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setRecurringExpenses(prev => [...prev, data[0]]);
        showToast('Recurring Subscription Added!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteRecurring = async (id) => {
    try {
      const { error } = await supabase
        .from('recurring_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecurringExpenses(prev => prev.filter(item => item.id !== id));
      showToast('Subscription deleted.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Guard routing helper
  const ProtectedRoute = ({ children }) => {
    if (loading && !user) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          Loading profiles...
        </div>
      );
    }
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          user={user} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          theme={themeAccent}
          setTheme={setThemeAccent}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          notificationCount={notifications.length}
        />

        <NotificationDrawer 
          isOpen={notificationsOpen} 
          onClose={() => setNotificationsOpen(false)} 
          notifications={notifications} 
          onClear={() => setNotifications([])} 
        />
        
        {/* Onboarding Trigger */}
        {user && !profile.onboarded && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Landing user={user} />} 
            />
            <Route 
              path="/dashboard" 
              element = {
                <ProtectedRoute>
                  <Dashboard 
                    expenses={expenses} 
                    budget={budget} 
                    loading={loading} 
                    error={error} 
                    currency={profile.currency}
                    goals={savingsGoals}
                    recurring={recurringExpenses}
                    badges={badges}
                    onAddGoal={handleAddGoal}
                    onAddSavings={handleAddSavings}
                    onAddRecurring={handleAddRecurring}
                    onDeleteRecurring={handleDeleteRecurring}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute>
                  <Expenses 
                    expenses={expenses} 
                    onAdd={handleAddExpense} 
                    onUpdate={handleUpdateExpense} 
                    onDelete={handleDeleteExpense} 
                    loading={loading}
                    error={error}
                    showToast={showToast}
                    currency={profile.currency}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports expenses={expenses} currency={profile.currency} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/budget" 
              element={
                <ProtectedRoute>
                  <Budget 
                    budget={budget} 
                    onUpdateBudget={handleUpdateBudget} 
                    showToast={showToast} 
                    currency={profile.currency}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile 
                    user={user} 
                    profile={profile} 
                    onUpdateProfile={handleUpdateProfile} 
                    onUpdateBudget={handleUpdateBudget} 
                    showToast={showToast}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Login showToast={showToast} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Register showToast={showToast} />
              } 
            />
          </Routes>
        </main>

        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </Router>
  );
}
