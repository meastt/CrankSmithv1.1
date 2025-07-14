// pages/blog/gravel-vs-road-gearing.js
import Link from 'next/link';
import SEOHead from '../../components/SEOHead';

export default function GravelVsRoadGearing() {
  return (
    <>
      <SEOHead 
        title="Gravel vs Road Bike Gearing: What's the Difference? - CrankSmith"
        description="Understanding why gravel bikes need different gear ratios and how to optimize for mixed terrain riding."
        url="https://cranksmith.com/blog/gravel-vs-road-gearing"
      />
      
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link href="/blog" className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] mb-8 inline-block">
            ← Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
              <span className="bg-[var(--success-green)] text-white px-2 py-1 rounded text-xs">
                Bike Setup
              </span>
              <time>June 10, 2025</time>
              <span>7 min read</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Gravel vs Road Bike Gearing: What's the Difference?
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)]">
              Understanding why gravel bikes need different gear ratios and how to optimize for mixed terrain riding.
            </p>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            <p>
              If you've ever wondered why your road bike feels inadequate on gravel trails, or why gravel bikes have such different gearing, you're not alone. The terrain demands completely different approaches to gear selection.
            </p>

            <h2>The Core Differences</h2>
            <p>
              Road bikes prioritize speed and efficiency on smooth pavement, while gravel bikes need versatility for everything from loose dirt to steep off-road climbs. This fundamental difference drives every gearing decision.
            </p>

            <h3>Gear Range Comparison</h3>
            <p>
              <strong>Road bikes:</strong> Typically 34/50 chainrings with 11-28 or 11-32 cassettes<br/>
              <strong>Gravel bikes:</strong> Often 40/48 or single chainring setups with 11-42 or wider cassettes
            </p>

            <h2>Why Gravel Needs Lower Gears</h2>
            <p>
              Gravel riding presents unique challenges that demand different gearing strategies:
            </p>

            <ul>
              <li><strong>Loose surfaces:</strong> Less traction means you need easier gears to maintain momentum</li>
              <li><strong>Steep, loose climbs:</strong> 15-20% grades on dirt require gears as low as 15-18 gear inches</li>
              <li><strong>Technical sections:</strong> Slow, controlled riding benefits from ultra-low gears</li>
              <li><strong>Loaded touring:</strong> Bikepacking adds weight, demanding easier climbing gears</li>
            </ul>

            <h2>The 1x vs 2x Debate for Gravel</h2>
            <p>
              Many gravel bikes now use single chainring (1x) setups. Here's when each works best:
            </p>

            <h3>Choose 1x When:</h3>
            <ul>
              <li>Simplicity and low maintenance are priorities</li>
              <li>You ride varied terrain but don't need extreme high or low gears</li>
              <li>Typical rides are under 50 miles</li>
            </ul>

            <h3>Choose 2x When:</h3>
            <ul>
              <li>You want the widest possible gear range</li>
              <li>Long road sections are part of your rides</li>
              <li>You prioritize small gear steps for optimal cadence</li>
            </ul>

            <h2>Optimizing Your Gravel Setup</h2>
            <p>
              The ideal gravel gearing depends on your specific riding:
            </p>

            <p>
              <strong>Fire roads and smooth gravel:</strong> 40t chainring with 11-36 cassette<br/>
              <strong>Technical singletrack:</strong> 38t chainring with 11-42 cassette<br/>
              <strong>Bikepacking/loaded touring:</strong> 36t chainring with 11-46+ cassette
            </p>

            <h2>Real-World Gear Recommendations</h2>
            <p>
              For most gravel riders, aim for these gear inch ranges:
            </p>
            <ul>
              <li><strong>Lowest gear:</strong> 18-22 gear inches (for steep, loose climbs)</li>
              <li><strong>Highest gear:</strong> 90-110 gear inches (for road sections and descents)</li>
              <li><strong>Most-used range:</strong> 35-65 gear inches (comfortable cruising)</li>
            </ul>

            {/* CTA Section */}
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 my-8">
              <h3 className="text-xl font-bold mb-3">Find Your Perfect Gravel Gearing</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Use CrankSmith's calculator to compare different chainring and cassette combinations for your gravel adventures.
              </p>
              <Link 
                href="/calculator"
                className="inline-block bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] px-4 py-2 rounded font-semibold transition-colors"
              >
                Calculate Your Setup
              </Link>
            </div>

            <p>
              Remember: the best gravel gearing is the one that gives you confidence on every surface. Whether you choose 1x or 2x, prioritize having the right gear for your steepest climbs and longest road sections.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}