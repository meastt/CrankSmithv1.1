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
        
        console.log('🔧 useComponentDatabase loaded components:', {
          bikeType,
          loadedComponents,
          cranksetsLength: loadedComponents.cranksets?.length,
          cassettesLength: loadedComponents.cassettes?.length
        });
        
        // Validate that we got components
        if (!loadedComponents.cranksets || !loadedComponents.cassettes) {
          throw new Error(`Invalid component data structure for bikeType: ${bikeType}`);
        }
        
        if (loadedComponents.cranksets.length === 0 && loadedComponents.cassettes.length === 0) {
          console.warn('⚠️ No components found for bikeType:', bikeType);
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
    cranksets: components.cranksets,
    cassettes: components.cassettes,
    loading,
    error
  }), [components.cranksets, components.cassettes, loading, error]);

  console.log('🔧 useComponentDatabase returning:', {
    bikeType,
    memoizedComponents,
    cranksetsLength: memoizedComponents.cranksets?.length,
    cassettesLength: memoizedComponents.cassettes?.length,
    loading: memoizedComponents.loading,
    error: memoizedComponents.error
  });

  // Add a very obvious log to confirm the fix is deployed
  console.log('🚀 FIX DEPLOYED - Components should now work!', {
    hasCranksets: !!memoizedComponents.cranksets?.length,
    hasCassettes: !!memoizedComponents.cassettes?.length,
    cranksetsCount: memoizedComponents.cranksets?.length || 0,
    cassettesCount: memoizedComponents.cassettes?.length || 0
  });

  return memoizedComponents;
}; 