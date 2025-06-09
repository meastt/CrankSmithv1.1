import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, #111113 100%)' }}>
      {/* Apple-style Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" 
              style={{ 
                background: '#010912', 
                borderColor: 'var(--border-subtle)' 
              }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-40">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/cranksmith-logo.png" 
                  alt="CrankSmith Logo" 
                  className="w-28 h-28 md:w-40 md:h-40 object-contain"
                  onError={(e) => {
                    // Fallback to "C" logo if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback logo - hidden by default */}
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-lg items-center justify-center text-white font-semibold hidden"
                     style={{ 
                       background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
                       fontSize: '24px'
                     }}>
                  C
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-12 ml-16">
              <Link href="/tire-pressure" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                Tire Pressure
              </Link>
              <button 
                onClick={() => {
                  const garageSection = document.getElementById('garage-section');
                  if (garageSection) {
                    garageSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-lg font-medium text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                My Garage
              </button>
              <Link href="/about" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/early-access" className="hidden md:block">
                <button className="px-4 py-2 text-lg font-medium text-white bg-[var(--accent-blue)] rounded-lg hover:bg-[var(--accent-blue-hover)] transition-colors">
                  Get Early Access
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
             style={{ background: 'rgba(10, 10, 11, 0.95)' }}>
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <Link href="/calculator" 
                  className="block text-base font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--accent-blue)' }}
                  onClick={() => setIsMobileMenuOpen(false)}>
              Gear Calculator
            </Link>
            <Link href="/tire-pressure" 
                  className="block text-base font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}>
              Tire Pressure
            </Link>
            <button 
              onClick={() => {
                const garageSection = document.getElementById('garage-section');
                if (garageSection) {
                  garageSection.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }
              }}
              className="block w-full text-left text-base font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              My Garage
            </button>
            <Link href="/about" 
                  className="block text-base font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
          </nav>
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
            &copy; 2025 CrankSmith. Serious Analysis for serious cyclists.
          </p>
          <p className="mt-2 text-xs">
          Forge Your Perfect Ride. • Beta Version 1
          </p>
        </div>
      </footer>
    </div>
  );
}

