// pages/index.js
import { useState, useEffect } from 'react';
import Landing from './landing';
import CalculatorPage from './calculator';

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if they have the secret password
    const urlParams = new URLSearchParams(window.location.search);
    const hasPassword = urlParams.get('beta') === 'true';
    const rememberedUser = localStorage.getItem('cranksmith_beta_access') === 'true';
    
    if (hasPassword || rememberedUser) {
      setShowApp(true);
      // Remember them for next time
      if (hasPassword) {
        localStorage.setItem('cranksmith_beta_access', 'true');
      }
    }
    
    setLoading(false);
  }, []);

  // Quick loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0b'
      }}>
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  // Show app or landing based on access
  return showApp ? <CalculatorPage /> : <Landing />;
}