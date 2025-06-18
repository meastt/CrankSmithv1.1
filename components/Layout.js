"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import InstallBanner from './InstallBanner';
import FloatingInstallButton from './FloatingInstallButton';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, #111113 100%)' }}>
      {/* Install Banner */}
      <InstallBanner />
      
      {/* PWA Debug Tool - Remove this after testing */}
      {/* <PWATest /> */}
      
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
                  className="w-44 h-44 md:w-56 md:h-56 object-contain"
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
            <nav className="hidden md:flex items-center space-x-12 ml-16 mt-8">
              <Link href="/calculator" className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                onClick={e => {
                  if (window.location.pathname === '/calculator') {
                    e.preventDefault();
                    window.dispatchEvent(new Event('reset-calculator'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                Bike Gear Calculator
              </Link>
              <Link href="/tire-pressure" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                Tire Pressure Calculator
              </Link>
              <Link href="/blog" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-lg font-medium text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4 mt-8">
              <Link href="https://instagram.com/cranksmithapp" target="_blank" rel="noopener noreferrer" className="hidden md:block">
                <svg 
                  className="w-6 h-6 text-gray-300 hover:text-white transition-colors" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
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
                  onClick={e => {
                    if (window.location.pathname === '/calculator') {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new Event('reset-calculator'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}>
              Bike Gear Calculator
            </Link>
            <Link href="/tire-pressure" 
                  className="block text-base font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}>
              Tire Pressure Calculator
            </Link>
            <Link href="/blog" 
                  className="block text-base font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsMobileMenuOpen(false)}>
              Blog
            </Link>
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

      {/* Floating Install Button */}
      <FloatingInstallButton />

      {/* Footer */}
      <footer className="border-t mt-16 py-8" 
              style={{ 
                borderColor: 'var(--border-subtle)', 
                background: 'var(--bg-primary)' 
              }}>
        <div className="container mx-auto px-6 text-center flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              &copy; 2025 CrankSmith. All rights reserved.
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Precision tools for modern cyclists.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <a href="/docs" className="hover:text-[var(--accent-blue)] transition-colors">Docs</a>
            <a href="/blog" className="hover:text-[var(--accent-blue)] transition-colors">Blog</a>
            <a href="mailto:mike@cranksmith.com" className="hover:text-[var(--accent-blue)] transition-colors">Contact</a>
            <a href="/about" className="hover:text-[var(--accent-blue)] transition-colors">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

