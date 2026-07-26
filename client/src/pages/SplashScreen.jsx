import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

const SYMBOLS = ['₹', '🪙', '₹', '🪙', '📊', '📈'];
const LOADING_TEXTS = [
  "Analyzing your spending...",
  "Preparing your dashboard...",
  "Loading insights...",
  "Calculating metrics..."
];

export default function SplashScreen() {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);

  // Rotate loading texts during splash
  useEffect(() => {
    let index = 0;
    const textInterval = setInterval(() => {
      index = (index + 1) % LOADING_TEXTS.length;
      setLoadingText(LOADING_TEXTS[index]);
    }, 700);
    return () => clearInterval(textInterval);
  }, []);

  // Authentication check & redirect flow
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Allow the beautiful animation to show for 2.5 seconds
      await new Promise(resolve => setTimeout(resolve, 2500));

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Random particles for background
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      size: Math.random() * 16 + 14,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * -15,
      opacity: Math.random() * 0.15 + 0.05
    }));
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #10B981, #0F766E)',
      overflow: 'hidden',
      position: 'relative',
      color: '#ffffff',
      fontFamily: 'Poppins, sans-serif'
    }}>
      
      {/* Background Floating Rupee and Coin Particles */}
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
              filter: 'blur(0.5px)',
              userSelect: 'none',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      {/* Main Central Splash Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px 48px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
          width: '90%'
        }}
      >
        {/* App Logo */}
        <motion.img 
          src={logo} 
          alt="CASHLENS Logo" 
          animate={{
            scale: [1, 1.06, 0.98, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ 
            width: '100px', 
            height: 'auto', 
            marginBottom: '20px',
            objectFit: 'contain'
          }} 
        />

        {/* App Name */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          letterSpacing: '1px',
          margin: '0 0 8px 0',
          textShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          CASHLENS
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.85)',
          margin: '0 0 32px 0',
          fontWeight: '500'
        }}>
          Spend Smart. Save Smarter.
        </p>

        {/* Spinner Loader */}
        <div style={{
          width: '44px',
          height: '44px',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          borderTop: '4px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px auto'
        }} />

        {/* Loading text status message */}
        <span style={{
          display: 'block',
          fontSize: '13.5px',
          color: 'rgba(255, 255, 255, 0.75)',
          fontWeight: '500',
          minHeight: '20px'
        }}>
          {loadingText}
        </span>
      </motion.div>

      {/* Footer Branding info */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        textAlign: 'center',
        zIndex: 2,
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.65)',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: 0, fontWeight: '600' }}>Version 1.0</p>
        <p style={{ margin: 0 }}>Made with ❤️ for Students</p>
      </div>

      {/* Inject custom spin animation standard style block */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
