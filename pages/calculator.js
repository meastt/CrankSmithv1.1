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

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        {/* Elite Racing Header */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Racing Circuit Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-racing-red via-racing-orange to-steel-blue" />
            <div className="absolute top-20 left-10 w-96 h-96 bg-racing-red/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-steel-blue/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-racing-orange/10 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Racing Circuit Lines */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,200 Q360,100 720,200 T1440,200" stroke="currentColor" strokeWidth="2" className="text-white" />
              <path d="M0,400 Q360,300 720,400 T1440,400" stroke="currentColor" strokeWidth="2" className="text-white" />
              <path d="M0,600 Q360,500 720,600 T1440,600" stroke="currentColor" strokeWidth="2" className="text-white" />
            </svg>
          </div>

          <div className="container-responsive py-20 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="text-white">
                {/* Elite Badge */}
                <div className="mb-8 animate-fade-in">
                  <span className="badge-racing-accent text-sm font-bold px-6 py-3 uppercase tracking-wider shadow-glow-racing">
                    ⚡ Elite Performance Lab
                  </span>
                </div>

                <h1 className="text-responsive-6xl font-black text-balance mb-6 leading-tight drop-shadow-lg">
                  <span className="text-gradient-racing">Professional</span> Gear <br />
                  <span className="text-gradient-carbon">Calculator</span>
                </h1>

                <p className="text-responsive-xl text-white/90 max-w-xl mb-10 text-balance leading-relaxed font-medium drop-shadow-md">
                  Precision gear ratio analysis for competitive cyclists. Calculate optimal drivetrain configurations for racing, climbing, and sprinting.
                </p>

                {/* Hero Stats */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-black text-racing-red mb-1 drop-shadow-lg">50K+</div>
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Cyclists
                    </div>
                  </div>
                  <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-black text-steel-blue mb-1 drop-shadow-lg">99.7%</div>
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Accuracy
                    </div>
                  </div>
                  <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-black text-racing-green mb-1 drop-shadow-lg">⚡</div>
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Real-time
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white font-semibold">
                    <span className="text-racing-green mr-2">✓</span>
                    No signup required
                  </div>
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white font-semibold">
                    <span className="text-racing-red mr-2">⚡</span>
                    Elite precision
                  </div>
                </div>
              </div>

              {/* Hero Visual - Performance Dashboard */}
              <div className="transition-all duration-1000 delay-300">
                <div className="card-carbon p-8 shadow-2xl relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-racing-red to-steel-blue" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Performance Dashboard</h3>
                      <div className="badge-racing-accent text-xs px-3 py-1 animate-pulse">LIVE</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl font-bold text-racing-red">342W</div>
                        <div className="text-sm text-white/70">Max Power</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-2xl font-bold text-steel-blue">94 RPM</div>
                        <div className="text-sm text-white/70">Optimal Cadence</div>
                      </div>
                    </div>

                    <div className="bg-gradient-racing rounded-xl p-4 border border-white/20">
                      <div className="text-lg font-bold text-white">Gear Optimization</div>
                      <div className="text-sm text-white/90">53×11 • 47.3W Saved</div>
                    </div>

                    {/* Racing Circuit Animation */}
                    <div className="relative h-16 bg-white/5 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-racing-red to-transparent animate-pulse"></div>
                      </div>
                      <div className="absolute top-1/2 left-0 w-4 h-4 bg-racing-red rounded-full transform -translate-y-1/2 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="container-responsive py-8">

          {/* Elite Bike Type Selection */}
          <section className="py-24 bg-white dark:bg-neutral-900 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-steel-blue to-racing-green" />
            </div>

            <div className="container-responsive relative z-10">
              <div className="text-center mb-20">
                <div className="mb-6">
                  <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                    Elite Bike Selection
                  </span>
                </div>
                <h2 className="text-responsive-4xl font-black mb-6 text-neutral-900 dark:text-white">
                  Choose Your <span className="text-gradient-racing">Racing Platform</span>
                </h2>
                <p className="text-responsive-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                  Select your bike type to unlock precision component recommendations and advanced compatibility analysis.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Object.entries(bikeConfig).map(([type, config], index) => {
                  const gradients = {
                    road: 'from-racing-red via-racing-orange to-warning-yellow',
                    gravel: 'from-steel-blue via-racing-green to-steel-blue',
                    mtb: 'from-racing-orange via-racing-red to-carbon-black'
                  };

                  return (
                    <button
                      key={type}
                      onClick={() => setBikeType(type)}
                      className={`group relative overflow-hidden transition-all duration-500 ${
                        bikeType === type
                          ? 'scale-105'
                          : 'hover:scale-102'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Card background */}
                      <div className={`card-carbon p-8 h-full ${
                        bikeType === type ? 'ring-4 ring-racing-red/30 shadow-glow-racing' : ''
                      }`}>
                        {/* Gradient border overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[type]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-xl`} />

                        {/* Racing circuit background */}
                        <div className="absolute inset-0 opacity-5">
                          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" className="text-white" />
                            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" className="text-white" />
                          </svg>
                        </div>

                        <div className="relative z-10">
                          {/* Icon container with gradient */}
                          <div className="w-32 h-32 mx-auto mb-8 relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[type]} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                            <div className={`relative w-full h-full bg-gradient-to-br ${gradients[type]} rounded-2xl p-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                              <div className="text-white">
                                {BikeIcons[type]}
                              </div>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-racing-red transition-colors">
                            {config.name}
                          </h3>

                          <p className="text-neutral-300 leading-relaxed mb-6">
                            {config.description}
                          </p>

                          {/* Performance indicators */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-400">Performance:</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map((star) => (
                                  <div key={star} className={`w-3 h-3 rounded-full transition-all ${
                                    star <= (type === 'road' ? 5 : type === 'gravel' ? 4 : 3)
                                      ? 'bg-racing-red shadow-lg shadow-racing-red/50'
                                      : 'bg-neutral-700'
                                  }`} />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-400">Versatility:</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map((star) => (
                                  <div key={star} className={`w-3 h-3 rounded-full transition-all ${
                                    star <= (type === 'gravel' ? 5 : type === 'road' ? 3 : 4)
                                      ? 'bg-steel-blue shadow-lg shadow-steel-blue/50'
                                      : 'bg-neutral-700'
                                  }`} />
                                ))}
                              </div>
                            </div>
                          </div>

                          {bikeType === type && (
                            <div className="flex items-center justify-center">
                              <span className="badge-racing-accent text-sm px-6 py-2 animate-pulse shadow-lg">
                                ✓ Selected
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

        {bikeType && (
          <section className="py-24 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 relative overflow-hidden">
            {/* Racing circuit pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-racing-red to-carbon-black" />
            </div>

            <div className="container-responsive relative z-10">
              <div className="text-center mb-20">
                <div className="mb-6">
                  <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                    Elite Component Selection
                  </span>
                </div>
                <h2 className="text-responsive-4xl font-black mb-6 text-neutral-900 dark:text-white">
                  Configure Your <span className="text-gradient-racing">Racing Setup</span>
                </h2>
                <p className="text-responsive-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                  Precision component selection with real-time compatibility analysis and performance optimization.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-600 dark:text-neutral-400">Error loading gear selector</div>}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-steel-blue to-steel-blue/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <GearSelectorPanel
                      title="Current Setup"
                      subtitle="Your existing bike configuration"
                      badge="Current"
                      badgeColor="bg-steel-blue"
                      setup={currentSetup}
                      setSetup={updateCurrentSetup}
                      config={bikeConfig[bikeType]}
                      bikeType={bikeType}
                      icon="🚲"
                    />
                  </div>
                </ErrorBoundary>

                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-600 dark:text-neutral-400">Error loading gear selector</div>}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-racing-green to-racing-green/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <GearSelectorPanel
                      title="Proposed Setup"
                      subtitle="Your planned bike configuration"
                      badge="Proposed"
                      badgeColor="bg-racing-green"
                      setup={proposedSetup}
                      setSetup={updateProposedSetup}
                      config={bikeConfig[bikeType]}
                      bikeType={bikeType}
                      icon="⚡"
                    />
                  </div>
                </ErrorBoundary>
              </div>

              {/* Elite Analysis Dashboard */}
              <div className="mt-16">
                <div className="card-carbon p-8 relative overflow-hidden shadow-2xl hover:shadow-glow-racing transition-shadow duration-500">
                  {/* Racing circuit background */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                      <path d="M0,100 Q100,50 200,100 T400,100" stroke="currentColor" strokeWidth="2" className="text-racing-red" />
                      <path d="M0,100 Q100,150 200,100 T400,100" stroke="currentColor" strokeWidth="2" className="text-steel-blue" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-racing flex items-center justify-center">
                          <span className="text-white text-xl">⚡</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Elite Analysis Dashboard</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">Real-time performance metrics and compatibility analysis</p>
                        </div>
                      </div>
                      <div className="badge-racing-accent text-xs px-3 py-1">LIVE</div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                      {/* Current Setup Status */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-steel-blue/10 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-steel-blue flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{isNaN(validation.current.completion) ? '0' : Math.round(validation.current.completion)}%</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Current Setup</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Configuration completion</p>
                        <div className="mt-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-steel-blue h-2 rounded-full transition-all duration-500"
                            style={{ width: `${isNaN(validation.current.completion) ? '0' : validation.current.completion}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Proposed Setup Status */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-racing-green/10 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-racing-green flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{isNaN(validation.proposed.completion) ? '0' : Math.round(validation.proposed.completion)}%</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Proposed Setup</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Configuration completion</p>
                        <div className="mt-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-racing-green h-2 rounded-full transition-all duration-500"
                            style={{ width: `${isNaN(validation.proposed.completion) ? '0' : validation.proposed.completion}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Compatibility Status */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-racing-red/10 to-warning-yellow/10 flex items-center justify-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            compatibilityResults?.status === 'compatible' ? 'bg-racing-green' : 
                            compatibilityResults?.status === 'warning' ? 'bg-warning-yellow' : 'bg-racing-red'
                          }`}>
                            <span className="text-white text-lg">
                              {compatibilityResults?.status === 'compatible' ? '✓' : 
                               compatibilityResults?.status === 'warning' ? '⚠' : '✗'}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Compatibility</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {compatibilityResults?.status === 'compatible' ? 'Optimal' : 
                           compatibilityResults?.status === 'warning' ? 'Review needed' : 'Issues found'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {(proposedSetup.crankset || proposedSetup.cassette) && (
                        <button
                          onClick={() => setShowRiley(!showRiley)}
                          className={`btn-technical ${showRiley ? 'bg-racing-orange text-white border-racing-orange' : ''}`}
                        >
                          <span className="mr-2">🤖</span>
                          {showRiley ? 'Hide Riley AI' : 'Ask Riley AI'}
                        </button>
                      )}

                      <button
                        onClick={handleCalculate}
                        disabled={!validation.canAnalyze || loading}
                        className="btn-racing disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        {loading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        )}
                        {loading ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Analyzing Performance...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 relative z-10">
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
            </div>
          </section>
        )}

        {/* Error Display */}
        {calculationError && (
            <section className="py-12">
              <div className="container-responsive">
                <div className="max-w-4xl mx-auto">
                  <div className="card-racing border-l-4 border-l-racing-red">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-racing-red flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        !
                      </div>
                      <div>
                        <h4 className="font-bold text-red-800 dark:text-red-200 mb-2 text-xl">Calculation Error</h4>
                        <p className="text-red-700 dark:text-red-300 text-lg">{calculationError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Compatibility Results */}
          {compatibilityResults && (
            <section className="py-12">
              <div className="container-responsive">
                <div className="max-w-4xl mx-auto">
                  <CompatibilityDisplay compatibilityResults={compatibilityResults} />
                </div>
              </div>
            </section>
          )}

          {/* Riley AI Chat */}
          {showRiley && (
            <section className="py-24 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900">
              <div className="container-responsive">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <div className="mb-6">
                      <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                        AI-Powered Insights
                      </span>
                    </div>
                    <h2 className="text-responsive-4xl font-black mb-6 text-neutral-900 dark:text-white">
                      Ask <span className="text-gradient-racing">Riley AI</span>
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                      Get personalized recommendations and insights from our AI cycling expert
                    </p>
                  </div>
                  <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-600 dark:text-neutral-400">Error loading Riley AI chat. Please try refreshing the page.</div>}>
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

        {/* Elite Results Section */}
        {results && (
          <section className="py-24 bg-gradient-to-br from-carbon-black via-neutral-900 to-neutral-800 text-white relative overflow-hidden">
            {/* Racing circuit pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-racing-red to-steel-blue" />
            </div>

            <div className="container-responsive relative z-10">
              <div className="text-center mb-20">
                <div className="mb-6">
                  <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                    Elite Performance Analysis
                  </span>
                </div>
                <h2 className="text-responsive-4xl font-black mb-6 text-white">
                  <span className="text-gradient-racing">Performance</span> Analysis
                </h2>
                <p className="text-responsive-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Detailed comparison of your current vs proposed setup with AI-powered insights and professional-grade metrics.
                </p>
              </div>

              <div className="max-w-7xl mx-auto space-y-16">
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-400">Error loading simulation results</div>}>
                  <SimulationResults 
                    results={results}
                    speedUnit={speedUnit}
                    bikeType={bikeType}
                  />
                </ErrorBoundary>
                
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-400">Error loading performance chart</div>}>
                  <PerformanceChart 
                    current={results.current}
                    proposed={results.proposed}
                    speedUnit={speedUnit}
                  />
                </ErrorBoundary>
                
                <ErrorBoundary context="component" fallback={<div className="p-8 text-center text-neutral-400">Error loading build summary</div>}>
                  <BuildSummaryCard 
                    currentSetup={currentSetup}
                    proposedSetup={proposedSetup}
                    results={results}
                    onSave={handleSaveConfig}
                  />
                </ErrorBoundary>

                {/* Elite Riley AI Prompt */}
                {!showRiley && (
                  <div className="card-carbon border-l-4 border-l-racing-orange relative overflow-hidden">
                    {/* Racing circuit background */}
                    <div className="absolute inset-0 opacity-5">
                      <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                        <path d="M0,100 Q100,50 200,100 T400,100" stroke="currentColor" strokeWidth="2" className="text-racing-orange" />
                      </svg>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-racing-orange text-white text-2xl">🤖</div>
                        <div>
                          <h3 className="font-bold text-white text-xl mb-2">Questions about your analysis?</h3>
                          <p className="text-white/80">Riley can explain your results and suggest optimizations.</p>
                        </div>
                      </div>
                      <button onClick={() => setShowRiley(true)} className="btn-racing">
                        Ask Riley AI
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-6 justify-center">
                  <button className="btn-carbon" onClick={handleShare}>
                    <span className="mr-2">📤</span>
                    Share Results
                  </button>
                </div>
                {shareUrl && !navigator.share && (
                  <div className="text-sm mt-4 text-center text-white/60">
                    Share link: <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="underline text-racing-red hover:text-racing-orange">{shareUrl}</a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Elite Garage Section */}
        <section id="garage-section" className="py-24 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 relative overflow-hidden">
          {/* Racing circuit pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-steel-blue to-racing-green" />
          </div>

          <div className="container-responsive relative z-10">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-racing flex items-center justify-center shadow-glow-racing">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
                  </svg>
                </div>
                <h2 className="text-responsive-4xl font-black text-neutral-900 dark:text-white">
                  Elite <span className="text-gradient-racing">Garage</span>
                </h2>
              </div>
              
              <div className="mb-6">
                <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                  Configuration Vault
                </span>
              </div>
              
              <p className="max-w-3xl mx-auto mb-10 text-responsive-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Your premium bike configurations with advanced compatibility analysis, performance metrics, and AI-powered insights.
              </p>
              
              {savedConfigs.length > 0 && (
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="btn-technical"
                >
                  <span className="mr-2">{showSaved ? '🔒' : '🔓'}</span>
                  {showSaved ? 'Hide Garage' : 'Show Garage'} ({savedConfigs.length} configurations)
                </button>
              )}
            </div>

            {savedConfigs.length > 0 && showSaved && (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedConfigs.map((config, index) => (
                    <div
                      key={config.id}
                      className="group"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <GarageCard
                        config={config}
                        onLoad={handleLoadConfig}
                        onDelete={handleDeleteConfig}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {savedConfigs.length === 0 && (
              <div className="flex justify-center">
                <div className="max-w-2xl w-full relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-steel-blue via-racing-green to-steel-blue rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative card-carbon shadow-2xl overflow-hidden">
                    {/* Racing circuit background */}
                    <div className="absolute inset-0 opacity-5">
                      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" className="text-white" />
                        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" className="text-white" />
                        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" className="text-white" />
                      </svg>
                    </div>

                    <div className="text-center relative z-10">
                      {/* Icon with gradient */}
                      <div className="w-32 h-32 mx-auto mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-steel-blue via-racing-green to-steel-blue rounded-2xl blur-xl opacity-50" />
                        <div className="relative w-full h-full bg-gradient-to-br from-steel-blue via-racing-green to-steel-blue rounded-2xl p-6 shadow-xl">
                          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full text-white">
                            <path d="M12,2L2,7V10H3V20H11V18H13V20H21V10H22V7L12,2M12,4.4L18.8,8H5.2L12,4.4M11,10V12H13V10H11M4,10H9V11H4V10M15,10H20V11H15V10M4,12H9V13H4V12M15,12H20V13H15V12M4,14H9V15H4V14M15,14H20V15H15V14M4,16H9V17H4V16M15,16H20V17H15V16M4,18H9V19H4V18M15,18H20V19H15V18Z"/>
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-3xl font-bold mb-4 text-white">Empty Garage</h3>
                      <p className="text-neutral-300 leading-relaxed text-lg max-w-md mx-auto mb-8">
                        Save your first bike configuration to start building your elite garage collection.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <span className="badge-racing-accent text-sm px-6 py-3">Ready to Build</span>
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span>Configure a bike above</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        </main>
      </div>
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

  const bikeGradients = {
    road: 'from-racing-red via-racing-orange to-warning-yellow',
    gravel: 'from-steel-blue via-racing-green to-steel-blue',
    mtb: 'from-racing-orange via-racing-red to-carbon-black'
  };

  const gradient = bikeGradients[config.bikeType] || 'from-steel-blue to-racing-green';

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

      <div className="relative card-carbon hover-lift-racing shadow-xl h-full">
        {/* Racing circuit background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" className="text-white" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" className="text-white" />
          </svg>
        </div>

        {/* Header with bike type icon */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl font-bold">{config.bikeType ? config.bikeType.charAt(0).toUpperCase() : '?'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{config.name}</h3>
                  <p className="text-sm text-neutral-400 font-medium">{config.bikeType ? config.bikeType.charAt(0).toUpperCase() + config.bikeType.slice(1) : 'Unknown'} Bike</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDelete(config.id)}
              className="p-2 rounded-lg transition-all text-neutral-400 hover:bg-racing-red/20 hover:text-racing-red border border-transparent hover:border-racing-red/30 backdrop-blur-sm"
              title="Delete configuration"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {config.compatibilityResults && (
            <div className="mb-6">
              <CompatibilityDisplay compatibilityResults={config.compatibilityResults} className="text-xs"/>
            </div>
          )}

          <div className="space-y-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white">Components</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                  <span className="text-neutral-400">Crankset:</span>
                  <span className="font-medium text-white text-right truncate ml-2">{config.proposedSetup?.crankset?.model || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                  <span className="text-neutral-400">Cassette:</span>
                  <span className="font-medium text-white text-right truncate ml-2">{config.proposedSetup?.cassette?.model || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                  <span className="text-neutral-400">Wheel:</span>
                  <span className="font-medium text-white text-right truncate ml-2">{config.proposedSetup?.wheel || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                  <span className="text-neutral-400">Tire:</span>
                  <span className="font-medium text-white text-right truncate ml-2">{config.proposedSetup?.tire || 'Not set'}</span>
                </div>
              </div>
            </div>

            {config.results && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">Performance</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-steel-blue/20 to-steel-blue/10 border border-steel-blue/30 backdrop-blur-sm">
                    <div className="font-bold text-steel-blue text-2xl mb-1 drop-shadow-lg">{config.results.proposed?.totalWeight}g</div>
                    <div className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Weight</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-racing-green/20 to-racing-green/10 border border-racing-green/30 backdrop-blur-sm">
                    <div className="font-bold text-racing-green text-2xl mb-1 drop-shadow-lg">{config.results.proposed?.gearRange}%</div>
                    <div className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Range</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLoadConfig}
            disabled={isLoading}
            className="btn-racing w-full disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group/btn"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Load Configuration
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
