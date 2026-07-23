import React from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications = [], onClear }) {
  if (!isOpen) return null;

  return (
    <div 
      className="glass animated"
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '320px',
        maxHeight: '400px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-neon)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Notifications</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
            No new notifications.
          </p>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-glass)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {n.type === 'warning' ? (
                  <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                ) : n.type === 'success' ? (
                  <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                ) : (
                  <Info size={14} style={{ color: 'var(--primary)' }} />
                )}
              </div>
              <div>
                <p style={{ fontWeight: '500' }}>{n.text}</p>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <button 
          onClick={onClear} 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '6px', fontSize: '11px', marginTop: '12px' }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
