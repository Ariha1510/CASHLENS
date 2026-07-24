import React from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, Check } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications = [], onClear, onMarkRead }) {
  if (!isOpen) return null;

  return (
    <div 
      className="glass animated"
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '340px',
        maxHeight: '420px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-glass)'
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
                padding: '10px 12px',
                borderRadius: '8px',
                background: n.unread ? 'rgba(6, 182, 212, 0.04)' : 'rgba(255,255,255,0.01)',
                border: n.unread ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                position: 'relative'
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
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <p style={{ fontWeight: n.unread ? '600' : '400', margin: 0, color: n.unread ? 'var(--text-primary)' : 'var(--text-muted)' }}>{n.text}</p>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{n.time}</span>
              </div>
              {n.unread && (
                <button 
                  onClick={() => onMarkRead && onMarkRead(n.id)}
                  title="Mark as Read"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  <Check size={14} />
                </button>
              )}
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
