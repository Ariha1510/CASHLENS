import React from 'react';

export default function SkeletonLoader({ type = 'dashboard' }) {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
    borderRadius: '8px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {type === 'dashboard' && (
        <>
          {/* Skeletons for KPIs */}
          <div className="grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass" style={{ height: '80px', ...shimmerStyle }} />
            ))}
          </div>
          {/* Skeletons for Large panels */}
          <div className="grid-cols-2">
            <div className="glass" style={{ height: '320px', ...shimmerStyle }} />
            <div className="glass" style={{ height: '320px', ...shimmerStyle }} />
          </div>
        </>
      )}

      {type === 'expenses' && (
        <div className="grid-cols-2">
          <div className="glass" style={{ height: '400px', ...shimmerStyle }} />
          <div className="glass" style={{ height: '400px', ...shimmerStyle }} />
        </div>
      )}
    </div>
  );
}
