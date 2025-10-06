import SEOHead from '../components/SEOHead';

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CrankSmith",
    "description": "Free bike gear calculator and cycling optimization tools for cyclists, bike shops, and mechanics",
    "url": "https://cranksmith.com",
    "logo": "https://cranksmith.com/cranksmith-logo.png",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "CrankSmith Team"
    },
    "areaServed": "Worldwide",
    "serviceType": "Cycling Tools and Calculators",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free bike gear calculator and cycling tools"
    },
    "sameAs": [
      "https://twitter.com/cranksmithapp"
    ]
  };

  return (
    <>
      <SEOHead 
        title="About CrankSmith - Free Bike Gear Calculator & Cycling Tools"
        description="Learn about CrankSmith's mission to provide free, professional-grade cycling tools for cyclists, bike shops, and mechanics worldwide."
        url="https://cranksmith.com/about"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        <div className="container-responsive py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-black mb-6 text-neutral-900 dark:text-white">
                About CrankSmith
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Professional cycling tools, made free for everyone
              </p>
            </div>

            {/* Mission Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Our Mission</h2>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
                <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  CrankSmith was born from a simple belief: every cyclist deserves access to professional-grade tools for optimizing their bike setup. Whether you're a weekend warrior, competitive racer, or bike shop mechanic, you shouldn't have to pay for basic calculations that help you get the most out of your cycling experience.
                </p>
                <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  We're committed to keeping our tools completely free, privacy-focused, and accessible to cyclists worldwide. No signups, no paywalls, no hidden fees – just accurate, reliable tools that help you ride better.
                </p>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Gear Calculator</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Calculate precise gear ratios, gear inches, and development measurements for any bike configuration.
                  </p>
                  <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
                    <li>• Support for all bike types</li>
                    <li>• Real-time compatibility checking</li>
                    <li>• Performance analysis and recommendations</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Bike Fit Calculator</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Professional bike fitting calculations based on your body measurements and riding style.
                  </p>
                  <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
                    <li>• Frame size recommendations</li>
                    <li>• Saddle height calculations</li>
                    <li>• Handlebar position optimization</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Tire Pressure Tool</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Calculate optimal tire pressure based on your weight, tire size, and riding conditions.
                  </p>
                  <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
                    <li>• Weight-based calculations</li>
                    <li>• Terrain-specific recommendations</li>
                    <li>• Performance vs comfort optimization</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">AI Assistant</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Get personalized cycling advice and recommendations from our AI assistant, Riley.
                  </p>
                  <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
                    <li>• Personalized recommendations</li>
                    <li>• Component compatibility advice</li>
                    <li>• Setup optimization tips</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Values Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    🆓
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Always Free</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    We believe professional cycling tools should be accessible to everyone, regardless of budget.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    🔒
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Privacy First</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Your data stays on your device. We don't collect personal information or track your usage.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    ⚡
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Fast & Accurate</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Professional-grade calculations with instant results, optimized for speed and precision.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to optimize your cycling setup?
              </h2>
              <p className="text-blue-100 mb-6">
                Join thousands of cyclists who trust CrankSmith for their bike optimization needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/calculator" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Calculating
                </a>
                <a 
                  href="/faq" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}