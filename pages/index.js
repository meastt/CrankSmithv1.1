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

  const features = [
    {
      icon: '⚙️',
      title: 'Gear Calculator',
      description: 'Compare components and see exact performance impacts with real-world data',
      color: 'from-brand-orange to-brand-yellow'
    },
    {
      icon: '🔧',
      title: 'Tire Pressure',
      description: 'Get perfect tire pressure for your weight, terrain, and riding style',
      color: 'from-brand-blue to-brand-purple'
    },
    {
      icon: '📊',
      title: 'Performance Analysis',
      description: 'Deep insights into speed, cadence, and efficiency across different terrains',
      color: 'from-brand-green to-emerald-400'
    }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Save Money',
      description: 'Avoid costly mistakes by understanding component compatibility before you buy'
    },
    {
      icon: '🎯',
      title: 'Perfect Setup',
      description: 'Get personalized recommendations based on your riding style and goals'
    },
    {
      icon: '🚀',
      title: 'Real Data',
      description: 'Access accurate specifications for thousands of bike components'
    },
    {
      icon: '🤖',
      title: 'AI Expert',
      description: 'Get answers to technical questions with Riley, your AI bike expert'
    }
  ];

  return (
    <>
      <SEOHead
        title="CrankSmith - Premium Bike Gear Calculator & Analysis"
        description="Professional bike gear ratio calculator and component compatibility checker. Calculate gear ratios, check drivetrain compatibility, and optimize your bike setup with precision tools for serious cyclists."
        url="https://cranksmith.com"
        image="/og-image.jpg"
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
                  <div className="relative w-20 h-20 bg-gradient-performance rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-3xl">C</span>
                  </div>
                </div>
              </div>

              <h1 className="text-responsive-5xl font-bold text-balance mb-6 text-neutral-900 dark:text-white">
                <span className="text-gradient-performance">Precision</span> tools for <span className="text-gradient-premium">serious</span> cyclists
              </h1>
              
              <p className="text-responsive-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 text-balance">
                Calculate gear ratios, check compatibility, and optimize your bike setup with professional-grade tools trusted by cyclists worldwide.
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
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`card-premium p-8 text-center hover-lift animation-delay-${index * 100}`}
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <h2 className="text-responsive-3xl font-bold mb-4 text-neutral-900 dark:text-white">
                Why Choose CrankSmith?
              </h2>
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