// pages/blog/tire-pressure-performance.js
import Link from 'next/link';
import SEOHead from '../../components/SEOHead';

export default function TirePressurePerformance() {
  return (
    <>
      <SEOHead 
        title="The Hidden Performance Cost of Wrong Tire Pressure - CrankSmith"
        description="How tire pressure affects rolling resistance, comfort, and speed - plus how to find your optimal PSI."
        url="https://cranksmith.com/blog/tire-pressure-performance"
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
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                Performance
              </span>
              <time>June 5, 2025</time>
              <span>4 min read</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              The Hidden Performance Cost of Wrong Tire Pressure
            </h1>
            
            <p className="text-xl text-zinc-300">
              How tire pressure affects rolling resistance, comfort, and speed - plus how to find your optimal PSI.
            </p>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            <p>
              Most cyclists obsess over lightweight components and aerodynamics, but ignore one of the biggest performance factors: tire pressure. Getting this wrong can cost you more watts than expensive wheels ever save.
            </p>

            <h2>The Science of Rolling Resistance</h2>
            <p>
              Rolling resistance occurs when your tire deforms as it rolls. Too little pressure and your tire flexes excessively, creating heat and drag. Too much pressure and you lose comfort and traction, plus you'll bounce over small bumps instead of rolling smoothly.
            </p>

            <h3>The Performance Numbers</h3>
            <p>
              Research shows that running 20 PSI too high or too low can increase rolling resistance by 10-15 watts at 25 mph. Over a 40-mile ride, that's the equivalent of carrying an extra 2-3 pounds up every hill.
            </p>

            <h2>Finding Your Optimal Pressure</h2>
            <p>
              The ideal tire pressure depends on several factors that work together:
            </p>

            <ul>
              <li><strong>Rider weight:</strong> Heavier riders need higher pressure to prevent tire deformation</li>
              <li><strong>Tire width:</strong> Wider tires run lower pressures for the same contact patch</li>
              <li><strong>Road surface:</strong> Smooth roads favor higher pressure; rough roads favor lower</li>
              <li><strong>Riding style:</strong> Racing demands different pressure than casual riding</li>
            </ul>

            <h2>Pressure by Tire Width</h2>
            <p>
              Here are starting points for a 150-170 lb rider on smooth pavement:
            </p>

            <p>
              <strong>23mm tires:</strong> 100-110 PSI<br/>
              <strong>25mm tires:</strong> 85-95 PSI<br/>
              <strong>28mm tires:</strong> 70-80 PSI<br/>
              <strong>32mm tires:</strong> 60-70 PSI<br/>
              <strong>40mm+ gravel:</strong> 35-50 PSI
            </p>

            <h2>The Front vs Rear Difference</h2>
            <p>
              Your rear tire carries more weight (you + gear), so it needs 5-10 PSI more than the front. This improves comfort without sacrificing performance, since the front tire has less load.
            </p>

            <h2>Adjusting for Real-World Conditions</h2>
            <p>
              Your optimal pressure changes based on conditions:
            </p>

            <ul>
              <li><strong>Rough roads:</strong> Drop pressure 5-10 PSI for better comfort and traction</li>
              <li><strong>Wet conditions:</strong> Lower pressure increases contact patch and grip</li>
              <li><strong>Long rides:</strong> Start 5 PSI higher - pressure drops as tires warm up</li>
              <li><strong>Racing:</strong> Higher pressure for maximum speed on smooth courses</li>
            </ul>

            <h2>Common Pressure Mistakes</h2>
            <p>
              Avoid these performance-killing errors:
            </p>

            <ul>
              <li><strong>Copying pro settings:</strong> Pros weigh 130 lbs and race on perfect roads</li>
              <li><strong>Ignoring tire width:</strong> 25mm and 28mm tires need very different pressures</li>
              <li><strong>Never checking:</strong> Tires lose 1-2 PSI per week naturally</li>
              <li><strong>One-size-fits-all:</strong> Different rides need different pressures</li>
            </ul>

            <h2>The Comfort-Performance Balance</h2>
            <p>
              Modern research shows that slightly lower pressures often roll faster on real roads. The sweet spot balances rolling resistance, comfort, and puncture protection. Start with the recommendations above and adjust based on feel.
            </p>

            {/* CTA Section */}
            <div className="bg-zinc-800 rounded-lg p-6 my-8">
              <h3 className="text-xl font-bold mb-3">Calculate Your Optimal Tire Pressure</h3>
              <p className="text-zinc-300 mb-4">
                Use CrankSmith's tire pressure calculator to find your perfect PSI based on your weight, tire size, and riding conditions.
              </p>
              <Link 
                href="/tire-pressure"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
              >
                Try the Pressure Calculator
              </Link>
            </div>

            <p>
              Remember: the fastest tire pressure is the one that rolls smoothly over your actual roads. Experiment within the recommended ranges and pay attention to how your bike feels - your body will tell you when you've found the sweet spot.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}