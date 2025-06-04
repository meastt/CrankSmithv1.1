import React from 'react';
import Head from 'next/head';
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 relative">
                {/* Anvil and Gear Logo */}
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  {/* Anvil base */}
                  <path 
                    d="M12 28 L36 28 L38 32 L34 36 L14 36 L10 32 Z" 
                    fill="#4b5563" 
                    stroke="#9ca3af" 
                    strokeWidth="0.5"
                  />
                  {/* Anvil top */}
                  <path 
                    d="M14 24 L34 24 L36 28 L12 28 Z" 
                    fill="#6b7280" 
                    stroke="#9ca3af" 
                    strokeWidth="0.5"
                  />
                  {/* Gear overlay */}
                  <g transform="translate(24, 20)">
                    <circle 
                      r="8" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      className="animate-spin-slow"
                      style={{ transformOrigin: 'center' }}
                    />
                    <circle r="3" fill="#ef4444" />
                  </g>
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight">CrankSmith</span>
                <p className="text-xs text-gray-500 tracking-wide">Forge Your Perfect Gear</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-red-500 transition-colors">Calculator</Link>
              <Link href="#garage" className="hover:text-red-500 transition-colors">My Garage</Link>
              <Link href="#about" className="hover:text-red-500 transition-colors">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-gray-900 mt-16 py-8 bg-black">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2024 CrankSmith. Precision gear calculations for serious cyclists.</p>
          <p className="mt-2 text-sm">
            Forge your perfect ride • Beta Version
          </p>
        </div>
      </footer>
    </div>
  )
}
