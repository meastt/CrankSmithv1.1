// pages/calculator.js - Enhanced calculator with Riley AI integration and compatibility checking
// CORRECTED: Replaced all inline styles with Tailwind classes, converted JS hover effects to CSS, and implemented a React-based toast notification system.
// UPDATED: Removed email verification requirements - free access for all users

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

// Enhanced compatibility display component
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

  const styles = statusStyles[status] || {
    bg: 'bg-[var(--surface-elevated)]',
    border: 'border-[var(--border-subtle)]',
    iconBg: 'bg-neutral-400',
    titleColor: 'text-[var(--text-primary)]'
  };

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
          <p className="text-sm text-[var(--text-secondary)] mb-3">{message}</p>
          
          {criticalIssues && criticalIssues.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Critical Issues:</p>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1">
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
              <ul className="text-xs text-[var(--text-secondary)] space-y-1">
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
              <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Recommendations:</p>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1">
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

// Simple localStorage functions
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
      const newConfig = { ...config, id: Date.now(), created_at: new Date().toISOString() };
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

// Toast Notification Component
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
  const [shareUrl, setShareUrl] = useState('');

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
        showToast('Error loading saved configurations');
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
      setCompatibilityResults({
        status: 'error',
        title: 'Compatibility Check Failed',
        message: 'Unable to analyze compatibility. Please check your component selections.',
        actionItems: ['Verify component selections', 'Try refreshing the page']
      });
    }
  };



  const handleCalculate = async () => {
    try {
      setCalculationError(null);
      await calculateResults();
      
      // Run compatibility check after successful calculation
      checkCompatibility();
      
      // Show Riley AI after a brief delay if calculation was successful
      setTimeout(() => {
        if (results && !calculationError) {
          setShowRiley(true);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Calculation failed:', error);
      setCalculationError(error.message || 'Calculation failed. Please check your inputs and try again.');
      showToast('Calculation failed. Please try again.');
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
        showToast('Configuration saved to garage!');
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
      showToast(`Loaded "${config.name}" successfully!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToast('Failed to load configuration.');
    }
  };

  const handleDeleteConfig = async (id) => {
    if (window.confirm(`Are you sure you want to delete this configuration?`)) {
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

  const handleShare = () => {
    const params = new URLSearchParams({
      bikeType,
      crankset: currentSetup?.crankset?.id || '',
      cassette: currentSetup?.cassette?.id || '',
      wheel: currentSetup?.wheel || '',
      tire: currentSetup?.tire || ''
    });
    const url = `${window.location.origin}/calculator?${params.toString()}`;
    setShareUrl(url);
    if (navigator.share) {
      navigator.share({
        title: 'Check out my bike setup on CrankSmith',
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
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
      <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ show: false, message: '' })} />

      <main className="main-container container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="hero-title">Compare. Calculate. Optimize.</h1>
          <p className="hero-subtitle max-w-2xl mx-auto">
            See exactly how component changes affect your bike's performance with real-world data and AI-powered insights.
          </p>
        </div>

        {/* Bike Type Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--text-primary)]">Select Your Bike Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(bikeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setBikeType(type)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  bikeType === type
                    ? 'border-[var(--accent-blue)] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--accent-blue)]/50'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 text-[var(--accent-blue)]">
                  {BikeIcons[type]}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                  {config.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {config.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {bikeType && (
          <div className="space-y-8">
            {/* Gear Selection */}
            <div className="max-w-6xl mx-auto">
              <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-[var(--text-tertiary)]">Error loading gear selector</div>}>
                <GearSelectorPanel
                  title="Current Setup"
                  subtitle="Your existing bike configuration"
                  badge="Current"
                  badgeColor="bg-[var(--accent-blue)]"
                  setup={currentSetup}
                  setSetup={updateCurrentSetup}
                  config={bikeConfig[bikeType]}
                  bikeType={bikeType}
                  icon="🚲"
                />
              </ErrorBoundary>

              <div className="mt-8">
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-[var(--text-tertiary)]">Error loading gear selector</div>}>
                  <GearSelectorPanel
                    title="Proposed Setup"
                    subtitle="Your planned bike configuration"
                    badge="Proposed"
                    badgeColor="bg-[var(--success-green)]"
                    setup={proposedSetup}
                    setSetup={updateProposedSetup}
                    config={bikeConfig[bikeType]}
                    bikeType={bikeType}
                    icon="⚡"
                  />
                </ErrorBoundary>
              </div>

              {/* Analysis Controls */}
              <div className="bg-[var(--surface-elevated)] rounded-xl p-6 border border-[var(--border-subtle)] mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
                      <span className="text-sm text-[var(--text-secondary)]">Current Setup: {isNaN(validation.current.completion) ? '0' : Math.round(validation.current.completion)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--success-green)]" />
                      <span className="text-sm text-[var(--text-secondary)]">Proposed Setup: {isNaN(validation.proposed.completion) ? '0' : Math.round(validation.proposed.completion)}%</span>
                    </div>
                    {compatibilityResults && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${compatibilityResults.status === 'compatible' ? 'bg-green-500' : compatibilityResults.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-[var(--text-secondary)]">
                          Compatibility: {compatibilityResults.status === 'compatible' ? 'Good' : compatibilityResults.status === 'warning' ? 'Review needed' : 'Issues found'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {(proposedSetup.crankset || proposedSetup.cassette) && (
                      <button
                        onClick={() => setShowRiley(!showRiley)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all text-sm border border-[var(--border-subtle)] ${showRiley ? 'bg-[var(--warning-orange)] text-white' : 'bg-[var(--surface-elevated)] text-[var(--text-primary)]'}`}
                      >
                        <span className="mr-2">🔧</span>
                        {showRiley ? 'Hide Riley' : 'Ask Riley'}
                      </button>
                    )}

                    <button
                      onClick={handleCalculate}
                      disabled={!validation.canAnalyze || loading}
                      className="px-6 py-3 rounded-xl font-medium transition-all bg-[var(--accent-blue)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90"
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

                {/* Error Display */}
                {calculationError && (
                  <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        !
                      </div>
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">Calculation Error</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">{calculationError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compatibility Results */}
                {compatibilityResults && (
                  <div className="mt-4">
                    <CompatibilityDisplay compatibilityResults={compatibilityResults} />
                  </div>
                )}
              </div>
            </div>

            {/* Riley AI Chat */}
            {showRiley && (
              <div className="max-w-4xl mx-auto">
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>Error loading Riley AI chat. Please try refreshing the page.</div>}>
                  <RileyChat 
                    userSetup={proposedSetup}
                    analysisResults={results}
                    componentDatabase={componentDatabase}
                    bikeType={bikeType}
                    compatibilityResults={compatibilityResults}
                  />
                </ErrorBoundary>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="max-w-4xl mx-auto mt-12">
            <ErrorBoundary context="component" fallback={<div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>Error loading simulation results</div>}>
              <SimulationResults 
                results={results}
                speedUnit={speedUnit}
                bikeType={bikeType}
              />
            </ErrorBoundary>
            
            <ErrorBoundary context="component" fallback={<div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>Error loading performance chart</div>}>
              <PerformanceChart 
                current={results.current}
                proposed={results.proposed}
                speedUnit={speedUnit}
              />
            </ErrorBoundary>
            
            <ErrorBoundary context="component" fallback={<div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>Error loading build summary</div>}>
              <BuildSummaryCard 
                currentSetup={currentSetup}
                proposedSetup={proposedSetup}
                results={results}
                onSave={handleSaveConfig}
              />
            </ErrorBoundary>

            {/* Riley AI Prompt */}
            {!showRiley && (
              <div className="mt-8 p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--warning-orange)] text-white">🔧</div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Questions about your analysis?</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Riley can explain your results and suggest optimizations.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowRiley(true)} className="px-4 py-2 rounded-lg font-medium transition-all bg-[var(--warning-orange)] text-white">
                    Ask Riley
                  </button>
                </div>
              </div>
            )}
            <button className="btn-secondary mt-2" onClick={handleShare}>Share</button>
            {shareUrl && !navigator.share && (
              <div className="text-xs mt-1 text-blue-600">Share link: <a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a></div>
            )}
          </div>
        )}

        {/* Garage Section */}
        <div id="garage-section" className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <svg className="w-8 h-8 text-[var(--accent-blue)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
              </svg>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">My Garage</h2>
            </div>
            <p className="max-w-2xl mx-auto mb-6 text-[var(--text-secondary)]">
              Your saved bike configurations with compatibility analysis and AI insights.
            </p>
            {savedConfigs.length > 0 && (
              <button
                onClick={() => setShowSaved(!showSaved)}
                className="text-lg font-medium transition-colors text-[var(--accent-blue)] hover:opacity-80"
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
              <div className="max-w-md w-full p-6 rounded-lg border-2 shadow-lg bg-[var(--bg-primary)] border-[var(--accent-blue)] shadow-blue-500/10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-[var(--accent-blue)]">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Empty Garage</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    Save your first bike configuration to start building your garage.
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

const GarageCard = ({ config, onLoad, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadConfig = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onLoad(config);
    setIsLoading(false);
  };

  return (
    <div className="garage-card p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">{config.name}</h3>
          <p className="text-sm text-[var(--text-tertiary)]">{config.bikeType ? config.bikeType.charAt(0).toUpperCase() + config.bikeType.slice(1) : 'Unknown'} Bike</p>
        </div>
        <button 
          onClick={() => onDelete(config.id)} 
          className="p-2 rounded-lg transition-colors text-[var(--text-tertiary)] hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600" 
          title="Delete configuration"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {config.compatibilityResults && (
        <div className="mb-4">
          <CompatibilityDisplay compatibilityResults={config.compatibilityResults} className="text-xs"/>
        </div>
      )}
      
      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Components</h4>
          <div className="space-y-1 text-sm text-[var(--text-tertiary)]">
            <div className="flex justify-between">
              <span>Crankset:</span>
              <span className="font-medium text-[var(--text-secondary)]">{config.proposedSetup?.crankset?.model || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cassette:</span>
              <span className="font-medium text-[var(--text-secondary)]">{config.proposedSetup?.cassette?.model || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Wheel:</span>
              <span className="font-medium text-[var(--text-secondary)]">{config.proposedSetup?.wheel || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tire:</span>
              <span className="font-medium text-[var(--text-secondary)]">{config.proposedSetup?.tire || 'Not set'}</span>
            </div>
          </div>
        </div>
        
        {config.results && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Performance</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center p-2 rounded bg-[var(--surface-elevated)]">
                <div className="font-semibold text-[var(--text-primary)]">{config.results.proposed?.totalWeight}g</div>
                <div className="text-xs text-[var(--text-tertiary)]">Weight</div>
              </div>
              <div className="text-center p-2 rounded bg-[var(--surface-elevated)]">
                <div className="font-semibold text-[var(--text-primary)]">{config.results.proposed?.gearRange}%</div>
                <div className="text-xs text-[var(--text-tertiary)]">Range</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleLoadConfig} 
        disabled={isLoading} 
        className="garage-load-btn w-full py-3 rounded font-semibold transition-all text-white bg-[var(--accent-blue)] disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:opacity-90"
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
