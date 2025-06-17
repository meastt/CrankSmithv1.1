import { useState, useEffect } from 'react';
import GearSelectorPanel from '../components/GearSelectorPanel';
import SimulationResults from '../components/SimulationResults';
import PerformanceChart from '../components/PerformanceChart';
import BuildSummaryCard from '../components/BuildSummaryCard';
import { compareSetups } from '../lib/calculations';
import { bikeConfig, getComponentsForBikeType, componentDatabase } from '../lib/components';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';
import SEOHead from '../components/SEOHead';

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
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoadConfig = async () => {
    setIsLoading(true);
    
    try {
      // Add visual feedback immediately
      const toast = createToast('Loading configuration...', 'loading');
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load the configuration
      await onLoad(config);
      
      // Update toast to success
      updateToast(toast, `✅ Loaded "${config.name}" successfully!`, 'success');
      
      // Scroll to top smoothly
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => hideToast(toast), 3000);
      
    } catch (error) {
      console.error('Error loading config:', error);
      createToast('❌ Failed to load configuration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (window.confirm(`Are you sure you want to delete "${config.name}"?`)) {
      try {
        await onDelete(config.id);
        createToast(`🗑️ Deleted "${config.name}"`, 'success');
      } catch (error) {
        console.error('Error deleting config:', error);
        createToast('❌ Failed to delete configuration', 'error');
      }
    }
  };

  return (
    <div className="garage-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {config.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {config.bikeType ? config.bikeType.charAt(0).toUpperCase() + config.bikeType.slice(1) : 'Unknown'} Bike
          </p>
        </div>
        <button
          onClick={handleDeleteConfig}
          className="p-2 rounded-lg transition-colors hover:bg-red-50"
          style={{ color: 'var(--text-tertiary)' }}
          title="Delete configuration"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Configuration Details */}
      <div className="space-y-3 mb-4">
        {/* Components */}
        <div>
          <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Components
          </h4>
          <div className="space-y-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <div className="flex justify-between">
              <span>Crankset:</span>
              <span className="font-medium">{config.proposedSetup?.crankset?.model || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cassette:</span>
              <span className="font-medium">{config.proposedSetup?.cassette?.model || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Wheel:</span>
              <span className="font-medium">{config.proposedSetup?.wheel || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tire:</span>
              <span className="font-medium">{config.proposedSetup?.tire || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {config.results && (
          <div>
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Performance
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center p-2 rounded" style={{ background: 'var(--surface-elevated)' }}>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {config.results.proposed?.totalWeight}g
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Weight</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'var(--surface-elevated)' }}>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {config.results.proposed?.gearRange}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Range</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Load Button */}
      <button
        onClick={handleLoadConfig}
        disabled={isLoading}
        className={`garage-load-btn w-full py-3 rounded font-semibold transition-all ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed opacity-60' 
            : 'bg-[--color-accent] hover:opacity-90'
        } text-white`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          'Load Configuration'
        )}
      </button>
    </div>
  );
};

// Toast notification system
let toastId = 0;
const activeToasts = new Map();

const createToast = (message, type = 'info') => {
  const id = ++toastId;
  
  const toast = document.createElement('div');
  toast.id = `toast-${id}`;
  toast.className = `
    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
    transform transition-all duration-300 ease-in-out
    ${type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'loading' ? 'bg-blue-500 text-white' :
      'bg-gray-800 text-white'}
  `;
  
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${type === 'loading' ? `
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ` : ''}
      <span>${message}</span>
    </div>
  `;
  
  // Add click to dismiss
  toast.addEventListener('click', () => hideToast(id));
  
  document.body.appendChild(toast);
  activeToasts.set(id, toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });
  
  return id;
};

const updateToast = (id, message, type) => {
  const toast = activeToasts.get(id);
  if (!toast) return;
  
  // Update styling
  toast.className = toast.className.replace(
    /(bg-\w+-500)/g, 
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  );
  
  // Update content (remove loading spinner for success/error)
  toast.querySelector('span').textContent = message;
  const spinner = toast.querySelector('svg');
  if (spinner && type !== 'loading') {
    spinner.remove();
  }
};

const hideToast = (id) => {
  const toast = activeToasts.get(id);
  if (!toast) return;
  
  toast.style.transform = 'translateX(100%)';
  toast.style.opacity = '0';
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
    activeToasts.delete(id);
  }, 300);
};

export default function Home() {
  const [bikeType, setBikeType] = useState('');
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
    <>
      <SEOHead
        title="CrankSmith - Bike Gear Calculator & Compatibility Checker"
        description="Calculate gear ratios, check drivetrain compatibility, and optimize your bike setup. Perfect for cyclists and bike shops."
        url="https://cranksmith.com/calculator"
        image="/og-image.jpg"
      />
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
              <h2 className="text-4xl font-extrabold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Select Your Bike Type
              </h2>
              <p className="text-lg text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                Choose the style of bike you want to optimize. Unlock the full gear configurator to build your perfect setup—save your builds to your garage, and return anytime to load or fine-tune your bikes.
              </p>
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
    </>
  );
}