// components/ErrorBoundary.js - Error boundary component to catch React errors
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Store error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI based on the context
      const { fallback, context = 'component' } = this.props;
      
      if (fallback) {
        return fallback;
      }

      // Default fallback UI with different styles based on context
      const containerStyle = context === 'page' ? 'min-h-screen' : 'min-h-[200px]';
      const titleSize = context === 'page' ? 'text-xl' : 'text-lg';
      
      return (
        <div className={`${containerStyle} flex items-center justify-center p-8 error-boundary-fallback`}>
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h3 className={`${titleSize} font-semibold mb-2`} style={{ color: 'var(--text-primary)' }}>
              Something went wrong
            </h3>
            
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {context === 'page' 
                ? "We're having trouble loading this page. Please try refreshing or contact support if the issue persists."
                : "This component encountered an error. You can try refreshing the page or continue using other features."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                style={{ 
                  borderColor: 'var(--border-light)', 
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent'
                }}
              >
                Refresh Page
              </button>
            </div>
            
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Debug Info (Development Only)
                </summary>
                <pre className="text-xs p-3 rounded bg-gray-100 overflow-auto max-h-40" style={{ color: 'var(--text-primary)' }}>
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