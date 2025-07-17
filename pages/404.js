import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEOHead from '../components/SEOHead';

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Popular tools and pages
  const popularPages = [
    {
      title: 'Bike Gear Calculator',
      description: 'Calculate optimal gear ratios for your bike',
      href: '/calculator',
      icon: '⚙️',
      color: 'from-brand-orange to-brand-yellow'
    },
    {
      title: 'Professional Bike Fit',
      description: 'Get your perfect bike fit measurements',
      href: '/bike-fit',
      icon: '🚴‍♂️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Tire Pressure Calculator',
      description: 'Find optimal tire pressure for your setup',
      href: '/tire-pressure',
      icon: '🔧',
      color: 'from-brand-blue to-brand-purple'
    },
    {
      title: 'Ask Riley AI',
      description: 'Get expert cycling advice from AI',
      href: '/ask-riley',
      icon: '🤖',
      color: 'from-brand-green to-emerald-400'
    }
  ];

  // Common page suggestions based on URL patterns
  const getPageSuggestion = (path) => {
    const suggestions = {
      '/performance': '/performance-analysis',
      '/analysis': '/performance-analysis',
      '/gear': '/calculator',
      '/calc': '/calculator',
      '/calculator': '/calculator',
      '/fit': '/bike-fit',
      '/bike-fit': '/bike-fit',
      '/tire': '/tire-pressure',
      '/pressure': '/tire-pressure',
      '/riley': '/ask-riley',
      '/ai': '/ask-riley',
      '/chat': '/ask-riley',
      '/about': '/about',
      '/docs': '/docs',
      '/help': '/docs',
      '/blog': '/blog'
    };

    // Check for partial matches
    for (const [pattern, suggestion] of Object.entries(suggestions)) {
      if (path.toLowerCase().includes(pattern)) {
        return suggestion;
      }
    }
    return '/calculator'; // Default fallback
  };

  const suggestedPage = getPageSuggestion(router.asPath);

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push(suggestedPage);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, router, suggestedPage]);

  const handleCancelRedirect = () => {
    setAutoRedirect(false);
  };

  return (
    <>
      <SEOHead 
        title="Page Not Found - CrankSmith"
        description="The page you're looking for doesn't exist. Explore our bike calculators and tools instead."
        url="https://cranksmith.com/404"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-purple to-brand-green flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-white/20 mb-4">
              404
            </div>
            <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-5xl">🚴‍♂️</span>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Looks like you took a wrong turn!
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            The page you&apos;re looking for doesn&apos;t exist, but don&apos;t worry - we&apos;ll help you find what you need.
          </p>

          {/* Auto Redirect Notice */}
          {autoRedirect && (
            <div className="mb-8 p-4 bg-white/10 rounded-lg border border-white/20 max-w-md mx-auto">
              <p className="text-white mb-2">
                Redirecting you to our{' '}
                <Link href={suggestedPage} className="text-yellow-300 hover:text-yellow-200 underline">
                  {suggestedPage === '/calculator' ? 'Bike Calculator' : 
                   suggestedPage === '/bike-fit' ? 'Bike Fit Calculator' :
                   suggestedPage === '/tire-pressure' ? 'Tire Pressure Calculator' :
                   suggestedPage === '/ask-riley' ? 'AI Expert Riley' :
                   suggestedPage === '/performance-analysis' ? 'Performance Analysis' :
                   'main page'}
                </Link>
                {' '}in {countdown} seconds
              </p>
              <button
                onClick={handleCancelRedirect}
                className="text-sm text-blue-200 hover:text-white underline"
              >
                Cancel auto-redirect
              </button>
            </div>
          )}

          {/* Popular Tools Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8">
              Popular Cycling Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPages.map((page, index) => (
                <Link
                  key={page.title}
                  href={page.href}
                  className="card bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center hover:bg-white/15 hover-lift transition-all duration-300 cursor-pointer"
                  onClick={() => setAutoRedirect(false)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${page.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{page.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {page.title}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/"
              className="btn-primary"
              onClick={() => setAutoRedirect(false)}
            >
              <span>Go Home</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            
            <Link 
              href="/calculator"
              className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => setAutoRedirect(false)}
            >
              <span>Start Calculating</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-sm text-blue-200">
            <p className="mb-2">
              Still can't find what you're looking for?{' '}
              <Link href="/ask-riley" className="text-yellow-300 hover:text-yellow-200 underline">
                Ask Riley, our AI expert
              </Link>
            </p>
            <p>
              Or visit our{' '}
              <Link href="/docs" className="text-yellow-300 hover:text-yellow-200 underline">
                documentation
              </Link>
              {' '}for detailed guides
            </p>
          </div>
        </div>
      </div>
    </>
  );
}