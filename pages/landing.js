// pages/landing.js
import { useState } from 'react';
import Head from 'next/head';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: '🎉 You\'re on the list! Check your email.' });
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
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src="/cranksmith-logo.png" 
                alt="CrankSmith" 
                className="w-24 h-24 mx-auto mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 mx-auto rounded-xl items-center justify-center text-white font-bold text-3xl hidden"
                   style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #007aff 100%)' }}>
                C
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
              Your Bike. Optimized.
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Stop guessing. Start knowing. Real component data meets intelligent analysis.
            </p>

            {/* Early Access Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Get Early Access'}
                </button>
              </div>
              
              {status.message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {status.message}
                </div>
              )}
            </form>

            <p className="text-gray-400 mb-12">
              🚀 Join 150+ cyclists already optimizing their rides
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real Components</h3>
              <p className="text-gray-400">
                Actual Shimano & SRAM parts with real weights and specs. No generic calculators here.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Mechanic</h3>
              <p className="text-gray-400">
                Meet Riley, your 24/7 bike expert. Get personalized advice based on your exact setup.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-800/50 backdrop-blur">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Analysis</h3>
              <p className="text-gray-400">
                See speed, weight, and gear range impacts instantly. Make informed upgrade decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Built by Cyclists, for Cyclists</h2>
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

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Ride?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the beta and start making smarter component choices today.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Early Access ↑
            </button>
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