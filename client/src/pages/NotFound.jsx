import React from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      width: '100%'
    }}>
      <div className="glass animated" style={{ 
        maxWidth: '480px', 
        width: '100%', 
        padding: '40px', 
        textAlign: 'center',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ 
          background: 'var(--primary-glow)', 
          color: 'var(--primary)', 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <HelpCircle size={28} />
        </div>
        
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--primary)', margin: '0 0 10px 0' }}>404</h1>
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Page Not Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.5', marginBottom: '32px' }}>
          The path you are looking for does not exist or has been moved. Use the button below to navigate to the homepage.
        </p>

        <Link 
          to="/" 
          className="btn btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 20px',
            fontSize: '13.5px',
            textDecoration: 'none',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Home size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
