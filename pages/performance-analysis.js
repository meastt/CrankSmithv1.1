import React from 'react';
import Link from 'next/link';
import SEOHead from '../components/SEOHead';

export default function PerformanceAnalysis() {
  const comingSoonFeatures = [
    {
      icon: '⚡',
      title: 'Speed & Cadence Analysis',
      description: 'Analyze optimal cadence for different terrains and calculate speed predictions based on your gear ratios and power output.'
    },
    {
      icon: '📈',
      title: 'Efficiency Optimization',
      description: 'Get insights into your bike setup efficiency with power transfer analysis and aerodynamic positioning recommendations.'
    },
    {
      icon: '🏔️',
      title: 'Terrain-Specific Insights',
      description: 'Detailed performance analysis for climbing, descending, and flat terrain with gear ratio optimization suggestions.'
    },
    {
      icon: '⏱️',
      title: 'Training Zone Calculator',
      description: 'Calculate optimal training zones based on your performance data and bike setup for maximum improvement.'
    }
  ];

  const availableTools = [
    {
      title: 'Bike Gear Calculator',
      description: 'Optimize your drivetrain setup with our comprehensive gear ratio calculator',
      href: '/calculator',
      icon: '⚙️',
      color: 'from-brand-orange to-brand-yellow'
    },
    {
      title: 'Professional Bike Fit',
      description: 'Calculate optimal bike positioning using professional fitting methods',
      href: '/bike-fit',
      icon: '🚴‍♂️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Tire Pressure Calculator',
      description: 'Get perfect tire pressure for optimal performance and comfort',
      href: '/tire-pressure',
      icon: '🔧',
      color: 'from-brand-blue to-brand-purple'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Cycling Performance Analysis - Coming Soon | CrankSmith"
        description="Advanced cycling performance analysis tools coming soon to CrankSmith. Speed analysis, efficiency optimization, and terrain-specific insights for cyclists."
        keywords="cycling performance analysis, bike speed calculator, cadence analysis, cycling efficiency, power analysis, training zones"
        url="https://cranksmith.com/performance-analysis"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-purple to-brand-green">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container-responsive text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                <span className="text-4xl">📊</span>
              </div>
              <h1 className="text-responsive-4xl font-bold mb-6 text-white">
                Performance Analysis
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 rounded-full border border-yellow-400/30 mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="text-yellow-200 font-medium">Coming Soon</span>
              </div>
              <p className="text-responsive-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Advanced cycling performance analysis tools are in development. Get deep insights into your speed, efficiency, and optimization opportunities across different terrains.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="py-16 px-4">
          <div className="container-responsive">
            <h2 className="text-responsive-3xl font-bold text-center mb-12 text-white">
              What's Coming
            </h2>
            <div className="grid-responsive">
              {comingSoonFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="card bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Tools */}
        <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container-responsive">
            <h2 className="text-responsive-3xl font-bold text-center mb-6 text-white">
              Available Now
            </h2>
            <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto">
              While performance analysis is in development, explore our other professional cycling tools
            </p>
            <div className="grid-responsive">
              {availableTools.map((tool, index) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="card bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center hover:bg-white/15 hover-lift transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{tool.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {tool.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4">
          <div className="container-responsive text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-responsive-3xl font-bold mb-6 text-white">
                Get Notified When It's Ready
              </h2>
              <p className="text-blue-100 mb-8">
                Be the first to access advanced performance analysis tools when they launch
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="btn-secondary bg-white text-brand-blue hover:bg-neutral-100 whitespace-nowrap">
                  Notify Me
                </button>
              </div>
              <p className="text-sm text-blue-200">
                No spam, just updates on new cycling tools and features
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="container-responsive text-center">
            <h2 className="text-responsive-2xl font-bold mb-6 text-white">
              Start Optimizing Today
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't wait for performance analysis - start optimizing your bike setup now with our existing tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/calculator" className="btn-primary">
                <span>Gear Calculator</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link href="/bike-fit" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
                <span>Bike Fit Calculator</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}