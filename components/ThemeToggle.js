import React from 'react';

export default function ThemeToggle({ theme, toggleTheme, isLoaded = true, ...props }) {
  // Prevent interaction until theme is loaded to avoid flash
  const handleClick = () => {
    if (isLoaded && toggleTheme) {
      toggleTheme();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoaded}
      className={`relative p-2 rounded-xl transition-all duration-200 group ${
        isLoaded 
          ? 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer' 
          : 'bg-neutral-100 dark:bg-neutral-800 opacity-50 cursor-wait'
      }`}
      aria-label={
        props['aria-label'] || 
        `Switch to ${theme === 'light' ? 'dark' : 'light'} mode${!isLoaded ? ' (loading...)' : ''}`
      }
      title={!isLoaded ? 'Loading theme...' : undefined}
      {...props}
    >
      <div className="relative w-6 h-6">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isLoaded && theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isLoaded && theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
      
      {/* Enhanced Tooltip */}
      {isLoaded && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
        </div>
      )}
      
      {/* Loading tooltip */}
      {!isLoaded && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-neutral-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Loading theme...
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-700" />
        </div>
      )}
    </button>
  );
} 