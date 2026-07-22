import React from 'react';
import { Award, Flame, Star, Trophy } from 'lucide-react';

export default function Gamification({ badges, streak = 0 }) {
  const BADGES_DEFINITIONS = [
    { name: '7-Day Saver', desc: 'Maintained expense logging for 7 consecutive days.', icon: <Flame size={20} style={{ color: '#f97316' }} /> },
    { name: 'Budget Guard', desc: 'Stayed below monthly budget ceiling.', icon: <Trophy size={20} style={{ color: '#eab308' }} /> },
    { name: 'Savings Master', desc: 'Saved more than ₹5,000 this month.', icon: <Award size={20} style={{ color: '#06b6d4' }} /> },
    { name: 'Thrifty Ninja', desc: 'Spent less than 30% of target budget.', icon: <Star size={20} style={{ color: '#d946ef' }} /> }
  ];

  return (
    <div className="glass animated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} /> Achievements Hub
        </h3>
        {streak > 0 && (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: 'rgba(249, 115, 22, 0.1)', 
            border: '1px solid var(--warning)',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--warning)'
          }}>
            <Flame size={14} /> {streak} Day Streak
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {BADGES_DEFINITIONS.map(def => {
          const isUnlocked = badges.some(b => b.badge_name === def.name);
          return (
            <div 
              key={def.name} 
              style={{ 
                padding: '12px', 
                borderRadius: '12px', 
                background: isUnlocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)', 
                border: `1px solid ${isUnlocked ? 'var(--border-neon)' : 'var(--border-glass)'}`,
                opacity: isUnlocked ? 1 : 0.4,
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <div style={{ 
                background: isUnlocked ? 'rgba(255,255,255,0.05)' : 'none', 
                padding: '8px', 
                borderRadius: '10px',
                display: 'flex'
              }}>
                {def.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {def.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {def.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
