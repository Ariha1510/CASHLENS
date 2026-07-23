import React from 'react';
import { Wallet, Landmark, Award, Gift, Sparkles } from 'lucide-react';

export default function CashbackVault({ wallet = 120.00, coins = 2400, currency = '₹' }) {
  const coupons = [
    { title: "20% off Domino's Pizza", code: "DOMINOS20", expiry: "30 Aug" },
    { title: "15% off Amazon Books", code: "AMZBOOKS15", expiry: "15 Sep" },
    { title: "Free Ride Uber Pass", code: "UBERPASS", expiry: "31 Aug" }
  ];

  return (
    <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} /> Cashback Vault
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Wallet Bal */}
        <div style={{ 
          padding: '12px', 
          background: 'rgba(16, 185, 129, 0.05)', 
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Wallet size={20} style={{ color: 'var(--success)' }} />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wallet Balance</span>
            <p style={{ fontSize: '16px', fontWeight: '800' }}>{currency}{wallet.toFixed(2)}</p>
          </div>
        </div>

        {/* Coins Bal */}
        <div style={{ 
          padding: '12px', 
          background: 'rgba(6, 182, 212, 0.05)', 
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Award size={20} style={{ color: 'var(--primary)' }} />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CashCoins Earned</span>
            <p style={{ fontSize: '16px', fontWeight: '800' }}>{coins} Coins</p>
          </div>
        </div>
      </div>

      {/* Rewards Milestones Progress */}
      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Next Reward Milestone</span>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Need 600 more CashCoins</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar green" style={{ width: '80%' }}></div>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
          80% Completed (2400 / 3000 Coins)
        </span>
      </div>

      {/* Coupons */}
      <div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          🎁 Claimed Vouchers & Coupons
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {coupons.map(coupon => (
            <div 
              key={coupon.code}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px dashed var(--border-glass)',
                fontSize: '12.5px'
              }}
            >
              <div>
                <span style={{ fontWeight: '600', display: 'block' }}>{coupon.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Code: <strong>{coupon.code}</strong> • Expires: {coupon.expiry}</span>
              </div>
              <span style={{ 
                background: 'var(--secondary-glow)', 
                color: 'var(--secondary)', 
                padding: '3px 8px', 
                borderRadius: '8px', 
                fontSize: '10px',
                fontWeight: '700',
                border: '1px solid var(--secondary)'
              }}>
                CLAIMED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
