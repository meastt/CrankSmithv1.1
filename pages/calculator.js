import { useState, useEffect } from 'react';
import GearSelectorPanel from '../components/GearSelectorPanel';
import SimulationResults from '../components/SimulationResults';
import PerformanceChart from '../components/PerformanceChart';
import BuildSummaryCard from '../components/BuildSummaryCard';
import { compareSetups } from '../lib/calculations';
import { bikeConfig, getComponentsForBikeType, componentDatabase } from '../lib/components';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';

// Default empty component database for initial render
const defaultComponentDatabase = {
  cranksets: [],
  cassettes: []
};

// Simple localStorage functions (no Supabase)
const localStorageDB = {
  getConfigs: () => {
    try {
      const saved = localStorage.getItem('cranksmith_configs');
      return { data: saved ? JSON.parse(saved) : [] };
    } catch (error) {
      console.error('Error loading configs:', error);
      return { data: [] };
    }
  },
  
  saveConfig: async (config) => {
    try {
      const existing = await localStorageDB.getConfigs();
      const newConfig = {
        ...config,
        id: Date.now(), // Simple ID generation
        created_at: new Date().toISOString()
      };
      const updated = [...existing.data, newConfig];
      localStorage.setItem('cranksmith_configs', JSON.stringify(updated));
      return { error: null };
    } catch (error) {
      console.error('Error saving config:', error);
      return { error: 'Failed to save configuration' };
    }
  },
  
  deleteConfig: async (id) => {
    try {
      const existing = await localStorageDB.getConfigs();
      const updated = existing.data.filter(config => config.id !== id);
      localStorage.setItem('cranksmith_configs', JSON.stringify(updated));
      return { error: null };
    } catch (error) {
      console.error('Error deleting config:', error);
      return { error: 'Failed to delete configuration' };
    }
  }
};

// Bike type icons - simple SVGs for each style
const BikeIcons = {
  road: (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <circle cx="20" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="80" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 45 L35 25 L45 30 L55 20 L70 25 L80 45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M35 25 L45 35" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 20 L40 20 L35 25" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  gravel: (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <circle cx="20" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="80" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M20 45 L35 28 L45 32 L55 22 L70 28 L80 45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M35 28 L45 35" stroke="currentColor" strokeWidth="2"/>
      <path d="M28 22 L42 22 L35 28" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  mtb: (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <circle cx="20" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="80" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M20 45 L35 30 L45 35 L55 25 L70 30 L80 45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M35 30 L45 35" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 25 L40 25" stroke="currentColor" strokeWidth="3"/>
    </svg>
  )
};

const GarageCard = ({ config, onLoad, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const bikeTypeDisplay = {
    road: 'Road',
    gravel: 'Gravel', 
    mtb: 'Mountain'
  };

  const formatSpecs = (setup) => {
    if (!setup) return { crankset: 'N/A', cassette: 'N/A', wheel: 'N/A', tire: 'N/A' };

    // Get crankset info
    const crankset = setup.crankset;
    const cranksetText = crankset ? 
      `${crankset.model || ''} ${crankset.teeth ? crankset.teeth.join('/') + 'T' : ''}`.trim() : 
      'N/A';
    
    // Get cassette info
    const cassette = setup.cassette;
    const cassetteText = cassette ? 
      `${cassette.model || ''} ${cassette.teeth ? cassette.teeth.join('-') + 'T' : ''}`.trim() : 
      'N/A';
    
    // Get wheel and tire info
    const wheelText = setup.wheel ? `${setup.wheel} wheel` : 'N/A';
    const tireText = setup.tire ? `${setup.tire}mm tire` : 'N/A';
    
    return { 
      crankset: cranksetText,
      cassette: cassetteText,
      wheel: wheelText,
      tire: tireText
    };
  };

  const currentSpecs = formatSpecs(config.currentSetup);
  const proposedSpecs = formatSpecs(config.proposedSetup);

  // Safely get weight change
  const getWeightChange = () => {
    if (!config.results) return 0;
    if (config.results.comparison?.weightChange !== undefined) {
      return config.results.comparison.weightChange;
    }
    if (config.results.weightChange !== undefined) {
      return config.results.weightChange;
    }
    return 0;
  };

  const weightChange = getWeightChange();

  return (
    <div className="bg-[--color-surface] border border-[--color-border] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[--color-accent]/30">
      <div className="p-4 border-b border-[--color-border]/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 text-[--color-accent]">
              {BikeIcons[config.bikeType] || BikeIcons.road}
            </div>
            <div>
              <h3 className="font-semibold text-[--color-text-primary] text-lg leading-tight">
                {config.name}
              </h3>
              <p className="text-[--color-text-secondary] text-sm">
                {bikeTypeDisplay[config.bikeType] || 'Road'} • {new Date(config.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 rounded-full bg-[--color-surface] hover:bg-[--color-accent] text-[--color-text-secondary] hover:text-white transition-all duration-200 flex items-center justify-center border border-[--color-border]"
            title="Delete configuration"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[--color-text-secondary] mb-1">Current Setup</p>
              <p className="text-[--color-text-primary] font-mono">
                {currentSpecs.crankset} → {currentSpecs.cassette}
              </p>
              <p className="text-[--color-text-primary] text-xs mt-1">
                {currentSpecs.wheel} • {currentSpecs.tire}
              </p>
            </div>
            <div>
              <p className="text-[--color-text-secondary] mb-1">Proposed Setup</p>
              <p className="text-[--color-text-primary] font-mono">
                {proposedSpecs.crankset} → {proposedSpecs.cassette}
              </p>
              <p className="text-[--color-text-primary] text-xs mt-1">
                {proposedSpecs.wheel} • {proposedSpecs.tire}
              </p>
            </div>
          </div>
          
          {config.results && (
            <div className="mt-3 p-2 bg-[--color-surface] rounded border border-[--color-border]/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[--color-text-secondary]">Weight Change:</span>
                <span className={`font-semibold ${weightChange > 0 ? 'text-[--color-accent]' : 'text-green-500'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange}g
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onLoad(config)}
          className="w-full py-3 bg-[--color-accent] hover:opacity-90 text-white font-semibold rounded transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Load Configuration
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#010912] p-6 rounded-lg max-w-md w-full mx-4 border border-[--color-border] shadow-xl">
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Delete Configuration
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete this configuration? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  background: 'var(--surface-primary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(config.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ background: 'var(--accent-red)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [bikeType, setBikeType] = useState('road');
  const [currentSetup, setCurrentSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  });
  const [proposedSetup, setProposedSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [speedUnit, setSpeedUnit] = useState('mph');

  // Load saved configurations when the page loads
  useEffect(() => {
    const loadSavedConfigs = async () => {
      try {
        const { data } = await localStorageDB.getConfigs();
        if (data) {
          setSavedConfigs(data);
        }
      } catch (error) {
        console.error('Error loading saved configurations:', error);
      }
    };

    loadSavedConfigs();
  }, []); // Empty dependency array means this runs once on mount

  // Calculate setup completion percentage
  const calculateSetupCompletion = (setup) => {
    console.log('=== Calculating Completion ===');
    console.log('Setup to check:', setup);
    
    const requiredFields = ['wheel', 'tire', 'crankset', 'cassette'];
    const completedFields = requiredFields.filter(field => {
      const value = setup[field];
      console.log(`Checking field ${field}:`, value);
      
      if (field === 'crankset' || field === 'cassette') {
        // For crankset and cassette, we need a non-null object with at least one property
        const isComplete = value !== null && 
                         typeof value === 'object' && 
                         Object.keys(value).length > 0;
        console.log(`${field} is ${isComplete ? 'complete' : 'incomplete'}`);
        return isComplete;
      }
      
      // For wheel and tire, we need a non-empty string
      const isComplete = typeof value === 'string' && value.trim() !== '';
      console.log(`${field} is ${isComplete ? 'complete' : 'incomplete'}`);
      return isComplete;
    });
    
    const percentage = (completedFields.length / requiredFields.length) * 100;
    console.log('Completed fields:', completedFields);
    console.log('Completion percentage:', percentage);
    console.log('==========================');
    return percentage;
  };

  // Calculate completion percentages
  const currentSetupCompletion = calculateSetupCompletion(currentSetup);
  const proposedSetupCompletion = calculateSetupCompletion(proposedSetup);
  const totalCompletion = (currentSetupCompletion + proposedSetupCompletion) / 2;

  // Component change handlers
  const handleCurrentWheelChange = (value) => {
    console.log('🔄 Current wheel selected:', value);
    setCurrentSetup(prev => {
      const newSetup = {
        ...prev,
        wheel: value
      };
      console.log('New current setup:', newSetup);
      return newSetup;
    });
  };

  const handleCurrentTireChange = (value) => {
    console.log('🔄 Current tire selected:', value);
    setCurrentSetup(prev => {
      const newSetup = {
        ...prev,
        tire: value
      };
      console.log('New current setup:', newSetup);
      return newSetup;
    });
  };

  const handleProposedWheelChange = (value) => {
    console.log('🔄 Proposed wheel selected:', value);
    setProposedSetup(prev => {
      const newSetup = {
        ...prev,
        wheel: value
      };
      console.log('New proposed setup:', newSetup);
      return newSetup;
    });
  };

  const handleProposedTireChange = (value) => {
    console.log('🔄 Proposed tire selected:', value);
    setProposedSetup(prev => {
      const newSetup = {
        ...prev,
        tire: value
      };
      console.log('New proposed setup:', newSetup);
      return newSetup;
    });
  };

  const handleCurrentCranksetChange = (selectedOption) => {
    console.log('🔄 Current crankset selected:', selectedOption);
    setCurrentSetup(prev => {
      const newSetup = {
        ...prev,
        crankset: selectedOption
      };
      console.log('New current setup:', newSetup);
      return newSetup;
    });
  };

  const handleCurrentCassetteChange = (selectedOption) => {
    console.log('🔄 Current cassette selected:', selectedOption);
    setCurrentSetup(prev => {
      const newSetup = {
        ...prev,
        cassette: selectedOption
      };
      console.log('New current setup:', newSetup);
      return newSetup;
    });
  };

  const handleProposedCranksetChange = (selectedOption) => {
    console.log('🔄 Proposed crankset selected:', selectedOption);
    setProposedSetup(prev => {
      const newSetup = {
        ...prev,
        crankset: selectedOption
      };
      console.log('New proposed setup:', newSetup);
      return newSetup;
    });
  };

  const handleProposedCassetteChange = (selectedOption) => {
    console.log('🔄 Proposed cassette selected:', selectedOption);
    setProposedSetup(prev => {
      const newSetup = {
        ...prev,
        cassette: selectedOption
      };
      console.log('New proposed setup:', newSetup);
      return newSetup;
    });
  };

  // Add useEffect to monitor state changes
  useEffect(() => {
    console.log('=== State Changed ===');
    console.log('Current Setup:', currentSetup);
    console.log('Proposed Setup:', proposedSetup);
    console.log('Current Completion:', currentSetupCompletion);
    console.log('Proposed Completion:', proposedSetupCompletion);
    console.log('Total Completion:', totalCompletion);
    console.log('===================');
  }, [currentSetup, proposedSetup, currentSetupCompletion, proposedSetupCompletion, totalCompletion]);

  // Get components based on bike type, with fallback to empty arrays
  const components = bikeType ? getComponentsForBikeType(bikeType) : defaultComponentDatabase;
  
  useEffect(() => {
    console.log('🔍 bikeType useEffect triggered:', bikeType);
    
    if (bikeType && bikeConfig[bikeType] && componentDatabase?.cranksets) {
      console.log('📝 Setting up defaults for:', bikeType);
      // Don't set default values, just log the available defaults
      const defaults = bikeConfig[bikeType].defaultSetup;
      console.log('Available defaults:', defaults);
    }
  }, [bikeType]);

  const handleCalculate = async () => {
    // Validate both setups are complete
    const currentValidation = validateSetupComplete(currentSetup);
    const proposedValidation = validateSetupComplete(proposedSetup);

    if (!currentValidation.isComplete || !proposedValidation.isComplete) {
      console.log('Cannot calculate: Setup not complete');
      alert('Please complete both setups before analyzing');
      return;
    }

    setLoading(true);
    try {
      // Add a small delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate real results using actual component data
      const realResults = calculateRealPerformance(currentSetup, proposedSetup, speedUnit);
      
      setResults(realResults);
    } catch (error) {
      console.error('Error calculating results:', error);
      alert('Error calculating results. Please check your component selections.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!results) {
      alert('Please calculate results before saving');
      return;
    }

    const config = {
      name: `${bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} Setup ${new Date().toLocaleDateString()}`,
      bikeType,
      currentSetup,
      proposedSetup,
      results,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await localStorageDB.saveConfig(config);
      if (error) {
        throw error;
      }
      
      // Refresh the saved configs list
      const { data } = await localStorageDB.getConfigs();
      setSavedConfigs(data || []);
      
      // Show success message
      alert('Configuration saved to garage!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  const handleLoadConfig = (config) => {
    setCurrentSetup(config.currentSetup);
    setProposedSetup(config.proposedSetup);
    setResults(config.results);
    setBikeType(config.bikeType);
  };

  const handleDeleteConfig = async (id) => {
    try {
      const { error } = await localStorageDB.deleteConfig(id);
      if (error) {
        throw error;
      }
      // Refresh the saved configs list
      const { data } = await localStorageDB.getConfigs();
      setSavedConfigs(data || []);
    } catch (error) {
      console.error('Error deleting configuration:', error);
      alert('Failed to delete configuration. Please try again.');
    }
  };

  return (
    <main className="main-container container mx-auto px-4 py-12 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="hero-title hero-title-fire">Compare. Calculate. Optimize.</h1>
        <p className="hero-subtitle max-w-2xl mx-auto">
          See exactly how component changes affect your bike's performance with real-world data.
        </p>
        
        {(bikeType || results) && (
          <button
            onClick={() => {
              setBikeType('');
              setCurrentSetup({ wheel: '', tire: '', crankset: null, cassette: null });
              setProposedSetup({ wheel: '', tire: '', crankset: null, cassette: null });
              setResults(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-6 px-6 py-3 rounded-xl font-medium transition-all text-base"
            style={{ 
              background: 'var(--accent-blue)',
              color: 'var(--white)',
              border: '1px solid var(--accent-blue)'
            }}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Start New Analysis
          </button>
        )}
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center quick-start-icon-fire">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {!bikeType ? (
              <>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  How It Works
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Compare any bike components in 3 simple steps
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Great Choice! 🚴‍♂️
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  You've selected a {bikeType} bike. Now configure your components below.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bike Type Selection */}
      {!bikeType && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Select Your Bike Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(bikeConfig).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setBikeType(type)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    bikeType === type
                      ? 'border-[--color-accent] bg-[--color-accent]/10'
                      : 'border-[--color-border] hover:border-[--color-accent]/50'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 text-[--color-accent]">
                    {BikeIcons[type]}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{config.name}</h3>
                  <p className="text-sm text-[--color-text-secondary]">{config.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Component Selection and Analysis */}
      {bikeType && (
        <div className="space-y-8">
          {/* Gear Selector Panels */}
          <div className="grid md:grid-cols-2 gap-8">
            <GearSelectorPanel
              title="Current Setup"
              subtitle="Your current components"
              setup={currentSetup}
              config={{
                wheelSizes: bikeConfig[bikeType].wheelSizes,
                tireWidths: bikeConfig[bikeType].tireWidths,
                onWheelChange: handleCurrentWheelChange,
                onTireChange: handleCurrentTireChange,
                onCranksetChange: handleCurrentCranksetChange,
                onCassetteChange: handleCurrentCassetteChange
              }}
              components={components}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>}
            />

            <GearSelectorPanel
              title="Proposed Setup"
              subtitle="Components you're considering"
              setup={proposedSetup}
              config={{
                wheelSizes: bikeConfig[bikeType].wheelSizes,
                tireWidths: bikeConfig[bikeType].tireWidths,
                onWheelChange: handleProposedWheelChange,
                onTireChange: handleProposedTireChange,
                onCranksetChange: handleProposedCranksetChange,
                onCassetteChange: handleProposedCassetteChange
              }}
              components={components}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>}
            />
          </div>

          {/* Setup Progress and Analyze Button */}
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
                    <span className="text-sm text-gray-600">Current Setup: {Math.round(currentSetupCompletion)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-performance)]" />
                    <span className="text-sm text-gray-600">Proposed Setup: {Math.round(proposedSetupCompletion)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCalculate()}
                  disabled={totalCompletion < 100 || loading}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    totalCompletion < 100 || loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                  style={{ 
                    background: 'var(--accent-blue)',
                    color: 'var(--white)'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Analyze Performance
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="max-w-4xl mx-auto mt-12">
          <SimulationResults 
            results={results}
            speedUnit={speedUnit}
            bikeType={bikeType}
          />
          <PerformanceChart 
            current={results.current}
            proposed={results.proposed}
            speedUnit={speedUnit}
          />
          <BuildSummaryCard 
            currentSetup={currentSetup}
            proposedSetup={proposedSetup}
            results={results}
            onSave={handleSaveConfig}
          />
        </div>
      )}

      <div id="garage-section" className="mt-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-[--color-accent]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
            </svg>
            <h2 className="text-3xl font-bold text-[--color-text-primary] section-title-fire">My Garage</h2>
          </div>
          <p className="text-[--color-text-secondary] max-w-2xl mx-auto mb-6">
            Your saved bike configurations. Each setup represents hours of careful planning and optimization.
          </p>
          
          {savedConfigs.length > 0 && (
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="text-[--color-accent] hover:opacity-80 transition-colors text-lg font-medium"
            >
              {showSaved ? 'Hide Garage' : 'Show Garage'} ({savedConfigs.length} configurations)
            </button>
          )}
        </div>

        {savedConfigs.length > 0 && showSaved && (
          <div className="garage-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {savedConfigs.map((config) => (
              <GarageCard
                key={config.id}
                config={config}
                onLoad={handleLoadConfig}
                onDelete={handleDeleteConfig}
              />
            ))}
          </div>
        )}

        {savedConfigs.length === 0 && (
          <div className="flex justify-center">
            <div className="max-w-md w-full p-6 bg-[--color-bg] rounded-lg border-2 border-[--color-accent] shadow-lg shadow-[--color-accent]/20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-[--color-accent]">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
                  </svg>
                </div>
                <h3 className="text-[--color-text-primary] text-xl font-semibold mb-2">Empty Garage</h3>
                <p className="text-[--color-text-secondary] text-sm leading-relaxed">
                  Save your first bike configuration to start building your garage. Perfect setups deserve to be remembered.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}