import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Key, Mail } from 'lucide-react';

export default function Login({ showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showToast('Welcome back to CASHCRUSH!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', width: '100%' }}>
      <div className="glass animated" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            💸 CASHCRUSH
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
            Crush budgets, not your allowance! (Supabase Portal)
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="student@college.edu"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          New to CASHCRUSH?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
