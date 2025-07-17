// components/ErrorBoundary.js - IMPROVED VERSION
// Critical Bug Fix: Better error handling and more helpful fallback UI
// Quick Win: Automatic error reporting and recovery suggestions

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now() // Unique error ID for tracking
    };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error logging
    const errorDetails = {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.context || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId || Date.now()
    };

    console.error('ErrorBoundary caught an error:', errorDetails);
    
    // Store error details for debugging and user reporting
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        custom_map: {
          component: this.props.context || 'unknown'
        }
      });
    }

    // Store error in localStorage for potential user reporting
    try {
      const existingErrors = JSON.parse(localStorage.getItem('cranksmith_errors') || '[]');
      existingErrors.push(errorDetails);
      // Keep only last 5 errors to prevent storage bloat
      const recentErrors = existingErrors.slice(-5);
      localStorage.setItem('cranksmith_errors', JSON.stringify(recentErrors));
    } catch (storageError) {
      console.warn('Failed to store error details:', storageError);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  }

  handleReload = () => {
    // Clear any cached data that might be causing issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      }).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }

  handleReportError = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      component: this.props.context || 'unknown',
      error: this.state.error?.toString() || 'Unknown error',
      userAgent: navigator.userAgent.substring(0, 100) // Truncate for privacy
    };

    const mailtoLink = `mailto:support@cranksmith.com?subject=Error Report - ${errorDetails.errorId}&body=${encodeURIComponent(
      `Error Report\n\n` +
      `Error ID: ${errorDetails.errorId}\n` +
      `Component: ${errorDetails.component}\n` +
      `Time: ${errorDetails.timestamp}\n` +
      `Browser: ${errorDetails.userAgent}\n\n` +
      `Error Details:\n${errorDetails.error}\n\n` +
      `Please describe what you were doing when this error occurred:\n\n`
    )}`;

    window.location.href = mailtoLink;
  }

  getErrorSuggestions = () => {
    const { context } = this.props;
    const errorString = this.state.error?.toString() || '';

    // Common error patterns and suggestions
    if (errorString.includes('ChunkLoadError') || errorString.includes('Loading chunk')) {
      return {
        title: 'Loading Error',
        suggestions: [
          'Your internet connection may be unstable',
          'Try refreshing the page',
          'Clear your browser cache',
          'Check if you have an ad blocker interfering'
        ]
      };
    }

    if (errorString.includes('Cannot read property') || errorString.includes('Cannot read properties')) {
      return {
        title: 'Data Error',
        suggestions: [
          'Some component data may be corrupted',
          'Try resetting this component',
          'Clear your browser data for this site',
          'Try using a different browser'
        ]
      };
    }

    if (context === 'page') {
      return {
        title: 'Page Error',
        suggestions: [
          'Try refreshing the page',
          'Go back to the home page',
          'Clear your browser cache',
          'Try using an incognito/private window'
        ]
      };
    }

    // Default suggestions
    return {
      title: 'Component Error',
      suggestions: [
        'Try refreshing the page',
        'The error may be temporary',
        'Try using a different browser',
        'Clear your browser data if the problem persists'
      ]
    };
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { fallback, context = 'component' } = this.props;
      
      if (fallback) {
        return fallback;
      }

      const containerClass = context === 'page' ? 'min-h-screen' : 'min-h-[200px]';
      const errorSuggestions = this.getErrorSuggestions();
      
      return (
        <div className={`${containerClass} flex items-center justify-center p-8`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-center max-w-lg mx-auto">
            {/* Error Icon */}
            <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Error Title */}
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {errorSuggestions.title}
            </h3>
            
            {/* Error Description */}
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {context === 'page' 
                ? "We're having trouble loading this page. This is usually temporary."
                : "This component encountered an error. You can try the suggestions below or continue using other features."
              }
            </p>

            {/* Error ID for support */}
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Error ID: <span className="font-mono">{this.state.errorId}</span>
              </p>
            </div>

            {/* Suggestions */}
            <div className="mb-6 text-left">
                          <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>What you can try:</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                {errorSuggestions.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-4 py-2 border rounded-md transition-colors text-sm font-medium"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                Refresh Page
              </button>

              <button
                onClick={this.handleReportError}
                className="px-4 py-2 border rounded-md transition-colors text-sm font-medium"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                Report Error
              </button>
            </div>
            
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Debug Info (Development Only)
                </summary>
                <pre className="text-xs p-3 rounded overflow-auto max-h-40" style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: `1px solid var(--border-primary)`
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for functional components
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error reporting from functional components
export const useErrorReporting = () => {
  const reportError = (error, context = 'component') => {
    const errorDetails = {
      error: error.toString(),
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.error('Manual error report:', errorDetails);

    // Report to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  };

  return { reportError };
};