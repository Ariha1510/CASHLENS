import React from 'react';
import { motion } from 'framer-motion';

export default function AuroraBackground({ children }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-dark)',
      transition: 'background-color 0.5s ease'
    }}>
      
      {/* Aurora Blob 1 */}
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

      {/* Aurora Blob 2 */}
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

      {/* Aurora Blob 3 */}
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

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
