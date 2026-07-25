import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldAlert, 
  Globe, 
  Settings, 
  Trash, 
  Mail
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile({ user, profile, budget, onUpdateProfile, onUpdateBudget, showToast }) {
  const [name, setName] = useState(user?.user_metadata?.name || user?.user_metadata?.full_name || '');
  const [email] = useState(user?.email || '');
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [budgetVal, setBudgetVal] = useState(budget || '');

  // Delete reason state
  const [deleteReason, setDeleteReason] = useState('');

  // Custom Modal configuration state
  const [modalConfig, setModalConfig] = useState(null); // { type, title, message, onConfirm, isDanger }

  // Update budget local state when budget prop loads
  useEffect(() => {
    if (budget) {
      setBudgetVal(budget);
    }
  }, [budget]);

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    let success = true;

    // Update metadata (Name)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });
      if (error) throw error;
    } catch (err) {
      showToast(err.message, 'error');
      success = false;
    }

    // Update Preferred Currency
    if (currency !== profile.currency) {
      const { error } = await onUpdateProfile({ currency });
      if (error) success = false;
    }

    // Update Monthly Budget
    if (budgetVal && !isNaN(budgetVal) && parseFloat(budgetVal) > 0) {
      const budgetSuccess = await onUpdateBudget(parseFloat(budgetVal));
      if (!budgetSuccess) success = false;
    }

    if (success) {
      showToast('General settings updated successfully!', 'success');
    }
  };

  const triggerDeleteAccount = () => {
    setDeleteReason(''); // reset reason input
    setModalConfig({
      type: 'delete',
      title: '🚨 Delete My Account?',
      message: 'Are you absolutely sure you want to delete your CashLens profile? This action cannot be undone, and all your records will be cleared.',
      isDanger: true,
      onConfirm: (reason) => {
        if (!reason || !reason.trim()) {
          showToast('Please provide a reason for account deletion.', 'warning');
          return;
        }
        showToast(`Account deletion request queued. Reason: ${reason}`, 'warning');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>User Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details, configure limits, and close your account.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side: General Settings Form */}
        <form onSubmit={handleSaveGeneralSettings} className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
            <Settings size={20} style={{ color: 'var(--primary)' }} /> General Settings
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            <div style={{ background: 'var(--primary-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={28} />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '16px', margin: 0, color: 'var(--text-primary)' }}>
                {(name || user?.email?.split('@')[0] || 'User').toUpperCase()}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>{email}</p>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="form-control"
                placeholder="Your Name"
                style={{ paddingLeft: '40px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email} 
                className="form-control"
                style={{ paddingLeft: '40px', opacity: 0.6, cursor: 'not-allowed' }}
                disabled
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Preferred Currency Symbol</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                className="form-control"
                style={{ paddingLeft: '40px' }}
              >
                <option value="₹">Rupee (₹)</option>
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">Pound (£)</option>
              </select>
              <Globe size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Monthly Budget Limit ({currency})</label>
            <input 
              type="number" 
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="form-control"
              placeholder="e.g. 8000"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '48px', fontWeight: '700', borderRadius: '10px' }}>
            Save General Settings
          </button>
        </form>

        {/* Right Side: Account Settings Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0, color: 'var(--danger)' }}>
              <ShieldAlert size={20} /> ACCOUNT
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              Actions here are permanent. You can back up your files or close your account permanently.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={triggerDeleteAccount} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '13px', borderColor: 'var(--danger)', color: 'var(--danger)', height: '48px', fontWeight: '700' }}
              >
                <Trash size={14} /> Delete My Account
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* --- Middle Screen Custom Modal Popup Dialog --- */}
      {modalConfig && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="glass animated" style={{ maxWidth: '400px', width: '90%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-glass)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{modalConfig.title}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{modalConfig.message}</p>
            
            {/* Conditional input field for reason on deletion modal */}
            {modalConfig.type === 'delete' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '4px' }}>
                <label className="form-label">Reason for deletion</label>
                <input 
                  type="text" 
                  value={deleteReason} 
                  onChange={(e) => setDeleteReason(e.target.value)} 
                  placeholder="e.g., Privacy concerns / App alternative"
                  className="form-control"
                  style={{ background: 'rgba(15, 23, 42, 0.1)', borderColor: 'var(--border-glass)' }}
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                onClick={() => setModalConfig(null)} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (modalConfig.type === 'delete' && (!deleteReason || !deleteReason.trim())) {
                    showToast('Please fill in the reason for deletion.', 'warning');
                    return;
                  }
                  modalConfig.onConfirm(deleteReason);
                  setModalConfig(null);
                }} 
                className="btn btn-primary" 
                style={{ 
                  padding: '8px 20px', 
                  fontSize: '13px', 
                  background: modalConfig.isDanger ? 'var(--danger)' : 'var(--primary)', 
                  borderColor: modalConfig.isDanger ? 'var(--danger)' : 'var(--primary)', 
                  color: '#fff' 
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
