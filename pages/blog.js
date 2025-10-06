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
      
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">CrankSmith Blog</h1>
            <p className="text-[var(--text-secondary)] text-lg">
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
          <div className="mt-16 bg-[var(--bg-secondary)] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Setup?</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Use CrankSmith's gear calculator to find your perfect drivetrain configuration
            </p>
            <Link 
              href="/calculator"
              className="inline-block bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] px-6 py-3 rounded-lg font-semibold transition-colors"
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
    <article className="bg-[var(--bg-secondary)] rounded-lg p-6 hover:bg-[var(--bg-tertiary)] transition-colors">
      <div className="flex items-center gap-4 mb-3 text-sm text-[var(--text-secondary)]">
        <span className="bg-[var(--accent-blue)] text-white px-2 py-1 rounded text-xs">
          {post.category}
        </span>
        <time>{new Date(post.date).toLocaleDateString()}</time>
        <span>{post.readTime}</span>
      </div>
      
      <h2 className="text-xl font-bold mb-3 hover:text-[var(--accent-blue)]">
        <Link href={`/blog/${post.id}`}>
          {post.title}
        </Link>
      </h2>
      
      <p className="text-[var(--text-secondary)] mb-4">
        {post.excerpt}
      </p>
      
      <Link 
        href={`/blog/${post.id}`}
        className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] font-medium"
      >
        Read More →
      </Link>
    </article>
  );
}