// pages/blog.js
import Link from 'next/link';
import SEOHead from '../components/SEOHead';

// Sample blog posts - you'll replace this with actual content
const blogPosts = [
  {
    id: 'bike-gear-optimization-guide',
    title: 'Complete Bike Gear Optimization Guide',
    excerpt: 'Master bike gear optimization with our comprehensive guide. Learn gear ratios, cadence, climbing gears, and how to choose the perfect drivetrain setup.',
    date: '2024-12-16',
    readTime: '12 min read',
    category: 'Gear Optimization'
  },
  {
    id: 'optimal-climbing-gears',
    title: 'How to Choose Optimal Climbing Gears for Your Next Hill Climb',
    excerpt: 'Learn the science behind gear selection for steep climbs and maintain your cadence when the road goes up.',
    date: '2025-06-15',
    readTime: '5 min read',
    category: 'Gear Selection'
  },
  {
    id: 'gravel-vs-road-gearing',
    title: 'Gravel vs Road Bike Gearing: What\'s the Difference?',
    excerpt: 'Understanding why gravel bikes need different gear ratios and how to optimize for mixed terrain riding.',
    date: '2025-06-10',
    readTime: '7 min read',
    category: 'Bike Setup'
  },
  {
    id: 'tire-pressure-performance',
    title: 'The Hidden Performance Cost of Wrong Tire Pressure',
    excerpt: 'How tire pressure affects rolling resistance, comfort, and speed - plus how to find your optimal PSI.',
    date: '2025-06-05',
    readTime: '4 min read',
    category: 'Performance'
  }
];

export default function BlogPage() {
  return (
    <>
      <SEOHead 
        title="CrankSmith Blog - Bike Gear & Performance Tips"
        description="Expert advice on bike gearing, tire pressure, and performance optimization for cyclists and bike shops."
        url="https://cranksmith.com/blog"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">CrankSmith Blog</h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg">
              Expert tips on bike gearing, performance, and optimization
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-white dark:bg-neutral-800 rounded-lg p-8 text-center shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Ready to Optimize Your Setup?</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Use CrankSmith's gear calculator to find your perfect drivetrain configuration
            </p>
            <Link 
              href="/calculator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try the Calculator
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Blog Post Card Component
function BlogPostCard({ post }) {
  return (
    <article className="bg-white dark:bg-neutral-800 rounded-lg p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600 dark:text-neutral-300">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
          {post.category}
        </span>
        <time>{new Date(post.date).toLocaleDateString()}</time>
        <span>{post.readTime}</span>
      </div>
      
      <h2 className="text-xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 text-neutral-900 dark:text-white">
        <Link href={`/blog/${post.id}`}>
          {post.title}
        </Link>
      </h2>
      
      <p className="text-neutral-600 dark:text-neutral-300 mb-4">
        {post.excerpt}
      </p>
      
      <Link 
        href={`/blog/${post.id}`}
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        Read More →
      </Link>
    </article>
  );
}