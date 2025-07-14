// pages/docs.js
import SEOHead from '../components/SEOHead';

export default function DocsPage() {
  return (
    <>
      <SEOHead 
        title="CrankSmith User Guide & FAQ"
        description="Learn how to use CrankSmith's gear calculator, compatibility checker, and tire pressure tools."
        url="https://cranksmith.com/docs"
      />
      
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">User Guide & FAQ</h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Everything you need to know about using CrankSmith
            </p>
          </div>

          {/* Quick Start Guide */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-[var(--accent-blue)]">Quick Start Guide</h2>
            
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Using the Gear Calculator</h3>
              <ol className="space-y-3 text-[var(--text-secondary)]">
                <li><strong>1.</strong> Select your crankset (chainrings)</li>
                <li><strong>2.</strong> Choose your cassette (rear cogs)</li>
                <li><strong>3.</strong> Pick your derailleur</li>
                <li><strong>4.</strong> Review compatibility warnings</li>
                <li><strong>5.</strong> Check your gear ratios and cadence ranges</li>
              </ol>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Understanding Your Results</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><strong>Gear Inches:</strong> Higher numbers = harder to pedal, faster speeds</li>
                <li><strong>Cadence:</strong> Your pedaling rate (aim for 80-100 RPM)</li>
                <li><strong>Compatibility:</strong> Green = good, Yellow = caution, Red = won't work</li>
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-[var(--accent-blue)]">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <FAQItem 
                question="What does 'chain capacity exceeded' mean?"
                answer="Your derailleur can't handle the difference between your biggest and smallest gears. Try a long-cage derailleur or smaller cassette range."
              />
              
              <FAQItem 
                question="Why is my setup showing compatibility warnings?"
                answer="Common issues include derailleur capacity limits, chain line problems, or mismatched speeds (10-speed vs 11-speed). Check the specific warning for details."
              />
              
              <FAQItem 
                question="What gear ratio should I use for climbing?"
                answer="For steep climbs, aim for gear inches around 20-30. This gives you a low enough gear to maintain 70-80 RPM cadence uphill."
              />
              
              <FAQItem 
                question="How do I save my bike builds?"
                answer="Use the 'Save to Garage' button after configuring your setup. You can name and organize multiple builds for different bikes or riding styles."
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">{question}</h3>
      <p className="text-[var(--text-secondary)]">{answer}</p>
    </div>
  );
}