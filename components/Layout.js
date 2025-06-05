import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, #111113 100%)' }}>
      {/* Apple-style Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" 
              style={{ 
                background: 'rgba(10, 10, 11, 0.8)', 
                borderColor: 'var(--border-subtle)' 
              }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold"
                   style={{ 
                     background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
                     fontSize: '14px'
                   }}>
                C
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  CrankSmith
                </div>
                <div className="text-xs tracking-wide -mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Precision Performance
                </div>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" 
                    className="text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: 'var(--accent-blue)' }}>
                Calculator
              </Link>
              <Link href="#garage" 
                    className="text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-secondary)' }}>
                My Garage
              </Link>
              <Link href="#about" 
                    className="text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-secondary)' }}>
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ color: 'var(--text-primary)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8" 
              style={{ 
                borderColor: 'var(--border-subtle)', 
                background: 'var(--bg-primary)' 
              }}>
        <div className="container mx-auto px-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
          <p className="text-sm">
            &copy; 2024 CrankSmith. Precision gear calculations for serious cyclists.
          </p>
          <p className="mt-2 text-xs">
            Forge your perfect ride • Beta Version
          </p>
        </div>
      </footer>
    </div>
  );
}