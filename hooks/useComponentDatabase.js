import { useState, useEffect, useMemo } from 'react';

// Lazy load components only when needed
const loadComponentsForBikeType = async (bikeType) => {
  if (!bikeType) return { cranksets: [], cassettes: [] };
  
  try {
    // Dynamic import based on bike type
    const { getComponentsForBikeType } = await import('../lib/components');
    return getComponentsForBikeType(bikeType);
  } catch (error) {
    console.error('Error loading components:', error);
    return { cranksets: [], cassettes: [] };
  }
};

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
        const loadedComponents = await loadComponentsForBikeType(bikeType);
        setComponents(loadedComponents);
      } catch (err) {
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