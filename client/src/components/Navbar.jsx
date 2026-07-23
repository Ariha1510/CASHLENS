import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, ReceiptText, PieChart, Landmark, LogOut, Sun, Moon, Bell } from 'lucide-react';

export default function Navbar({ user, isDarkMode, toggleDarkMode, theme, setTheme, onToggleNotifications, notificationCount = 0 }) {
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
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
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
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          className="form-control"
          style={{ width: '100px', padding: '6px', fontSize: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)' }}
          title="Accent Theme"
        >
          <option value="">Default</option>
          <option value="theme-emerald">Emerald</option>
          <option value="theme-ocean">Ocean</option>
          <option value="theme-purple">Purple</option>
          <option value="theme-sunset">Sunset</option>
        </select>

        <button
          onClick={toggleDarkMode}
          className="btn btn-secondary"
          style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <button
            onClick={onToggleNotifications}
            className="btn btn-secondary"
            style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', position: 'relative' }}
            title="Notifications"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--secondary)', color: '#fff', fontSize: '9px', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {notificationCount}
              </span>
            )}
          </button>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }} title="View Profile">
                HEY, <strong style={{ color: 'var(--text-primary)' }}>{(user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0]).toUpperCase()}</strong>
              </span>
            </Link>
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
