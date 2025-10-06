import SEOHead from '../components/SEOHead';

const faqData = [
  {
    question: "What is CrankSmith and how does it work?",
    answer: "CrankSmith is a free, professional bike gear calculator and cycling optimization tool. It helps cyclists calculate gear ratios, check drivetrain compatibility, optimize bike fit, and determine optimal tire pressure. Simply input your bike components and measurements, and get instant, accurate calculations."
  },
  {
    question: "Is CrankSmith really free to use?",
    answer: "Yes, CrankSmith is completely free forever. There are no signup requirements, no paywalls, and no hidden fees. We believe that every cyclist should have access to professional-grade tools for optimizing their bike setup."
  },
  {
    question: "What types of bikes does CrankSmith support?",
    answer: "CrankSmith supports all types of bicycles including road bikes, mountain bikes, gravel bikes, touring bikes, cyclocross bikes, and hybrid bikes. Our calculator works with any drivetrain configuration from single-speed to 12-speed systems."
  },
  {
    question: "How accurate are the gear ratio calculations?",
    answer: "Our calculations are highly accurate and based on industry-standard formulas. We account for wheel size, tire width, chainring and cassette tooth counts, and provide precise gear ratios, gear inches, and development measurements."
  },
  {
    question: "Can I use CrankSmith for bike fitting?",
    answer: "Yes! CrankSmith includes a comprehensive bike fit calculator that uses professional fitting methods. Input your body measurements and get recommendations for frame size, saddle height, handlebar position, and other critical fit parameters."
  },
  {
    question: "Does CrankSmith work on mobile devices?",
    answer: "Absolutely! CrankSmith is fully responsive and works perfectly on desktop computers, tablets, and mobile phones. We also offer a Progressive Web App (PWA) for an app-like experience on mobile devices."
  },
  {
    question: "How do I calculate optimal tire pressure?",
    answer: "Use our tire pressure calculator by entering your weight, tire size, riding conditions, and terrain type. We'll calculate the optimal PSI for your specific setup to maximize performance, comfort, and safety."
  },
  {
    question: "Can I save my bike configurations?",
    answer: "Yes, CrankSmith allows you to save multiple bike configurations in your personal garage. This makes it easy to compare different setups and quickly access your saved configurations for future reference."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, CrankSmith is privacy-first. All calculations are performed locally in your browser, and we don't store your personal data or bike configurations on our servers. Your information stays on your device."
  },
  {
    question: "What if I'm a bike shop or mechanic?",
    answer: "CrankSmith is perfect for bike shops and professional mechanics. Use it to help customers optimize their bike setups, check compatibility before making recommendations, and provide professional-grade analysis for any bike configuration."
  }
];

export default function FAQPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <SEOHead 
        title="Frequently Asked Questions - CrankSmith Bike Calculator"
        description="Get answers to common questions about CrankSmith's free bike gear calculator, bike fit tool, and cycling optimization features."
        url="https://cranksmith.com/faq"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        <div className="container-responsive py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-black mb-6 text-neutral-900 dark:text-white">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Everything you need to know about CrankSmith's free bike gear calculator and cycling tools
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
              {faqData.map((item, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <h2 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">
                    {item.question}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to optimize your bike?
              </h2>
              <p className="text-blue-100 mb-6">
                Start using CrankSmith's free tools to get the most out of your cycling setup
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/calculator" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Try the Calculator
                </a>
                <a 
                  href="/bike-fit" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Bike Fit Tool
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}