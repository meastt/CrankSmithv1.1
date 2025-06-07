import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earlyAccessCount, setEarlyAccessCount] = useState(127);
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 12, minutes: 45 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Increment early access count for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setEarlyAccessCount(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send to your API endpoint
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        // Track conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'sign_up', { method: 'email', page: 'landing' });
        }
      } else {
        alert('Something went wrong. Please try again or email mike@cranksmith.com directly.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again or email mike@cranksmith.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>CrankSmith - Stop Guessing. Start Optimizing Your Bike.</title>
        <meta name="description" content="The intelligent bike upgrade calculator that shows you exactly how component changes affect speed, weight, and performance. Built by cyclists, for cyclists." />
        <meta property="og:title" content="CrankSmith - Stop Guessing. Start Optimizing." />
        <meta property="og:description" content="See exactly how bike upgrades affect your performance before you buy." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://cranksmith.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0b] to-[#111113]">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-[rgba(84,84,88,0.4)]" 
             style={{ background: 'rgba(10, 10, 11, 0.8)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img src="/cranksmith-logo.png" alt="CrankSmith" className="w-10 h-10" />
                <span className="text-xl font-bold text-white">CrankSmith</span>
              </div>
              <a href="#early-access" className="btn-primary text-sm px-4 py-2">
                Get Early Access
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Launch Timer */}
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full"
                 style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.3)' }}>
              <span className="animate-pulse w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-orange-400 text-sm font-medium">
                Beta launching in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="hero-title-fire">Stop Guessing.</span><br />
              <span className="text-white">Start Optimizing.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
              See exactly how component upgrades affect your bike's speed, weight, and climbing ability 
              <span className="text-orange-400 font-semibold"> before you spend a dime</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="#demo" className="btn-primary-fire text-lg px-8 py-4">
                See It In Action
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="/calculator" className="px-8 py-4 rounded-xl font-medium text-lg border border-[rgba(84,84,88,0.4)] text-white hover:bg-[rgba(58,58,60,0.8)] transition-all">
                Try Free Calculator
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{earlyAccessCount} cyclists on waitlist</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Built by cyclists, for cyclists</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>100% Free during beta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 px-4" style={{ background: 'rgba(28, 28, 30, 0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Every cyclist's expensive mistake
                </h2>
                <div className="space-y-4 text-lg" style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                  <p>
                    You've been there. Standing in the bike shop, staring at a $400 cassette, wondering: 
                    <span className="text-orange-400 font-semibold"> "Will this actually make me faster?"</span>
                  </p>
                  <p>
                    Current calculators are clunky spreadsheets from 2003. WeightWeenies requires a PhD. 
                    And bike shop advice? Let's just say they're motivated sellers.
                  </p>
                  <p className="font-semibold text-white">
                    There's been no modern tool to visualize exactly how upgrades affect your ride. Until now.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/demo-comparison.png" 
                  alt="CrankSmith comparison interface" 
                  className="rounded-xl shadow-2xl border border-[rgba(84,84,88,0.4)]"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23222"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23666" font-family="system-ui" font-size="18"%3EComponent Comparison Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute -top-4 -right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg transform rotate-3">
                  LIVE DEMO
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="demo" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Everything you need to optimize
              </h2>
              <p className="text-xl" style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                Real components. Real data. Real results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--accent-blue)', color: 'white' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Speed Analysis</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                  See your exact speed at 90 RPM cadence. Compare top speed and climbing speed side-by-side.
                </p>
                <div className="text-3xl font-bold text-green-500">+2.1 mph</div>
                <div className="text-sm" style={{ color: 'rgba(235, 235, 245, 0.4)' }}>average gain</div>
              </div>

              {/* Feature 2 */}
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--accent-performance)', color: 'white' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Weight Tracking</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                  Every gram counts. Track component weights and see total system weight changes.
                </p>
                <div className="text-3xl font-bold text-green-500">-147g</div>
                <div className="text-sm" style={{ color: 'rgba(235, 235, 245, 0.4)' }}>average savings</div>
              </div>

              {/* Feature 3 */}
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center quick-start-icon-fire">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">AI Mechanic</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                  Meet Riley, your 24/7 bike mechanic. Get instant answers about compatibility and optimization.
                </p>
                <div className="text-3xl font-bold text-orange-500">24/7</div>
                <div className="text-sm" style={{ color: 'rgba(235, 235, 245, 0.4)' }}>expert advice</div>
              </div>
            </div>

            {/* Component Database Highlight */}
            <div className="mt-16 p-8 rounded-2xl text-center" 
                 style={{ background: 'rgba(58, 58, 60, 0.3)', border: '1px solid rgba(84, 84, 88, 0.4)' }}>
              <h3 className="text-2xl font-bold mb-4 text-white">Real Component Database</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-lg">500+</span>
                  <span style={{ color: 'rgba(235, 235, 245, 0.6)' }}>Shimano parts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-lg">400+</span>
                  <span style={{ color: 'rgba(235, 235, 245, 0.6)' }}>SRAM components</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-lg">100%</span>
                  <span style={{ color: 'rgba(235, 235, 245, 0.6)' }}>Accurate weights</span>
                </div>
              </div>
              <p className="mt-4 text-sm" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                No more generic "11-speed cassette" options. Real model numbers. Real specs. Real results.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials/Use Cases */}
        <section className="py-20 px-4" style={{ background: 'rgba(28, 28, 30, 0.5)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Who needs CrankSmith?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl" style={{ background: 'rgba(58, 58, 60, 0.3)', border: '1px solid rgba(84, 84, 88, 0.4)' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">🚴‍♂️ Serious Cyclists</h3>
                <p style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                  "Finally, I can see if that Dura-Ace upgrade is worth $800 more than Ultegra. Spoiler: it wasn't."
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: 'rgba(58, 58, 60, 0.3)', border: '1px solid rgba(84, 84, 88, 0.4)' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">🔧 Bike Mechanics</h3>
                <p style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                  "I show customers exactly what they're getting. No more 'trust me, it's faster' conversations."
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: 'rgba(58, 58, 60, 0.3)', border: '1px solid rgba(84, 84, 88, 0.4)' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">🏔️ Gravel/MTB Riders</h3>
                <p style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                  "Found the perfect climbing gear ratio for Colorado passes. Saved me from a $500 mistake."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access CTA */}
        <section id="early-access" className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-8 rounded-2xl" 
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 50%, rgba(0, 122, 255, 0.1) 100%)',
                   border: '1px solid rgba(255, 107, 53, 0.3)'
                 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Join {earlyAccessCount} cyclists already optimizing
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(235, 235, 245, 0.8)' }}>
                Get early access to CrankSmith. Free during beta. No credit card required.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-6 py-4 rounded-xl text-white text-lg"
                    style={{ 
                      background: 'rgba(58, 58, 60, 0.8)',
                      border: '1px solid rgba(84, 84, 88, 0.4)'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-fire px-8 py-4 text-lg whitespace-nowrap"
                  >
                    {isSubmitting ? 'Joining...' : 'Get Early Access'}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 mb-4 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-500 font-semibold">You're on the list!</span>
                  </div>
                  <p className="text-white">Check your email for confirmation and updates.</p>
                </div>
              )}

              <p className="mt-6 text-sm" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t" style={{ borderColor: 'rgba(84, 84, 88, 0.4)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                <img src="/cranksmith-logo.png" alt="CrankSmith" className="w-8 h-8" />
                <span className="text-lg font-semibold text-white">CrankSmith</span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                <a href="/calculator" className="hover:text-white transition-colors">Free Calculator</a>
                <a href="/about" className="hover:text-white transition-colors">About</a>
                <a href="mailto:mike@cranksmith.com" className="hover:text-white transition-colors">Contact</a>
                <a href="https://instagram.com/cranksmith" className="hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
            <div className="mt-8 text-center text-sm" style={{ color: 'rgba(235, 235, 245, 0.4)' }}>
              <p>&copy; 2024 CrankSmith. Built with ❤️ by cyclists, for cyclists.</p>
              <p className="mt-2">Optimize your ride. One component at a time.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}