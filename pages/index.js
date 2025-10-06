import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '../components/SEOHead';

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tools = [
    {
      icon: '⚙️',
      title: 'Gear Calculator',
      description: 'Calculate gear ratios, check compatibility, and optimize your drivetrain setup.',
      href: '/calculator',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🚴',
      title: 'Bike Fit',
      description: 'Get precise frame sizing recommendations using professional fitting methods.',
      href: '/bike-fit',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🔧',
      title: 'Tire Pressure',
      description: 'Calculate optimal tire pressure based on your weight, tire size, and terrain.',
      href: '/tire-pressure',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🤖',
      title: 'Ask Riley AI',
      description: 'Get personalized cycling advice from our AI assistant.',
      href: '/ask-riley',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const features = [
    {
      icon: '✓',
      title: 'Free Forever',
      description: 'No signup, no paywalls, no hidden fees'
    },
    {
      icon: '⚡',
      title: 'Fast & Accurate',
      description: 'Real-time calculations with precise results'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data stays on your device'
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Desktop, mobile, tablet - fully responsive'
    }
  ];

  return (
    <>
      <SEOHead
        title="CrankSmith - Free Bike Gear Calculator & Cycling Tools"
        description="Free bike gear calculator, bike fit calculator, and cycling tools. Calculate gear ratios, check drivetrain compatibility, optimize bike fit, and more. No signup required."
        url="https://cranksmith.com"
        image="/og-image.jpg"
        keywords="bike gear calculator, bike fit calculator, gear ratio calculator, cycling calculator, bicycle gear ratios, drivetrain compatibility, bike fitting, cycling tools"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CrankSmith",
          "alternateName": ["Bike Gear Calculator", "Cycling Calculator"],
          "description": "Free bike gear calculator and cycling optimization tools",
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
            "Bike Fit Calculator",
            "Tire Pressure Calculator"
          ]
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        {/* Hero Section - Minimal and Focused */}
        <section className="container-responsive py-16 lg:py-24">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-neutral-900 dark:text-white">
              Free Bike Gear Calculator & Cycling Tools
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto">
              Calculate gear ratios, check compatibility, optimize bike fit, and more. Simple, accurate, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/calculator" className="btn-primary text-lg px-8 py-4">
                Start Calculating
              </Link>
              <Link href="/bike-fit" className="btn-outline text-lg px-8 py-4">
                Bike Fit Calculator
              </Link>
            </div>
            <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
              No signup required • Works offline • Privacy-focused
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container-responsive py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
              Professional Cycling Tools
            </h2>
            <p className="text-center text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto">
              From gear calculations to bike fitting, our comprehensive suite of tools helps cyclists of all levels optimize their performance and comfort.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="card group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container-responsive py-16 bg-neutral-100 dark:bg-neutral-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
              Why Use CrankSmith?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center p-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="container-responsive py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
              Ready to optimize your bike?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Start with our gear calculator - it takes less than a minute.
            </p>
            <Link href="/calculator" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-16">
          <div className="container-responsive">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Tools */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Tools</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li><Link href="/calculator" className="hover:text-white transition-colors">Gear Calculator</Link></li>
                    <li><Link href="/bike-fit" className="hover:text-white transition-colors">Bike Fit Tool</Link></li>
                    <li><Link href="/tire-pressure" className="hover:text-white transition-colors">Tire Pressure</Link></li>
                    <li><Link href="/ask-riley" className="hover:text-white transition-colors">Ask Riley AI</Link></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Resources</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                    <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Support</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/mobile" className="hover:text-white transition-colors">Mobile App</Link></li>
                    <li><Link href="/performance-analysis" className="hover:text-white transition-colors">Performance Analysis</Link></li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-lg font-bold mb-4">CrankSmith</h3>
                  <p className="text-neutral-300 mb-4">
                    Free, professional cycling tools for cyclists worldwide.
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://twitter.com/cranksmithapp" className="text-neutral-400 hover:text-white transition-colors">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
                <p>&copy; 2024 CrankSmith. All rights reserved. Made with ❤️ for cyclists.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
