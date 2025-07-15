import { useState, useEffect, useMemo } from 'react';
import { getComponentsForBikeType } from '../lib/components';

export const useComponentDatabase = (bikeType) => {
  const [components, setComponents] = useState({ cranksets: [], cassettes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bikeType) {
      setComponents({ cranksets: [], cassettes: [] });
      return;
    }

    const loadComponents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        // Direct function call instead of dynamic import
        const loadedComponents = getComponentsForBikeType(bikeType);
        
        
        // Validate that we got components
        if (!loadedComponents.cranksets || !loadedComponents.cassettes) {
          throw new Error(`Invalid component data structure for bikeType: ${bikeType}`);
        }
        
        if (loadedComponents.cranksets.length === 0 && loadedComponents.cassettes.length === 0) {
          
        }
        
        setComponents(loadedComponents);
      } catch (err) {
        // Keep error logging for debugging purposes but only in development
        if (process.env.NODE_ENV === 'development') {
          console.error('🚨 useComponentDatabase error:', err);
        }
        setError(err.message);
        setComponents({ cranksets: [], cassettes: [] });
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [bikeType]);

  // Memoize the final result to prevent unnecessary re-renders
  const memoizedComponents = useMemo(() => ({
    ...components,
    loading,
    error
  }), [components, loading, error]);

  return memoizedComponents;
}; 