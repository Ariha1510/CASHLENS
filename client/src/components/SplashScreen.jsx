import React from 'react';
import './SplashScreen.css';
import logo from '../assets/logo.png';

export default function SplashScreen({ fade }) {
  return (
    <div className={`splash-container ${fade ? 'fade-out' : ''}`}>
      <div className="logo-container">
        <img src={logo} alt="CASHLENS Logo" className="logo" />
        <h1 className="title">CASHLENS</h1>
        <p className="tagline">Crush budgets, not your allowance!</p>
        <div className="loader"></div>
      </div>
    </div>
  );
}
