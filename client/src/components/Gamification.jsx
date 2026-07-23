import React from 'react';
import { Award, Flame, Star, Trophy } from 'lucide-react';

export default function Gamification({ badges, streak = 0 }) {
  const BADGES_DEFINITIONS = [
    { name: '7-Day Saver', desc: 'Maintained expense logging for 7 consecutive days.', icon: <Flame size={20} />, themeClass: 'badge-color-gold' },
    { name: 'Budget Guard', desc: 'Stayed below monthly budget ceiling.', icon: <Trophy size={20} />, themeClass: 'badge-color-violet' },
    { name: 'Savings Master', desc: 'Saved more than ₹5,000 this month.', icon: <Award size={20} />, themeClass: 'badge-color-green' },
    { name: 'Thrifty Ninja', desc: 'Spent less than 30% of target budget.', icon: <Star size={20} />, themeClass: 'badge-color-blue' }
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
          const badgeClass = isUnlocked ? def.themeClass : 'badge-locked';
          return (
            <div 
              key={def.name} 
              className={badgeClass}
              style={{ 
                padding: '12px', 
                borderRadius: '12px', 
                border: '1px solid var(--border-glass)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '8px', 
                borderRadius: '10px',
                display: 'flex'
              }}>
                {def.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: '700' }}>
                  {def.name}
                </h4>
                <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
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
