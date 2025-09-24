import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import SEOHead from '../components/SEOHead';

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [heroMetric, setHeroMetric] = useState(0);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);

    // Animate hero metric
    const timer = setTimeout(() => {
      setHeroMetric(47.3);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const eliteTools = [
    {
      icon: '⚡',
      title: 'Elite Gear Calculator',
      description: 'Precision gear ratio analysis for competitive cyclists. Calculate optimal drivetrain configurations for racing, climbing, and sprinting.',
      gradient: 'from-racing-red to-racing-orange',
      delay: 'animation-delay-0'
    },
    {
      icon: '🎯',
      title: 'Pro Bike Fit Studio',
      description: 'Professional bike fitting using advanced biomechanical calculations. LeMond, Holmes, and Wobble methodologies for elite performance.',
      gradient: 'from-steel-blue to-racing-green',
      delay: 'animation-delay-100'
    },
    {
      icon: '🔬',
      title: 'Aerodynamics Lab',
      description: 'Advanced tire pressure optimization using rolling resistance data, rider weight analysis, and terrain-specific calculations.',
      gradient: 'from-racing-orange to-warning-yellow',
      delay: 'animation-delay-200'
    },
    {
      icon: '📈',
      title: 'Performance Analytics',
      description: 'Deep power analysis, cadence optimization, and efficiency metrics. Track your performance gains across all cycling disciplines.',
      gradient: 'from-racing-green to-steel-blue',
      delay: 'animation-delay-300'
    }
  ];

  const competitiveAdvantages = [
    {
      icon: '🏆',
      title: 'World-Class Precision',
      description: 'Trusted by professional teams and used in competitive cycling worldwide for mission-critical performance optimization'
    },
    {
      icon: '🔬',
      title: 'Scientific Accuracy',
      description: 'Built on peer-reviewed research and real-world testing data from professional cycling laboratories and wind tunnels'
    },
    {
      icon: '⚡',
      title: 'Competitive Edge',
      description: 'Gain measurable performance advantages with data-driven insights that elite cyclists use to win races'
    },
    {
      icon: '🎯',
      title: 'Elite Results',
      description: 'Join thousands of competitive cyclists who\'ve achieved podium finishes using our precision tools'
    }
  ];

  const heroStats = [
    { label: 'GEAR RATIOS', value: heroMetric, unit: '', suffix: '+' },
    { label: 'CYCLISTS', value: '50,000', unit: '', suffix: '+' },
    { label: 'ACCURACY', value: '99.7', unit: '%', suffix: '' }
  ];

  return (
    <>
      <SEOHead
        title="CrankSmith - Professional Bike Gear Calculator, Bike Fit & Cycling Tools"
        description="Free professional bike gear calculator, bike fit calculator, and cycling optimization tools. Calculate gear ratios, drivetrain compatibility, bike fitting, and optimize your road, mountain, gravel, or touring bike setup. Used by cyclists and bike shops worldwide."
        url="https://cranksmith.com"
        image="/og-image.jpg"
        keywords="bike gear calculator, bike fit calculator, gear ratio calculator, cycling gear calculator, bicycle gear ratios, drivetrain compatibility, bike fitting calculator, cycling tools, bike setup calculator, bicycle calculator, bike gearing, cycling optimization, bike mechanics tools, cycling gear optimization, bicycle fitting, bike shop tools"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CrankSmith",
          "alternateName": ["Bike Gear Calculator", "Cycling Calculator", "Bike Fit Calculator"],
          "description": "Professional bike gear calculator, bike fit calculator, and cycling optimization tools for cyclists and bike shops",
          "url": "https://cranksmith.com",
          "applicationCategory": "Sports & Recreation",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Bike Gear Ratio Calculator",
            "Drivetrain Compatibility Checker",
            "Professional Bike Fit Calculator",
            "Tire Pressure Calculator",
            "Cycling Performance Optimization",
            "Multi-Bike Type Support (Road, Mountain, Gravel, Touring)"
          ],
          "audience": [
            {
              "@type": "Audience",
              "audienceType": "Cyclists"
            },
            {
              "@type": "Audience",
              "audienceType": "Bike Mechanics"
            },
            {
              "@type": "Audience",
              "audienceType": "Bike Shops"
            },
            {
              "@type": "Audience",
              "audienceType": "Cycling Enthusiasts"
            }
          ],
          "creator": {
            "@type": "Organization",
            "name": "CrankSmith",
            "url": "https://cranksmith.com",
            "description": "Professional cycling tools and calculators",
            "sameAs": [
              "https://instagram.com/cranksmithapp"
            ]
          },
          "mainEntity": [
            {
              "@type": "SoftwareApplication",
              "name": "Bike Gear Calculator",
              "description": "Calculate optimal gear ratios for any bike",
              "url": "https://cranksmith.com/calculator"
            },
            {
              "@type": "SoftwareApplication",
              "name": "Bike Fit Calculator",
              "description": "Professional bike fitting based on body measurements",
              "url": "https://cranksmith.com/bike-fit"
            }
          ],
          "keywords": "bike gear calculator, bike fit calculator, cycling tools, bicycle calculator, gear ratio calculator, bike fitting",
          "inLanguage": "en-US",
          "isAccessibleForFree": true,
          "usageInfo": "Free cycling tools for gear calculation and bike fitting",
          "supportingData": "Professional bike fitting methods and gear ratio calculations"
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        {/* Elite Performance Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Racing Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-racing-red via-racing-orange to-steel-blue" />
            <div className="absolute top-20 left-10 w-96 h-96 bg-racing-red/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-steel-blue/20 rounded-full blur-3xl" />
          </div>

          <div className="container-responsive py-20 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className={`transition-all duration-1000 ${
                mounted && isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                {/* Elite Badge */}
                <div className="mb-8">
                  <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                    Elite Performance Platform
                  </span>
                </div>

                <h1 className="text-responsive-6xl font-black text-balance mb-6 text-neutral-900 dark:text-white leading-tight">
                  <span className="text-gradient-racing">Professional</span> Bike Gear <br />
                  <span className="text-gradient-carbon">Calculator</span> & Tools
                </h1>

                <p className="text-responsive-xl text-neutral-600 dark:text-neutral-300 max-w-xl mb-10 text-balance leading-relaxed font-medium">
                  Calculate gear ratios, optimize bike fit, check compatibility, and perfect your setup with professional-grade tools trusted by cyclists worldwide.
                </p>

                {/* Hero Stats */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  {heroStats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-black text-racing-red mb-1">
                        {typeof stat.value === 'number' ? `${stat.value.toFixed(1)}${stat.suffix}` : stat.value}
                        <span className="text-lg ml-1">{stat.unit}</span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/calculator" className="btn-racing">
                    <span>Enter Performance Lab</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>

                  <Link href="/bike-fit" className="btn-carbon">
                    <span>Pro Bike Fit Studio</span>
                  </Link>
                </div>

                <div className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-racing-red">Professional Grade</span> • No signup required • Elite accuracy
                </div>
              </div>

              {/* Hero Visual */}
              <div className={`transition-all duration-1000 delay-300 ${
                mounted && isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div className="relative">
                  {/* Performance Dashboard Mockup */}
                  <div className="card-carbon p-8 shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Performance Dashboard</h3>
                        <div className="badge-racing-accent text-xs px-3 py-1">LIVE</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-racing-red">342W</div>
                          <div className="text-sm text-neutral-300">Max Power</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-steel-blue">94 RPM</div>
                          <div className="text-sm text-neutral-300">Optimal Cadence</div>
                        </div>
                      </div>

                      <div className="bg-gradient-racing rounded-lg p-4">
                        <div className="text-lg font-bold text-white">Gear Optimization</div>
                        <div className="text-sm text-white/90">53×11 • 47.3W Saved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elite Tools Section */}
        <section className="py-24 bg-white dark:bg-neutral-900 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-steel-blue to-racing-green" />
          </div>

          <div className="container-responsive relative z-10">
            <div className="text-center mb-20">
              <div className="mb-6">
                <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                  Elite Performance Suite
                </span>
              </div>
              <h2 className="text-responsive-4xl font-black mb-6 text-neutral-900 dark:text-white">
                Professional <span className="text-gradient-racing">Racing Tools</span>
              </h2>
              <p className="text-responsive-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                Advanced tools engineered for competitive cyclists. Each calculator is precision-built using professional racing data and scientific methodology.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {eliteTools.map((tool, index) => (
                <Link
                  key={tool.title}
                  href="/calculator"
                  className={`card-racing p-8 hover-lift-racing ${tool.delay} group`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white group-hover:text-racing-red transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Competitive Advantages Section */}
        <section className="py-24 bg-neutral-50 dark:bg-neutral-800 relative overflow-hidden">
          {/* Professional background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-racing-red to-carbon-black" />
          </div>

          <div className="container-responsive relative z-10">
            <div className="text-center mb-20">
              <div className="mb-6">
                <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                  Competitive Advantages
                </span>
              </div>
              <h2 className="text-responsive-4xl font-black mb-6 text-neutral-900 dark:text-white">
                Why Elite Cyclists <span className="text-gradient-racing">Choose Us</span>
              </h2>
              <p className="text-responsive-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                Professional-grade precision trusted by world-class athletes, racing teams, and cycling coaches worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {competitiveAdvantages.map((advantage, index) => (
                <div
                  key={advantage.title}
                  className={`card-carbon p-8 hover-lift-racing animation-delay-${index * 100} group`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-racing flex items-center justify-center text-white text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {advantage.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-racing-red transition-colors">
                        {advantage.title}
                      </h3>
                      <p className="text-neutral-300 leading-relaxed text-lg">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Elite Performance Lab CTA */}
        <section className="py-24 bg-gradient-to-br from-carbon-black via-neutral-900 to-neutral-800 text-white relative overflow-hidden">
          {/* Racing circuit pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-racing-red to-steel-blue" />
          </div>

          <div className="container-responsive relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-racing flex items-center justify-center shadow-glow-racing">
                <span className="text-4xl">🔬</span>
              </div>
              <h2 className="text-responsive-4xl font-black mb-6">
                Enter the <span className="text-gradient-racing">Elite Performance Lab</span>
              </h2>
              <p className="text-responsive-xl text-neutral-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                Join professional cyclists and racing teams who trust our precision tools to gain competitive advantages. Experience the same technology used by world-class athletes.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link href="/calculator" className="btn-racing">
                  <span>Access Performance Lab</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link href="/performance-analysis" className="btn-technical">
                  <span>View Analytics Dashboard</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">Pro Team Integration</span>
                <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">Scientific Accuracy</span>
                <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">Real-Time Optimization</span>
                <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">Elite Performance Data</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final Elite CTA */}
        <section className="py-24 bg-gradient-to-br from-racing-red via-racing-orange to-warning-yellow relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
          </div>

          <div className="container-responsive text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-responsive-4xl font-black mb-6 text-white">
                Ready to Race at the <span className="text-carbon-black">Elite Level?</span>
              </h2>
              <p className="text-responsive-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                Join over 15,000 professional cyclists who've elevated their performance with our precision-engineered tools. Start your competitive advantage today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link href="/calculator" className="btn-carbon">
                  <span>Begin Elite Analysis</span>
                </Link>

                <Link href="/bike-fit" className="btn-technical">
                  <span>Professional Bike Fitting</span>
                </Link>
              </div>

              <div className="text-white/80 text-sm">
                <span className="font-bold text-white">Free Professional Access</span> • No registration required • Elite precision guaranteed
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 