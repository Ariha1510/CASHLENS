import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, ReceiptText, PieChart, Landmark, LogOut, Sun, Moon, Bell } from 'lucide-react';
import logo from '../assets/logo.png';

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
      <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <img src={logo} alt="CASHLENS Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        <span style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: '22px', letterSpacing: '-0.02em' }}>CASHLENS</span>
      </Link>
      
      {user && (
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            {isDarkMode ? <LayoutDashboard size={18} /> : null} {isDarkMode ? "Dashboard" : "🏠 Dashboard"}
          </Link>
          <Link to="/expenses" className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}>
            {isDarkMode ? <ReceiptText size={18} /> : null} {isDarkMode ? "Expenses" : "🟢 Expenses"}
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
            {isDarkMode ? <PieChart size={18} /> : null} {isDarkMode ? "Reports" : "📈 Reports"}
          </Link>
          <Link to="/budget" className={`nav-link ${isActive('/budget') ? 'active' : ''}`}>
            {isDarkMode ? <Landmark size={18} /> : null} {isDarkMode ? "Budget" : "🎁 Budget & Rewards"}
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
