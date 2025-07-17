export default function About() {
    return (
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="hero-title">About CrankSmith</h1>
          <p className="hero-subtitle max-w-2xl mx-auto">
            Born from a lifelong cyclist's frustration with clunky gear calculators and expensive trial-and-error upgrades.
          </p>
        </div>
  
        {/* Story */}
        <div className="space-y-12">
          <section className="card">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              The Problem We Solve
            </h2>
            <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
              <p>
                As a lifelong cyclist, NICA coach, and competitive gravel racer, I&apos;ve built countless bikes and witnessed the same struggles repeatedly: cyclists wanting to optimize their setups but facing confusing math, expensive components, and limited resources.
              </p>
              <p>
                Existing tools on forums and basic gear calculators are clunky, outdated, and don&apos;t reflect modern component reality. Meanwhile, cyclists are stuck buying expensive parts to &quot;see what happens&quot; or settling for suboptimal setups.
              </p>
            </div>
          </section>
  
          <section className="card">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Our Solution
            </h2>
            <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
              <p>
                CrankSmith brings professional-grade gear analysis to every cyclist. We&apos;ve built a comprehensive database of real components with accurate specs, modern crossover options (gravel + MTB), and intelligent analysis that considers weight, speed, and compatibility.
              </p>
              <p>
                Our AI mechanic Riley provides expert advice 24/7, answering the questions that arise after seeing your analysis. No more guessing about compatibility or wondering if an upgrade is worth it.
              </p>
            </div>
          </section>
  
          <section className="card">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Why CrankSmith?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  🚴‍♂️ Built by Cyclists
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Created by someone who coaches NICA, races gravel competitively, and has built hundreds of bikes. We understand real-world cycling needs.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  🔧 Real Components
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Accurate database with actual model numbers, weights, and specs. SRAM GX Eagle XG-1275, not just &quot;SRAM cassette.&quot;
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  📊 Modern Analysis
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Beautiful, shareable results that cyclists actually want to screenshot and discuss with riding buddies.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  🤖 Expert AI Advice
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Riley, our AI mechanic, provides personalized advice based on your exact setup and riding style.
                </p>
              </div>
            </div>
          </section>
  
          <section className="card">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Contact
            </h2>
            <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Have questions, feedback, or want to contribute to making CrankSmith better? We&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:mike@cranksmith.com" 
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Get in Touch
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }