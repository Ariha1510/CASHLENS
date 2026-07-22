import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} style={{ color: '#10b981' }} />,
    warning: <AlertTriangle className="text-amber-500" size={20} style={{ color: '#f97316' }} />,
    error: <AlertTriangle className="text-rose-500" size={20} style={{ color: '#ef4444' }} />,
    info: <Info className="text-cyan-500" size={20} style={{ color: '#06b6d4' }} />
  };

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.1)',
    warning: 'rgba(249, 115, 22, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(6, 182, 212, 0.1)'
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.3)',
    warning: 'rgba(249, 115, 22, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(6, 182, 212, 0.3)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '12px',
        background: bgColors[type],
        backdropFilter: 'blur(8px)',
        border: `1px solid ${borderColors[type]}`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        zIndex: 1000,
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '14px',
        minWidth: '280px',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icons[type]}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
