import { useState, useCallback, useMemo } from 'react';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';
import { toast } from '../components/Toast';

const initialSetup = {
  wheel: '',
  tire: '',
  crankset: null,
  cassette: null
};

export const useCalculatorState = () => {
  const [bikeType, setBikeType] = useState('');
  const [currentSetup, setCurrentSetup] = useState(initialSetup);
  const [proposedSetup, setProposedSetup] = useState(initialSetup);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speedUnit, setSpeedUnit] = useState('mph');
  const [compatibilityResults, setCompatibilityResults] = useState(null);

  // Memoized validation
  const validation = useMemo(() => {
    const currentValidation = validateSetupComplete(currentSetup);
    const proposedValidation = validateSetupComplete(proposedSetup);
    
    const totalCompletion = (currentValidation.completion + proposedValidation.completion) / 2;
    
    return {
      current: currentValidation,
      proposed: proposedValidation,
      canAnalyze: currentValidation.isComplete && proposedValidation.isComplete,
      totalCompletion: isNaN(totalCompletion) ? 0 : totalCompletion
    };
  }, [currentSetup, proposedSetup]);

  // Optimized setup update functions
  const updateCurrentSetup = useCallback((updates) => {
    setCurrentSetup(prev => ({ ...prev, ...updates }));
  }, []);

  const updateProposedSetup = useCallback((updates) => {
    setProposedSetup(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset function
  const resetCalculator = useCallback(() => {
    setBikeType('');
    setCurrentSetup(initialSetup);
    setProposedSetup(initialSetup);
    setResults(null);
    setCompatibilityResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate function with race condition prevention
  const calculateResults = useCallback(async () => {
    if (!validation.canAnalyze) {
      toast.warning('Please complete both setups before analyzing');
      return;
    }

    // Prevent concurrent calculations
    if (loading) {
      console.log('Calculation already in progress, skipping...');
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const realResults = calculateRealPerformance(currentSetup, proposedSetup, speedUnit);
      setResults(realResults);
      toast.success('Analysis complete! Check your results below.');
      
      return realResults;
    } catch (error) {
      console.error('Error calculating results:', error);
      toast.error('Error calculating results. Please check your component selections and try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentSetup, proposedSetup, speedUnit, validation.canAnalyze, loading]);

  return {
    // State
    bikeType,
    currentSetup,
    proposedSetup,
    results,
    loading,
    speedUnit,
    compatibilityResults,
    validation,
    
    // Actions
    setBikeType,
    updateCurrentSetup,
    updateProposedSetup,
    setResults,
    setSpeedUnit,
    setCompatibilityResults,
    resetCalculator,
    calculateResults
  };
}; 