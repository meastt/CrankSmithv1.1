// pages/calculator.js - Enhanced calculator with Riley AI integration and compatibility checking
// UPDATED: Added Riley AI integration, enhanced compatibility checking, and PWA-ready mobile optimizations

import { useState, useEffect } from 'react';
import GearSelectorPanel from '../components/GearSelectorPanel';
import SimulationResults from '../components/SimulationResults';
import PerformanceChart from '../components/PerformanceChart';
import BuildSummaryCard from '../components/BuildSummaryCard';
import { RileyChat } from '../lib/rileyAI';
import { CompatibilityChecker } from '../lib/compatibilityChecker';
import { compareSetups } from '../lib/calculations';
import { bikeConfig, componentDatabase } from '../lib/components';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';
import SEOHead from '../components/SEOHead';
import { useCalculatorState } from '../hooks/useCalculatorState';

// Enhanced compatibility display component
const CompatibilityDisplay = ({ compatibilityResults, className = "" }) => {
  if (!compatibilityResults) return null;

  const { status, title, message, actionItems, criticalIssues, minorWarnings } = compatibilityResults;
  
  const getStatusColor = () => {
    switch (status) {
      case 'compatible': return 'var(--success-green)';
      case 'warning': return 'var(--warning-orange)';
      case 'error': return 'var(--error-red)';
      default: return 'var(--text-tertiary)';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${className}`} 
         style={{ 
           background: status === 'compatible' ? 'rgba(0, 166, 81, 0.1)' : 
                      status === 'warning' ? 'rgba(255, 105, 0, 0.1)' : 
                      status === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'var(--surface-elevated)',
           borderColor: getStatusColor()
         }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
               style={{ background: getStatusColor() }}>
            {status === 'compatible' ? '✓' : status === 'warning' ? '!' : '×'}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {message}
          </p>
          
          {/* Critical issues */}
          {criticalIssues?.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--error-red)' }}>
                Critical Issues:
              </div>
              {criticalIssues.map((issue, index) => (
                <div key={index} className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  • {issue}
                </div>
              ))}
            </div>
          )}
          
          {/* Warnings */}
          {minorWarnings?.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--warning-orange)' }}>
                Considerations:
              </div>
              {minorWarnings.slice(0, 2).map((warning, index) => (
                <div key={index} className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  • {warning}
                </div>
              ))}
            </div>
          )}
          
          {/* Top recommendations */}
          {actionItems?.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Recommendations:
              </div>
              {actionItems.slice(0, 2).map((item, index) => (
                <div key={index} className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  • {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple localStorage functions (keeping existing functionality)
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
        id: Date.now(),
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

// Bike type icons (keeping existing)
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

export default function Home() {
  // Use the optimized calculator state hook
  const {
    bikeType,
    currentSetup,
    proposedSetup,
    results,
    loading,
    speedUnit,
    compatibilityResults,
    validation,
    setBikeType,
    updateCurrentSetup,
    updateProposedSetup,
    setResults,
    setSpeedUnit,
    setCompatibilityResults,
    resetCalculator,
    calculateResults
  } = useCalculatorState();

  // Additional state for UI features
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showRiley, setShowRiley] = useState(false);
  const [compatibilityChecker] = useState(new CompatibilityChecker());

  // Listen for reset-calculator event
  useEffect(() => {
    const handler = () => {
      resetCalculator();
      setShowRiley(false);
    };
    window.addEventListener('reset-calculator', handler);
    return () => window.removeEventListener('reset-calculator', handler);
  }, [resetCalculator]);

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
  }, []);

  // Only check compatibility after analysis button is clicked
  const checkCompatibility = () => {
    if (proposedSetup.crankset && proposedSetup.cassette && bikeType) {
      const compatibility = compatibilityChecker.checkCompatibility(proposedSetup, bikeType);
      const summary = compatibilityChecker.generateCompatibilitySummary(compatibility);
      setCompatibilityResults(summary);
    }
  };

  // Component change handlers (keeping existing functionality)
  const handleCurrentWheelChange = (value) => {
    updateCurrentSetup({ wheel: value });
  };

  const handleCurrentTireChange = (value) => {
    updateCurrentSetup({ tire: value });
  };

  const handleProposedWheelChange = (value) => {
    updateProposedSetup({ wheel: value });
  };

  const handleProposedTireChange = (value) => {
    updateProposedSetup({ tire: value });
  };

  const handleCurrentCranksetChange = (selectedOption) => {
    updateCurrentSetup({ crankset: selectedOption });
  };

  const handleCurrentCassetteChange = (selectedOption) => {
    updateCurrentSetup({ cassette: selectedOption });
  };

  const handleProposedCranksetChange = (selectedOption) => {
    updateProposedSetup({ crankset: selectedOption });
  };

  const handleProposedCassetteChange = (selectedOption) => {
    updateProposedSetup({ cassette: selectedOption });
  };

  const handleCalculate = async () => {
    try {
      const realResults = await calculateResults();
      
      // Auto-show Riley after results are ready
      setTimeout(() => setShowRiley(true), 2000);
      
      // Check compatibility after analysis button is clicked
      checkCompatibility();
    } catch (error) {
      // Error is already handled in calculateResults
      console.error('Calculation failed:', error);
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
      compatibilityResults,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await localStorageDB.saveConfig(config);
      if (error) throw error;
      
      const { data } = await localStorageDB.getConfigs();
      setSavedConfigs(data || []);
      
      alert('Configuration saved to garage!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  const handleLoadConfig = (config) => {
    updateCurrentSetup(config.currentSetup);
    updateProposedSetup(config.proposedSetup);
    setResults(config.results);
    setBikeType(config.bikeType);
    setCompatibilityResults(config.compatibilityResults);
  };

  const handleDeleteConfig = async (id) => {
    try {
      const { error } = await localStorageDB.deleteConfig(id);
      if (error) throw error;
      
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
          <h1 className="hero-title">Compare. Calculate. Optimize.</h1>
          <p className="hero-subtitle max-w-2xl mx-auto">
            See exactly how component changes affect your bike's performance with real-world data and AI-powered insights.
          </p>
          
          {(bikeType || results) && (
            <button
              onClick={resetCalculator}
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

        {/* Bike Type Selection */}
        {!bikeType && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Select Your Bike Type
              </h2>
              <p className="text-lg text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                Choose your bike style to unlock the full gear configurator with AI-powered compatibility checking and personalized recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(bikeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setBikeType(type)}
                    className="p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: 'var(--border-light)',
                      background: 'var(--bg-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--accent-blue)';
                      e.target.style.background = 'rgba(59, 130, 246, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.background = 'var(--bg-primary)';
                    }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-blue)' }}>
                      {BikeIcons[type]}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {config.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
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
            <div className="calculator-section grid md:grid-cols-2 gap-8">
              <GearSelectorPanel
                title="Current Setup"
                subtitle="Your current components"
                setup={currentSetup}
                setSetup={updateCurrentSetup}
                config={{
                  wheelSizes: bikeConfig[bikeType].wheelSizes,
                  tireWidths: bikeConfig[bikeType].tireWidths,
                  onWheelChange: handleCurrentWheelChange,
                  onTireChange: handleCurrentTireChange,
                  onCranksetChange: handleCurrentCranksetChange,
                  onCassetteChange: handleCurrentCassetteChange
                }}
                bikeType={bikeType}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>}
              />

              <GearSelectorPanel
                title="Proposed Setup"
                subtitle="Components you're considering"
                setup={proposedSetup}
                setSetup={updateProposedSetup}
                config={{
                  wheelSizes: bikeConfig[bikeType].wheelSizes,
                  tireWidths: bikeConfig[bikeType].tireWidths,
                  onWheelChange: handleProposedWheelChange,
                  onTireChange: handleProposedTireChange,
                  onCranksetChange: handleProposedCranksetChange,
                  onCassetteChange: handleProposedCassetteChange
                }}
                bikeType={bikeType}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>}
              />
            </div>

            {/* Enhanced Compatibility Display */}
            {compatibilityResults && (
              <div className="max-w-4xl mx-auto">
                <CompatibilityDisplay 
                  compatibilityResults={compatibilityResults} 
                  className="mb-4"
                />
              </div>
            )}

            {/* Setup Progress and Analyze Button */}
            <div className="max-w-4xl mx-auto">
              <div className="card">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
                      <span className="text-sm text-gray-600">Current Setup: {Math.round(validation.current.completion)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-performance)]" />
                      <span className="text-sm text-gray-600">Proposed Setup: {Math.round(validation.proposed.completion)}%</span>
                    </div>
                    {compatibilityResults && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" 
                             style={{ background: compatibilityResults.status === 'compatible' ? 'var(--success-green)' : 
                                                 compatibilityResults.status === 'warning' ? 'var(--warning-orange)' : 'var(--error-red)' }} />
                        <span className="text-sm text-gray-600">
                          Compatibility: {compatibilityResults.status === 'compatible' ? 'Good' : 
                                        compatibilityResults.status === 'warning' ? 'Review needed' : 'Issues found'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {/* Ask Riley Button */}
                    {(proposedSetup.crankset || proposedSetup.cassette) && (
                      <button
                        onClick={() => setShowRiley(!showRiley)}
                        className="px-4 py-2 rounded-xl font-medium transition-all text-sm"
                        style={{ 
                          background: showRiley ? 'var(--warning-orange)' : 'var(--surface-elevated)',
                          color: showRiley ? 'white' : 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <span className="mr-2">🔧</span>
                        {showRiley ? 'Hide Riley' : 'Ask Riley'}
                      </button>
                    )}

                    {/* Analyze Button */}
                    <button
                      onClick={() => handleCalculate()}
                      disabled={!validation.canAnalyze || loading}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        !validation.canAnalyze || loading
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

            {/* Riley AI Chat */}
            {showRiley && (
              <div className="max-w-4xl mx-auto">
                <RileyChat 
                  userSetup={proposedSetup}
                  analysisResults={results}
                  componentDatabase={componentDatabase}
                  bikeType={bikeType}
                />
              </div>
            )}
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

            {/* Post-Analysis Riley Prompt */}
            {!showRiley && (
              <div className="mt-8 p-6 rounded-xl" 
                   style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                         style={{ background: 'var(--warning-orange)', color: 'white' }}>
                      🔧
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Questions about your analysis?
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Riley can explain your results and suggest optimizations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRiley(true)}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{ 
                      background: 'var(--warning-orange)',
                      color: 'white'
                    }}
                  >
                    Ask Riley
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Garage Section (keeping existing functionality) */}
        <div id="garage-section" className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <svg className="w-8 h-8" style={{ color: 'var(--accent-blue)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
              </svg>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Garage</h2>
            </div>
            <p className="max-w-2xl mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
              Your saved bike configurations with compatibility analysis and AI insights.
            </p>
            
            {savedConfigs.length > 0 && (
              <button
                onClick={() => setShowSaved(!showSaved)}
                className="text-lg font-medium transition-colors"
                style={{ color: 'var(--accent-blue)' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
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
              <div className="max-w-md w-full p-6 rounded-lg border-2 shadow-lg"
                   style={{ 
                     background: 'var(--bg-primary)',
                     borderColor: 'var(--accent-blue)',
                     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                   }}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-blue)' }}>
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Empty Garage
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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

// Enhanced Garage Card Component with compatibility display
const GarageCard = ({ config, onLoad, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoadConfig = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      await onLoad(config);
      
      // Show success feedback
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm bg-green-500 text-white';
      toast.textContent = `✅ Loaded "${config.name}" successfully!`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (window.confirm(`Are you sure you want to delete "${config.name}"?`)) {
      try {
        await onDelete(config.id);
      } catch (error) {
        console.error('Error deleting config:', error);
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

      {/* Compatibility Status */}
      {config.compatibilityResults && (
        <div className="mb-4">
          <CompatibilityDisplay 
            compatibilityResults={config.compatibilityResults}
            className="text-xs"
          />
        </div>
      )}

      {/* Configuration Details */}
      <div className="space-y-3 mb-4">
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
            : 'hover:opacity-90'
        } text-white`}
        style={{ background: isLoading ? '#9CA3AF' : 'var(--accent-blue)' }}
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