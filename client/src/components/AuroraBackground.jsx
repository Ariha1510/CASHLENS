import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = ['₹', '$', '📈', '🪙', '📊', '💳', '💎'];

export default function AuroraBackground({ children }) {
  // Generate random stable floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100, // percentage position along the width
      size: Math.random() * 14 + 12, // font size: 12px to 26px
      duration: Math.random() * 25 + 25, // slow drift speed: 25s to 50s
      delay: Math.random() * -30, // negative delay so particles start spread out
      opacity: Math.random() * 0.05 + 0.02, // very faint, subtle background opacity (2% to 7%)
    }));
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-dark-image)',
      backgroundSize: 'cover',
      transition: 'background 0.5s ease'
    }}>
      
      {/* Aurora Blob 1 (Teal/Cyan) */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          top: '-160px',
          left: '-80px',
          height: '500px',
          width: '500px',
          borderRadius: '50%',
          background: 'var(--aurora-blob-1)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Aurora Blob 2 (Emerald Green) */}
      <motion.div
        animate={{
          x: [0, -70, 30, 0],
          y: [0, 50, -80, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          height: '500px',
          width: '500px',
          borderRadius: '50%',
          background: 'var(--aurora-blob-2)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Aurora Blob 3 (Subtle Blue) */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: '400px',
          width: '400px',
          borderRadius: '50%',
          background: 'var(--aurora-blob-3)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Floating Financial Icons / Minimalist Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, p.opacity, p.opacity, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              fontSize: `${p.size}px`,
              color: 'var(--text-primary)',
              filter: 'blur(0.5px)',
              userSelect: 'none',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500'
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
