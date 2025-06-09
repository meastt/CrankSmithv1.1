// pages/landing.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // First check if email is in beta list
      const verifyResponse = await fetch('/api/verify-beta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData.success && verifyData.hasAccess) {
        // Email is in beta list, grant access
        localStorage.setItem('cranksmith_beta_verified', 'true');
        localStorage.setItem('cranksmith_beta_email', email);
        router.push('/calculator');
        return;
      }

      // If not in beta list, sign up for early access
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: '🎉 You\'re on the list! Check your email for beta access.' });
        setEmail('');
        
        // Track conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', {
            event_category: 'engagement',
            event_label: 'early_access'
          });
        }
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CrankSmith - Bike Gear Calculator for Serious Cyclists</title>
        <meta name="description" content="Compare bike components and optimize your setup. Real parts, real math, real results. Join the beta." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <div className="min-h-screen" style={{ background: '#010309' }}>
        {/* Hero Section - Simplified */}
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <img 
                src="/beta-hero.png" 
                alt="CrankSmith" 
                className="max-w-xs md:max-w-lg w-full h-auto mx-auto mb-6 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-xl items-center justify-center text-white font-bold text-7xl hidden"
                   style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #007aff 100%)' }}>
                C
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
              Your Bike. Optimized.
            </h1>
            
            <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
              Stop guessing. Start knowing. Real component data meets intelligent analysis.
            </p>

            {/* Early Access Form - More Prominent */}
            <div className="max-w-md mx-auto mb-16">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-xl font-medium transition-all text-lg"
                  style={{ 
                    background: 'var(--accent-blue)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 115, 230, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 115, 230, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 115, 230, 0.2)';
                  }}
                >
                  {loading ? 'Checking...' : 'Get Started'}
                </button>
              </form>
              
              {status.message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {status.message}
                </div>
              )}
            </div>

            <p className="text-gray-400">
              🚀 Join 150+ cyclists already optimizing their rides
            </p>
          </div>
        </div>

        {/* Features Grid - Simplified */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Gear Calculator</h3>
              <p className="text-gray-400">
                Compare components and see exact performance impacts
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tire Pressure</h3>
              <p className="text-gray-400">
                Get perfect tire pressure for your weight and terrain
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Riley</h3>
              <p className="text-gray-400">
                Get personalized advice from your AI bike expert
              </p>
            </div>
          </div>
        </div>

        {/* Tools Showcase */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Tools for Cyclists</h2>
            <p className="text-lg text-gray-300">
              Everything you need to optimize your ride, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--accent-blue)', color: 'white' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Gear Calculator
              </h3>
              <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--surface-elevated)' }}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
                    <span style={{ color: 'var(--text-secondary)' }}>31.2 mph</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
                    <span style={{ color: 'var(--text-secondary)' }}>33.1 mph</span>
                  </div>
                  <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-xl font-bold" style={{ color: 'var(--accent-performance)' }}>
                      +1.9 mph
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Compare components and see exact performance impacts
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--accent-orange)', color: 'white' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Tire Pressure
              </h3>
              <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--surface-elevated)' }}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Rider Weight</span>
                    <span style={{ color: 'var(--text-secondary)' }}>75 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Recommended</span>
                    <span style={{ color: 'var(--text-secondary)' }}>28 psi</span>
                  </div>
                  <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Perfect for gravel
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Get perfect tire pressure for your weight and terrain
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center quick-start-icon-fire">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Ask Riley
              </h3>
              <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--surface-elevated)' }}>
                <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                  "That 11-34T cassette will give you much easier climbing gears. Perfect for steep hills!"
                </p>
                <div className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  - Riley, AI Mechanic
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Get personalized recommendations from our AI expert
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl font-medium transition-all text-lg"
              style={{ 
                background: 'var(--accent-blue)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0, 115, 230, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 115, 230, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 115, 230, 0.2)';
              }}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Social Proof - Simplified */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Built by Cyclists, for Cyclists</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur text-left">
                <p className="italic mb-4">
                  "Finally, a tool that understands modern bike components. The crossover compatibility info alone saved me $500."
                </p>
                <p className="text-sm text-gray-400">- Sarah K., Gravel Racer</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur text-left">
                <p className="italic mb-4">
                  "Riley helped me choose between GX and X01. Turns out GX was the smarter choice for my riding."
                </p>
                <p className="text-sm text-gray-400">- Mike T., MTB Enthusiast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 CrankSmith. Made with ❤️ by a cyclist who got tired of bad calculators.</p>
          </div>
        </footer>
      </div>
    </>
  );
}