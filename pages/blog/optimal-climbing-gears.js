// pages/blog/optimal-climbing-gears.js
import Link from 'next/link';
import SEOHead from '../../components/SEOHead';

export default function OptimalClimbingGears() {
  return (
    <>
      <SEOHead 
        title="How to Choose Optimal Climbing Gears - CrankSmith"
        description="Learn the science behind gear selection for steep climbs and maintain your cadence when the road goes up."
        url="https://cranksmith.com/blog/optimal-climbing-gears"
      />
      
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
            ← Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-zinc-400">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                Gear Selection
              </span>
              <time>June 15, 2025</time>
              <span>5 min read</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              How to Choose Optimal Climbing Gears for Your Next Hill Climb
            </h1>
            
            <p className="text-xl text-zinc-300">
              Learn the science behind gear selection for steep climbs and maintain your cadence when the road goes up.
            </p>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            <p>
              When the road tilts skyward, your gear selection can make the difference between a smooth, sustainable climb and a leg-burning struggle. The key is understanding how gear ratios, cadence, and power output work together.
            </p>

            <h2>The Science of Climbing Gears</h2>
            <p>
              For most cyclists, maintaining a cadence between 70-80 RPM on climbs is optimal. This keeps your muscles in their efficient power band while preventing the quad-burning low-cadence grind that leads to early fatigue.
            </p>

            <h3>Calculating Your Ideal Climbing Gear</h3>
            <p>
              Here's a simple formula: On a 10% grade at 8 mph, you'll need approximately 25-30 gear inches to maintain 75 RPM. For steeper climbs (12%+), consider gears as low as 20-22 gear inches.
            </p>

            <h2>Common Climbing Gear Mistakes</h2>
            <ul>
              <li><strong>Too high gears:</strong> Forcing big gears uphill burns matches you can't get back</li>
              <li><strong>Late shifting:</strong> Shift before you need to, not when you're already struggling</li>
              <li><strong>Ignoring terrain:</strong> Different climb profiles need different approaches</li>
            </ul>

            <h2>Gear Recommendations by Climb Type</h2>
            <p>
              <strong>Short, steep punches (8-12%):</strong> 22-28 gear inches<br/>
              <strong>Long, steady climbs (4-8%):</strong> 28-35 gear inches<br/>
              <strong>Alpine climbing (10%+):</strong> 18-25 gear inches
            </p>

            {/* CTA Section */}
            <div className="bg-zinc-800 rounded-lg p-6 my-8">
              <h3 className="text-xl font-bold mb-3">Calculate Your Perfect Climbing Setup</h3>
              <p className="text-zinc-300 mb-4">
                Use CrankSmith's gear calculator to find the exact chainring and cassette combination for your climbing goals.
              </p>
              <Link 
                href="/calculator"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
              >
                Try the Calculator
              </Link>
            </div>

            <p>
              Remember: the best climbing gear is the one that lets you maintain a steady, sustainable effort all the way to the top. Your legs will thank you on the next climb.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}