// pages/index.js - COMPLETE REPLACEMENT
import { useState, useEffect } from 'react';
import Landing from './landing';
import CalculatorPage from './calculator';

// Email Verification Component
function EmailVerificationPrompt({ onVerify, onSkip }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    try {
      await onVerify(email);
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#010912' }}>
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur rounded-xl p-8 border border-gray-700 mx-auto mt-20">
        <div className="text-center mb-6">
          {/* Logo */}
          <img 
            src="/beta-hero.png" 
            alt="CrankSmith Beta" 
            className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-xl flex items-center justify-center text-white font-bold text-4xl hidden"
               style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #007aff 100%)' }}>
            C
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to CrankSmith Beta</h1>
          <p className="text-gray-300">Enter your email to access the beta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400"
              required
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Beta'}
          </button>
        </form>
        
        <div className="text-center mt-6 space-y-2">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-300 text-sm underline"
          >
            Don't have access? Sign up for early access
          </button>
          <div className="text-xs text-gray-500">
            or use the direct link from your welcome email
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    console.log('Checking beta access...');
    
    // Method 1: Check URL parameter (for direct links from email)
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlAccess = urlParams.get('beta') === 'true';
    
    if (hasUrlAccess) {
      console.log('URL access granted');
      localStorage.setItem('cranksmith_beta_verified', 'true');
      setShowApp(true);
      setLoading(false);
      return;
    }
    
    // Method 2: Check if user was previously verified
    const storedAccess = localStorage.getItem('cranksmith_beta_verified') === 'true';
    
    if (storedAccess) {
      console.log('Stored access found');
      setShowApp(true);
      setLoading(false);
      return;
    }
    
    // Method 3: Check if they have an email stored that we can verify
    const storedEmail = localStorage.getItem('cranksmith_beta_email');
    if (storedEmail) {
      console.log('Verifying stored email:', storedEmail);
      const hasAccess = await verifyEmail(storedEmail);
      if (hasAccess) {
        setShowApp(true);
        setLoading(false);
        return;
      }
    }
    
    // If no access found, show landing page
    console.log('No access found, showing landing page');
    setLoading(false);
  };

  const verifyEmail = async (email) => {
    try {
      console.log('Verifying email via API:', email);
      const response = await fetch('/api/verify-beta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      
      const data = await response.json();
      console.log('Verification response:', data);
      
      if (data.success && data.hasAccess) {
        localStorage.setItem('cranksmith_beta_verified', 'true');
        localStorage.setItem('cranksmith_beta_email', email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0b',
        color: 'white'
      }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div>Loading CrankSmith...</div>
        </div>
      </div>
    );
  }

  // Show app or landing based on access
  return showApp ? <CalculatorPage /> : <Landing />;
}