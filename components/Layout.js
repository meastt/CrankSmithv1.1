"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ErrorBoundary from './ErrorBoundary';
import EmailCollectionPopup from './EmailCollectionPopup';

export default function Layout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/calculator', label: 'Gear Calculator', icon: '⚙️' },
    { href: '/bike-fit', label: 'Bike Fit', icon: '🚴‍♂️' },
    { href: '/tire-pressure', label: 'Tire Pressure', icon: '🔧' },
    { href: '/ask-riley', label: 'Ask Riley', icon: '🤖' },
    { href: '/blog', label: 'Learn', icon: '📚' },
    { href: '/about', label: 'About', icon: '👥' },
  ];

  const isActiveLink = (href) => {
    return router.pathname === href;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      {/* Simple header without client-side state */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-premium border-b border-neutral-200 dark:border-neutral-800">
        <nav className="container-responsive">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-performance rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg p-1 bg-white dark:bg-neutral-800">
                  <Image 
                    src="/cranksmith-logo.png" 
                    alt="CrankSmith" 
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-performance bg-clip-text text-transparent">
                  CrankSmith
                </span>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Precision Gear Analysis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActiveLink(link.href)
                      ? 'text-brand-blue'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {isActiveLink(link.href) && (
                    <div className="absolute inset-0 bg-brand-blue/10 rounded-xl" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Actions - Simplified */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="https://instagram.com/cranksmithapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl hover:text-brand-blue transition-colors text-neutral-600 dark:text-neutral-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button - Now Functional */}
            <button 
              className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile menu content */}
            <div className="fixed top-20 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 z-40 md:hidden">
              <nav className="container-responsive py-4">
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActiveLink(link.href)
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                  
                  {/* Mobile Social Link */}
                  <Link 
                    href="https://instagram.com/cranksmithapp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-brand-blue"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="font-medium">Follow @cranksmithapp</span>
                  </Link>
                </div>
              </nav>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Email Collection Popup */}
      <EmailCollectionPopup />

      {/* Premium Footer */}
      <footer className="border-t mt-20 py-12 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1 bg-white dark:bg-neutral-800">
                  <Image 
                    src="/cranksmith-logo.png" 
                    alt="CrankSmith" 
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-performance bg-clip-text text-transparent">
                  CrankSmith
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Precision tools for modern cyclists. Analyze your gear ratios, optimize your setup, and ride with confidence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Tools</h3>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm hover:text-brand-blue transition-colors text-neutral-600 dark:text-neutral-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Connect</h3>
              <div className="space-y-2">
                <a 
                  href="mailto:mike@cranksmith.com" 
                  className="block text-sm hover:text-brand-blue transition-colors text-neutral-600 dark:text-neutral-400"
                >
                  mike@cranksmith.com
                </a>
                <a 
                  href="https://instagram.com/cranksmithapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm hover:text-brand-blue transition-colors text-neutral-600 dark:text-neutral-400"
                >
                  @cranksmithapp
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} CrankSmith. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="/docs" className="text-xs hover:text-brand-blue transition-colors text-neutral-500 dark:text-neutral-400">
                Docs
              </Link>
              <Link href="/blog" className="text-xs hover:text-brand-blue transition-colors text-neutral-500 dark:text-neutral-400">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

