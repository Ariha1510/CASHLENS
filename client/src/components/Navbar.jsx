import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, ReceiptText, PieChart, Landmark, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, isDarkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        💸 CASHCRUSH
      </Link>
      
      {user && (
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/expenses" className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}>
            <ReceiptText size={18} /> Expenses
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
            <PieChart size={18} /> Reports
          </Link>
          <Link to="/budget" className={`nav-link ${isActive('/budget') ? 'active' : ''}`}>
            <Landmark size={18} /> Budget
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleDarkMode}
          className="btn btn-secondary"
          style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              HEY, <strong style={{ color: 'var(--text-primary)' }}>{(user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0]).toUpperCase()}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          location.pathname !== '/login' && location.pathname !== '/register' && (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
