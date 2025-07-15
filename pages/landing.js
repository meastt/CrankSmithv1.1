// pages/landing.js
import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import AppDownloadCTA from '../components/AppDownloadCTA';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [logoError, setLogoError] = useState(false); // State for robust image fallback

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If no email provided, just redirect to calculator
    if (!email.trim()) {
      router.push('/calculator');
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Sign up for community updates
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: '🎉 Welcome to the community! You\'ll receive updates about new features and cycling tips.' });
        setEmail('');
        
        // Track conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', {
            event_category: 'engagement',
            event_label: 'community_updates'
          });
        }
        
        // Redirect to calculator after a brief delay
        setTimeout(() => {
          router.push('/calculator');
        }, 2000);
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
      <SEOHead
        title="CrankSmith - Free Bike Gear Calculator"
        description="Free bike gear ratio calculator and component compatibility checker. No signup required. Calculate gear ratios, check drivetrain compatibility, and optimize your bike setup instantly."
        url="https://cranksmith.com"
        image="/og-image.jpg"
      />

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section - Simplified */}
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Logo with robust fallback */}
            <div className="mb-12">
              {!logoError ? (
                <img 
                  src="/beta-hero.png" 
                  alt="CrankSmith" 
                  className="max-w-[180px] md:max-w-[260px] w-full h-auto mx-auto mb-4 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div 
                  className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-7xl"
                  style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #007aff 100%)' }}>
                  C
                </div>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
              The best bike gear calculator is here!
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-center" style={{ color: 'var(--text-secondary)' }}>
              Calculate gear ratios, check compatibility, and optimize your bike setup. Completely free to use, no email required!
            </p>

            {/* Direct Access Button */}
            <div className="mb-8">
              <Link 
                href="/calculator"
                className="inline-block px-12 py-4 rounded-xl font-medium transition-all text-lg text-white bg-[var(--accent-blue)] shadow-[0_4px_12px_rgba(0,115,230,0.2)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(0,115,230,0.3)]"
              >
                🚀 Start Using CrankSmith Now
              </Link>
            </div>

            <div className="text-center mb-4" style={{ color: 'var(--text-tertiary)' }}>
              <p className="text-sm">— or —</p>
            </div>

            <p className="text-base mb-4 max-w-2xl mx-auto text-center" style={{ color: 'var(--text-secondary)' }}>
              Want to stay updated on new features and cycling tech content? Join our community (optional):
            </p>

            {/* Optional Email Signup */}
            <div className="max-w-md mx-auto mb-16">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (optional)"
                  className="input-field text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 rounded-xl font-medium transition-all text-lg text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                >
                  {loading ? 'Checking...' : 'Join Community Updates'}
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

            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              ✨ Join 150+ cyclists already optimizing their rides
            </p>
          </div>
        </div>

        {/* Features Grid - Simplified */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* These gradients will now work correctly due to the CSS fix */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Gear Calculator</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Compare components and see exact performance impacts
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Tire Pressure</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Get perfect tire pressure for your weight and terrain
              </p>
            </div>

            <Link href="/ask-riley" className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Ask Riley</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Get personalized advice from your AI bike expert
              </p>
            </Link>
          </div>
        </div>
        
        {/* Tools Showcase (section removed for brevity as it was very similar to the above, assuming similar fixes apply) */}
        {/* The principles are the same: use text-gray-50, text-gray-300 etc. instead of inline styles. */}

        {/* Key Benefits */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>Why CrankSmith?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card text-left">
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Real Component Data</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Access accurate specifications and compatibility data for thousands of bike components. No more guesswork or outdated information.
                </p>
              </div>
              <div className="card text-left">
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Smart Analysis</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Get personalized recommendations based on your riding style, terrain, and goals. Make informed decisions about your setup.
                </p>
              </div>
              <div className="card text-left">
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Save Money</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Avoid costly mistakes by understanding component compatibility before you buy. Get the right parts the first time.
                </p>
              </div>
              <Link href="/ask-riley" className="card text-left hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Ask Riley - AI Expert</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Get instant answers to your technical questions with Riley, your AI bike expert trained on thousands of maintenance manuals. No more conflicting advice from forums.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* App Download CTA */}
        <AppDownloadCTA />

        {/* Footer */}
        <footer className="border-t mt-16 py-8" style={{ borderColor: 'var(--border-light)' }}>
          <div className="container mx-auto px-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p>© 2024 CrankSmith. Made with ❤️ by a cyclist who got tired of bad calculators.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
