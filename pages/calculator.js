// pages/calculator.js - Redesigned calculator page - tool first, no marketing fluff
import { useState, useEffect } from 'react';
import GearSelectorPanel from '../components/GearSelectorPanel';
import SimulationResults from '../components/SimulationResults';
import PerformanceChart from '../components/PerformanceChart';
import BuildSummaryCard from '../components/BuildSummaryCard';
import { RileyChat } from '../lib/rileyAI';
import { CompatibilityChecker } from '../lib/compatibilityChecker';
import { bikeConfig, componentDatabase } from '../lib/components';
import SEOHead from '../components/SEOHead';
import { useCalculatorState } from '../hooks/useCalculatorState';
import ErrorBoundary from '../components/ErrorBoundary';

// Compatibility display component
const CompatibilityDisplay = ({ compatibilityResults, className = "" }) => {
  if (!compatibilityResults) return null;

  const { status, title, message, actionItems, criticalIssues, minorWarnings } = compatibilityResults;

  const statusStyles = {
    compatible: {
      bg: 'bg-green-500/10',
      border: 'border-green-500',
      iconBg: 'bg-green-500',
      titleColor: 'text-green-600 dark:text-green-400'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
      titleColor: 'text-yellow-600 dark:text-yellow-400'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      iconBg: 'bg-red-500',
      titleColor: 'text-red-600 dark:text-red-400'
    }
  };

  const styles = statusStyles[status] || {};
  const getStatusIcon = () => {
    switch (status) {
      case 'compatible': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '?';
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${styles.bg} ${styles.border} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full ${styles.iconBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${styles.titleColor} mb-1`}>{title}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{message}</p>
          
          {criticalIssues && criticalIssues.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Issues:</p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                {criticalIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {minorWarnings && minorWarnings.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">Considerations:</p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                {minorWarnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actionItems && actionItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-900 dark:text-white mb-1">Recommendations:</p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                {actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// localStorage functions with quota handling
const localStorageDB = {
  getConfigs: () => {
    try {
      const saved = localStorage.getItem('cranksmith_configs');
      return { data: saved ? JSON.parse(saved) : [] };
    } catch (error) {
      console.error('Error loading configs:', error);
      return { data: [], error: 'Failed to load configurations' };
    }
  },
  saveConfig: async (config) => {
    try {
      const existing = await localStorageDB.getConfigs();
      const newConfig = { ...config, id: Date.now(), created_at: new Date().toISOString() };
      const updated = [...existing.data, newConfig];

      try {
        localStorage.setItem('cranksmith_configs', JSON.stringify(updated));
        return { error: null };
      } catch (storageError) {
        // Handle quota exceeded error
        if (storageError.name === 'QuotaExceededError' || storageError.code === 22) {
          // Try to clean up old configs and retry
          if (updated.length > 1) {
            const trimmed = updated.slice(-10); // Keep only last 10 configs
            localStorage.setItem('cranksmith_configs', JSON.stringify(trimmed));
            return { error: null, warning: 'Storage limit reached. Oldest configurations were removed.' };
          }
          return { error: 'Storage quota exceeded. Please delete some saved configurations.' };
        }
        throw storageError;
      }
    } catch (error) {
      console.error('Error saving config:', error);
      return { error: error.message || 'Failed to save configuration' };
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
      return { error: error.message || 'Failed to delete configuration' };
    }
  }
};

// Bike type icons
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

// Toast Notification
const Toast = ({ message, show, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <div className={`fixed top-4 right-4 z-[10001] p-4 rounded-lg shadow-lg max-w-sm bg-green-500 text-white transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}>
      ✅ {message}
    </div>
  );
};

export default function Calculator() {
  const {
    bikeType, currentSetup, proposedSetup, results, loading, speedUnit,
    compatibilityResults, validation, setBikeType, updateCurrentSetup,
    updateProposedSetup, setResults, setCompatibilityResults,
    resetCalculator, calculateResults
  } = useCalculatorState();

  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showRiley, setShowRiley] = useState(false);
  const [compatibilityChecker] = useState(new CompatibilityChecker());
  const [toast, setToast] = useState({ show: false, message: '' });
  const [calculationError, setCalculationError] = useState(null);

  useEffect(() => {
    const handler = () => { 
      resetCalculator(); 
      setShowRiley(false); 
      setCalculationError(null);
    };
    window.addEventListener('reset-calculator', handler);
    return () => window.removeEventListener('reset-calculator', handler);
  }, [resetCalculator]);

  useEffect(() => {
    const loadSavedConfigs = async () => {
      try {
        const { data } = await localStorageDB.getConfigs();
        if (data) setSavedConfigs(data);
      } catch (error) {
        console.error('Error loading saved configurations:', error);
      }
    };
    loadSavedConfigs();
  }, []);

  const checkCompatibility = () => {
    try {
      if (proposedSetup.crankset && proposedSetup.cassette && bikeType) {
        const compatibility = compatibilityChecker.checkCompatibility(proposedSetup, bikeType);
        const summary = compatibilityChecker.generateCompatibilitySummary(compatibility);
        setCompatibilityResults(summary);
      }
    } catch (error) {
      console.error('Compatibility check failed:', error);
    }
  };

  const handleCalculate = async () => {
    setCalculationError(null);

    try {
      const calculationResults = await calculateResults();

      // Only proceed with compatibility check if calculation succeeded
      if (!calculationResults) {
        throw new Error('Calculation returned no results');
      }

      checkCompatibility();

      // Show Riley AI after successful calculation
      setTimeout(() => {
        if (calculationResults && !calculationError) {
          setShowRiley(true);
        }
      }, 2000);

    } catch (error) {
      const errorMessage = error.message || 'Calculation failed. Please check your inputs and try again.';
      setCalculationError(errorMessage);
      showToast(errorMessage);

      // Don't show Riley AI if calculation failed
      setShowRiley(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
  };
  
  const handleSaveConfig = async () => {
    if (!results) { 
      showToast('Please calculate results before saving'); 
      return; 
    }
    
    try {
      const config = {
        name: `${bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} Setup ${new Date().toLocaleDateString()}`,
        bikeType, 
        currentSetup, 
        proposedSetup, 
        results, 
        compatibilityResults,
      };
      
      const { error } = await localStorageDB.saveConfig(config);
      if (error) { 
        showToast('Failed to save configuration.'); 
      } else {
        const { data } = await localStorageDB.getConfigs();
        setSavedConfigs(data || []);
        showToast('Configuration saved!');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      showToast('Failed to save configuration.');
    }
  };

  const handleLoadConfig = (config) => {
    try {
      updateCurrentSetup(config.currentSetup);
      updateProposedSetup(config.proposedSetup);
      setResults(config.results);
      setBikeType(config.bikeType);
      setCompatibilityResults(config.compatibilityResults);
      setCalculationError(null);
      showToast(`Loaded "${config.name}"!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToast('Failed to load configuration.');
    }
  };

  const handleDeleteConfig = async (id) => {
    if (window.confirm(`Delete this configuration?`)) {
      try {
        const { error } = await localStorageDB.deleteConfig(id);
        if (error) { 
          showToast('Failed to delete configuration.'); 
        } else {
          const { data } = await localStorageDB.getConfigs();
          setSavedConfigs(data || []);
          showToast('Configuration deleted.');
        }
      } catch (error) {
        console.error('Error deleting configuration:', error);
        showToast('Failed to delete configuration.');
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Bike Gear Calculator - CrankSmith"
        description="Calculate gear ratios, check drivetrain compatibility, and optimize your bike setup. Free gear calculator for road, gravel, and mountain bikes."
        url="https://cranksmith.com/calculator"
        image="/og-image.jpg"
      />
      <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ show: false, message: '' })} />

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        <main className="container-responsive py-8">
          {/* Simple Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-black mb-4 text-neutral-900 dark:text-white">
              Gear Calculator
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Calculate gear ratios and check compatibility for your bike setup
            </p>
          </div>

          {/* Bike Type Selection */}
          <section className="mb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                1. Select Bike Type
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(bikeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setBikeType(type)}
                    className={`card cursor-pointer text-left ${
                      bikeType === type ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 mb-4 text-neutral-600 dark:text-neutral-300">
                        {BikeIcons[type]}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">
                        {config.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {config.description}
                      </p>
                      {bikeType === type && (
                        <div className="mt-4">
                          <span className="badge-primary text-xs px-3 py-1">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Component Selection */}
          {bikeType && (
            <section className="mb-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                  2. Configure Components
                </h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  <ErrorBoundary context="component">
                    <GearSelectorPanel
                      title="Current Setup"
                      subtitle="Your existing configuration"
                      badge="Current"
                      badgeColor="bg-blue-500"
                      setup={currentSetup}
                      setSetup={updateCurrentSetup}
                      config={bikeConfig[bikeType]}
                      bikeType={bikeType}
                      icon="🚲"
                    />
                  </ErrorBoundary>

                  <ErrorBoundary context="component">
                    <GearSelectorPanel
                      title="Proposed Setup"
                      subtitle="Your planned configuration"
                      badge="Proposed"
                      badgeColor="bg-green-500"
                      setup={proposedSetup}
                      setSetup={updateProposedSetup}
                      config={bikeConfig[bikeType]}
                      bikeType={bikeType}
                      icon="⚡"
                    />
                  </ErrorBoundary>
                </div>

                {/* Calculate Button */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={!validation.canAnalyze || loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg px-12 py-4"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      'Calculate Results'
                    )}
                  </button>
                  
                  {(proposedSetup.crankset || proposedSetup.cassette) && (
                    <button
                      onClick={() => setShowRiley(!showRiley)}
                      className="btn-outline"
                    >
                      <span className="mr-2">🤖</span>
                      {showRiley ? 'Hide' : 'Ask'} Riley AI
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Error Display */}
          {calculationError && (
            <section className="mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="card border-l-4 border-l-red-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      !
                    </div>
                    <div>
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-2 text-xl">Error</h4>
                      <p className="text-red-700 dark:text-red-300">{calculationError}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Compatibility Results */}
          {compatibilityResults && (
            <section className="mb-12">
              <div className="max-w-4xl mx-auto">
                <CompatibilityDisplay compatibilityResults={compatibilityResults} />
              </div>
            </section>
          )}

          {/* Riley AI Chat */}
          {showRiley && (
            <section className="mb-12 bg-neutral-100 dark:bg-neutral-900 py-12">
              <div className="container-responsive">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white text-center">
                    Ask Riley AI
                  </h2>
                  <ErrorBoundary context="component">
                    <RileyChat 
                      userSetup={proposedSetup}
                      analysisResults={results}
                      componentDatabase={componentDatabase}
                      bikeType={bikeType}
                      compatibilityResults={compatibilityResults}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </section>
          )}

          {/* Results */}
          {results && (
            <section className="mb-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                  Results
                </h2>
                <div className="space-y-8">
                  <ErrorBoundary context="component">
                    <SimulationResults 
                      results={results}
                      speedUnit={speedUnit}
                      bikeType={bikeType}
                    />
                  </ErrorBoundary>
                  
                  <ErrorBoundary context="component">
                    <PerformanceChart 
                      current={results.current}
                      proposed={results.proposed}
                      speedUnit={speedUnit}
                    />
                  </ErrorBoundary>
                  
                  <ErrorBoundary context="component">
                    <BuildSummaryCard 
                      currentSetup={currentSetup}
                      proposedSetup={proposedSetup}
                      results={results}
                      onSave={handleSaveConfig}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </section>
          )}

          {/* Saved Configurations */}
          {savedConfigs.length > 0 && (
            <section className="mb-12">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Saved Configurations
                  </h2>
                  <button
                    onClick={() => setShowSaved(!showSaved)}
                    className="btn-outline"
                  >
                    {showSaved ? 'Hide' : 'Show'} ({savedConfigs.length})
                  </button>
                </div>

                {showSaved && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedConfigs.map((config) => (
                      <div key={config.id} className="card">
                        <h3 className="font-bold mb-2 text-neutral-900 dark:text-white">{config.name}</h3>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 mb-4">
                          <p>Type: {config.bikeType}</p>
                          <p>Crankset: {config.proposedSetup?.crankset?.model || 'N/A'}</p>
                          <p>Cassette: {config.proposedSetup?.cassette?.model || 'N/A'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadConfig(config)}
                            className="btn-primary flex-1"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="btn-outline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
