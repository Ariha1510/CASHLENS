import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldAlert, 
  Globe, 
  Settings, 
  Download, 
  Trash, 
  Mail
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile({ user, profile, budget, onUpdateProfile, onUpdateBudget, showToast }) {
  const [name, setName] = useState(user?.user_metadata?.name || user?.user_metadata?.full_name || '');
  const [email] = useState(user?.email || '');
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [budgetVal, setBudgetVal] = useState(budget || '');

  // Custom Modal configuration state
  const [modalConfig, setModalConfig] = useState(null); // { title, message, onConfirm, isDanger }

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

  const triggerExportData = () => {
    setModalConfig({
      title: '📦 Export Personal Data?',
      message: 'Do you want to prepare and download your transaction statements, savings goals, and account activity as a CSV package?',
      isDanger: false,
      onConfirm: () => {
        showToast('Preparing your user data export package...', 'info');
      }
    });
  };

  const triggerDeleteAccount = () => {
    setModalConfig({
      title: '🚨 Delete Profile Account?',
      message: 'Are you absolutely sure you want to delete your CashLens profile? This action cannot be undone, and all your records will be cleared.',
      isDanger: true,
      onConfirm: () => {
        showToast('Account deletion request queued.', 'warning');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>User Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details, configure limits, and export transactions.</p>
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

        {/* Right Side: Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0, color: 'var(--danger)' }}>
              <ShieldAlert size={20} /> Danger Zone
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              Actions here are permanent. You can back up your files or close your account permanently.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button" 
                onClick={triggerExportData} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '13px' }}
              >
                <Download size={14} /> Export Personal Data
              </button>
              <button 
                type="button" 
                onClick={triggerDeleteAccount} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '13px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
              >
                <Trash size={14} /> Delete Profile Account
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
                  modalConfig.onConfirm();
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
