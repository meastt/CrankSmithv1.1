import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FloatingAskRileyButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Don't show on the Ask Riley page itself
  if (router.pathname === '/ask-riley') {
    return null;
  }

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 floating-element">
      <Link
        href="/ask-riley"
        className={`group flex items-center gap-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          isExpanded ? 'px-6 py-4' : 'p-4'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Robot Icon */}
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>

        {/* Expandable Text */}
        <div
          className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
            isExpanded ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          <span className="font-medium text-sm">Ask Riley</span>
        </div>

        {/* Pulse animation for attention */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple opacity-75 animate-ping" />
      </Link>

      {/* Tooltip for when not expanded */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Ask Riley your bike questions
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
}