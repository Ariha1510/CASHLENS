import React, { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh', 
          background: '#0f172a', 
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'sans-serif'
        }}>
          <div className="glass animated" style={{ 
            maxWidth: '500px', 
            width: '100%', 
            padding: '32px', 
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)'
          }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <ShieldAlert size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Something went wrong</h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.5', marginBottom: '24px' }}>
              CashLens encountered an unexpected runtime error. We've logged this details. Click below to refresh.
            </p>
            <button 
              onClick={this.handleReload} 
              className="btn btn-primary" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px',
                fontSize: '13.5px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <RefreshCw size={16} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
