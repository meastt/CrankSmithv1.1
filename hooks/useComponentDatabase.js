import { useState, useEffect, useMemo } from 'react';
import { getComponentsForBikeType } from '../lib/components';

export const useComponentDatabase = (bikeType) => {
  const [components, setComponents] = useState({ cranksets: [], cassettes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bikeType) {
      console.log('🔧 useComponentDatabase: No bikeType provided, returning empty components');
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
        
        console.log('🔧 useComponentDatabase: Components loaded successfully:', {
          bikeType,
          cranksets: loadedComponents.cranksets,
          cassettes: loadedComponents.cassettes,
          cranksetsLength: loadedComponents.cranksets?.length || 0,
          cassettesLength: loadedComponents.cassettes?.length || 0,
          status: loadedComponents.cranksets?.length > 0 ? '✅ Success' : '⚠️ No components found'
        });
        
        // Validate that we got components
        if (!loadedComponents.cranksets || !loadedComponents.cassettes) {
          throw new Error(`Invalid component data structure for bikeType: ${bikeType}`);
        }
        
        if (loadedComponents.cranksets.length === 0 && loadedComponents.cassettes.length === 0) {
          console.warn(`⚠️  useComponentDatabase: No components found for bikeType: ${bikeType}`);
        }
        
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