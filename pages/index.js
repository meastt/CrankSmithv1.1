import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import SEOHead from '../components/SEOHead';

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '⚙️',
      title: 'Bike Gear Calculator',
      description: 'Professional gear ratio calculator for road, mountain, gravel, and touring bikes. Compare drivetrain components and optimize your bike gearing setup.',
      color: 'from-brand-orange to-brand-yellow'
    },
    {
      icon: '🚴‍♂️',
      title: 'Professional Bike Fit Calculator',
      description: 'Calculate optimal saddle height, reach, and stack using LeMond, Holmes, and Hamley bike fitting methods based on your body measurements.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔧',
      title: 'Cycling Tire Pressure Calculator',
      description: 'Get perfect tire pressure for road, mountain, and gravel bikes based on your weight, terrain, and riding style for optimal performance.',
      color: 'from-brand-blue to-brand-purple'
    },
    {
      icon: '📊',
      title: 'Cycling Performance Analysis',
      description: 'Deep insights into cycling speed, cadence, and efficiency across different terrains. Optimize your bike setup for maximum performance.',
      color: 'from-brand-green to-emerald-400'
    }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Save Money on Bike Components',
      description: 'Avoid costly mistakes by understanding bike component compatibility and drivetrain matching before you buy cycling gear'
    },
    {
      icon: '🎯',
      title: 'Perfect Bike Setup',
      description: 'Get personalized bike recommendations based on your cycling style, body measurements, and performance goals'
    },
    {
      icon: '🚀',
      title: 'Real Cycling Data',
      description: 'Access accurate specifications for thousands of bike components, drivetrains, and cycling equipment from top brands'
    },
    {
      icon: '🤖',
      title: 'AI Cycling Expert',
      description: 'Get answers to technical bike questions with Riley, your AI cycling and bike mechanic expert assistant'
    }
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

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-blue" />
          </div>
          
          <div className="container-responsive py-20 lg:py-32 relative">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-performance rounded-3xl blur-2xl opacity-30" />
                  <div className="relative w-20 h-20 bg-white dark:bg-neutral-800 rounded-3xl flex items-center justify-center shadow-2xl p-3">
                    <Image 
                      src="/cranksmith-logo.png" 
                      alt="CrankSmith" 
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-responsive-5xl font-bold text-balance mb-6 text-neutral-900 dark:text-white">
                <span className="text-gradient-performance">Professional</span> Bike Gear Calculator & <span className="text-gradient-premium">Cycling</span> Tools
              </h1>
              
              <p className="text-responsive-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 text-balance">
                Calculate gear ratios, optimize bike fit, check compatibility, and perfect your setup with professional-grade tools trusted by cyclists worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/calculator" className="btn-primary">
                  <span>Start Calculating</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link href="/tire-pressure" className="btn-secondary">
                  <span>Tire Pressure Tool</span>
                </Link>
              </div>

              <div className="mt-12 text-sm text-neutral-500 dark:text-neutral-400">
                Free • No signup required • Works offline
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-neutral-100 dark:bg-neutral-900">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <h2 className="text-responsive-3xl font-bold mb-4 text-neutral-900 dark:text-white">
                Professional Tools
              </h2>
              <p className="text-responsive-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Everything you need to analyze and optimize your bike setup
              </p>
            </div>

            <div className="grid-responsive">
              {features.map((feature, index) => {
                const getFeatureHref = (title) => {
                  switch (title) {
                    case 'Bike Gear Calculator': return '/calculator';
                    case 'Professional Bike Fit Calculator': return '/bike-fit';
                    case 'Cycling Tire Pressure Calculator': return '/tire-pressure';
                    case 'Cycling Performance Analysis': return '/performance-analysis';
                    case 'AI Cycling Expert': return '/ask-riley';
                    default: return '/calculator';
                  }
                };
                const href = getFeatureHref(feature.title);
                
                return (
                  <Link
                    key={feature.title}
                    href={href}
                    className={`card-premium p-8 text-center hover-lift animation-delay-${index * 100} cursor-pointer`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shadow-lg bg-white dark:bg-neutral-800">
                  <Image 
                    src="/cranksmith-logo.png" 
                    alt="CrankSmith" 
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h2 className="text-responsive-3xl font-bold text-neutral-900 dark:text-white">
                  Why Choose <span className="bg-gradient-performance bg-clip-text text-transparent">CrankSmith</span>?
                </h2>
              </div>
              <p className="text-responsive-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Trusted by cyclists, shops, and professionals worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`card-premium p-6 flex items-start gap-4 hover-lift animation-delay-${index * 100}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center text-white text-xl flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ask Riley CTA Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-responsive-3xl font-bold mb-4">
                Meet Riley, Your AI Bike Expert
              </h2>
              <p className="text-responsive-lg text-neutral-300 max-w-2xl mx-auto mb-8">
                Get instant answers to your bike questions from Riley, trained on thousands of maintenance manuals and brand support docs. Whether it's upgrades, installations, or compatibility - Riley knows bikes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/ask-riley" className="btn-secondary bg-white text-neutral-900 hover:bg-neutral-100">
                  <span>Ask Riley Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">Upgrade Questions</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Installation Guides</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Compatibility Checks</span>
                <span className="px-3 py-1 bg-white/20 rounded-full">Maintenance Tips</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-blue to-brand-purple">
          <div className="container-responsive text-center">
            <h2 className="text-responsive-3xl font-bold mb-4 text-white">
              Ready to Optimize Your Setup?
            </h2>
            <p className="text-responsive-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of cyclists who've already optimized their bike setup with CrankSmith
            </p>
            <Link href="/calculator" className="btn-secondary bg-white text-brand-blue hover:bg-neutral-100">
              Get Started Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 