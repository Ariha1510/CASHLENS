import React, { useState } from 'react';
import { User, Shield, ShieldAlert, Key, Globe, Eye, Settings, Download, Trash } from 'lucide-react';

export default function Profile({ user, profile, onUpdateProfile, onUpdateBudget, showToast }) {
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [budgetVal, setBudgetVal] = useState('');
  const [activeSessions] = useState([
    { device: 'Windows PC • Chrome', active: 'Current Session' },
    { device: 'iPhone 15 • Safari', active: 'Last active 2 hrs ago' }
  ]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    let success = true;

    if (currency !== profile.currency) {
      const { error } = await onUpdateProfile({ currency });
      if (error) success = false;
    }

    if (budgetVal && !isNaN(budgetVal) && parseFloat(budgetVal) > 0) {
      const budgetSuccess = await onUpdateBudget(parseFloat(budgetVal));
      if (!budgetSuccess) success = false;
    }

    if (success) {
      showToast('Settings saved successfully!', 'success');
    }
  };

  const handleExportData = () => {
    showToast('Preparing your user data export package...', 'info');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Are you absolutely sure you want to delete your CashCrush profile? This action is irreversible.");
    if (confirm) {
      showToast('Account deletion request queued.', 'warning');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>User Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Configure details, limits, notifications, and privacy options.</p>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Left Col: Preferences Form */}
        <form onSubmit={handleSaveSettings} className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} style={{ color: 'var(--primary)' }} /> General Settings
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '8px' }}>
            <div style={{ background: 'var(--primary-glow)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--primary)' }}>
              <User size={32} />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '16px' }}>{(user?.user_metadata?.name || user?.email?.split('@')[0] || 'User').toUpperCase()}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{user?.email}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Currency Symbol</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className="form-control"
            >
              <option value="₹">Rupee (₹)</option>
              <option value="$">US Dollar ($)</option>
              <option value="€">Euro (€)</option>
              <option value="£">Pound (£)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Modify Monthly Budget Limit</label>
            <input 
              type="number" 
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="form-control"
              placeholder="Keep blank to retain current limit"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Save Settings
          </button>
        </form>

        {/* Right Col: Security, Sessions & Account Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Sessions */}
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
              <Key size={18} style={{ color: 'var(--secondary)' }} /> Active Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeSessions.map((session, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                  <span>{session.device}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{session.active}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Account Operations */}
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: 'var(--danger)' }}>
              <ShieldAlert size={18} /> Danger Zone
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button" 
                onClick={handleExportData} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '13px' }}
              >
                <Download size={14} /> Export Personal Data
              </button>
              <button 
                type="button" 
                onClick={handleDeleteAccount} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '13px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
              >
                <Trash size={14} /> Delete Profile Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
