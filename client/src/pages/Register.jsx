import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, User, Mail, Key } from 'lucide-react';

export default function Register({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      // In Supabase SQL setup, a profile trigger usually does this or we can insert manually.
      // Let's insert a record in profiles table.
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, name: name }]);
        
        // Also insert default budget limit
        await supabase
          .from('budgets')
          .insert([{ user_id: data.user.id, monthly_budget: 8000.00 }]);
      }

      showToast('Account created! Please check your email for confirmation or log in.', 'success');
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
            💸 Join CASHCRUSH
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
            Sign up to track your college spending limit!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="Alex Mercer"
                style={{ paddingLeft: '40px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

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
                placeholder="Create a strong password"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Get Started'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
