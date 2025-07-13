import { useState, useEffect, useMemo } from 'react';
import { getComponentsForBikeType } from '../lib/components';

export const useComponentDatabase = (bikeType) => {
  const [components, setComponents] = useState({ cranksets: [], cassettes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bikeType) {
      console.log('🔧 useComponentDatabase: No bikeType provided');
      setComponents({ cranksets: [], cassettes: [] });
      return;
    }

    const loadComponents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔧 useComponentDatabase: Loading components for bikeType:', bikeType);
        
        // Direct function call instead of dynamic import
        const loadedComponents = getComponentsForBikeType(bikeType);
        
        console.log('🔧 useComponentDatabase RAW loaded data:', {
          bikeType,
          cranksets: loadedComponents.cranksets,
          cassettes: loadedComponents.cassettes,
          cranksetsLength: loadedComponents.cranksets?.length || 0,
          cassettesLength: loadedComponents.cassettes?.length || 0
        });
        
        setComponents(loadedComponents);
      } catch (err) {
        console.error('🚨 useComponentDatabase error:', err);
        setError(err.message);
        setComponents({ cranksets: [], cassettes: [] });
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [bikeType]);

  // Memoize the result to prevent unnecessary re-renders
  const memoizedComponents = useMemo(() => components, [components]);

  return {
    components: memoizedComponents,
    loading,
    error
  };
}; 