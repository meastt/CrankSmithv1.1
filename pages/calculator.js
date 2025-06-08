import { useState, useEffect } from 'react';
import Head from 'next/head';
import Calculator from '../components/Calculator';
import Results from '../components/Results';
import { compareSetups } from '../lib/calculations';
import { bikeConfig, getComponentsForBikeType, componentDatabase } from '../lib/components';

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
  
  saveConfig: (config) => {
    try {
      const existing = localStorageDB.getConfigs().data;
      const newConfig = {
        ...config,
        id: Date.now(), // Simple ID generation
        created_at: new Date().toISOString()
      };
      const updated = [...existing, newConfig];
      localStorage.setItem('cranksmith_configs', JSON.stringify(updated));
      return { error: null };
    } catch (error) {
      console.error('Error saving config:', error);
      return { error: 'Failed to save configuration' };
    }
  },
  
  deleteConfig: (id) => {
    try {
      const existing = localStorageDB.getConfigs().data;
      const updated = existing.filter(config => config.id !== id);
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
    const crankset = setup.crankset && setup.crankset.chainrings && Array.isArray(setup.crankset.chainrings) 
      ? `${setup.crankset.chainrings.join('/')}T` 
      : 'N/A';
    const cassette = setup.cassette && setup.cassette.range 
      ? `${setup.cassette.range.min}-${setup.cassette.range.max}T` 
      : 'N/A';
    return { crankset, cassette };
  };

  const currentSpecs = formatSpecs(config.current_setup);
  const proposedSpecs = formatSpecs(config.proposed_setup);

  return (
    <div className="bg-[--color-surface] border border-[--color-border] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[--color-accent]/30">
      {/* Top Half - Header Info */}
      <div className="p-4 border-b border-[--color-border]/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 text-[--color-accent]">
              {BikeIcons[config.bike_type] || BikeIcons.road}
            </div>
            <div>
              <h3 className="font-semibold text-[--color-text-primary] text-lg leading-tight">
                {config.name}
              </h3>
              <p className="text-[--color-text-secondary] text-sm">
                {bikeTypeDisplay[config.bike_type] || 'Road'} • {new Date(config.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Delete Button */}
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

      {/* Bottom Half - Specs & Action */}
      <div className="p-4">
        {/* Specs Comparison */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[--color-text-secondary] mb-1">Current Setup</p>
              <p className="text-[--color-text-primary] font-mono">
                {currentSpecs.crankset} → {currentSpecs.cassette}
              </p>
            </div>
            <div>
              <p className="text-[--color-text-secondary] mb-1">Proposed Setup</p>
              <p className="text-[--color-text-primary] font-mono">
                {proposedSpecs.crankset} → {proposedSpecs.cassette}
              </p>
            </div>
          </div>
          
          {/* Performance Highlight */}
          {config.results && (
            <div className="mt-3 p-2 bg-[--color-surface] rounded border border-[--color-border]/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[--color-text-secondary]">Weight Change:</span>
                <span className={`font-semibold ${config.results.weightChange > 0 ? 'text-[--color-accent]' : 'text-green-500'}`}>
                  {config.results.weightChange > 0 ? '+' : ''}{config.results.weightChange}g
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Load Button */}
        <button
          onClick={() => onLoad(config)}
          className="w-full py-3 bg-[--color-accent] hover:opacity-90 text-black font-semibold rounded transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Load Configuration
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[--color-surface] border border-[--color-border] rounded-lg p-6 max-w-sm w-full">
            <h4 className="text-[--color-text-primary] font-semibold mb-2">Delete Configuration?</h4>
            <p className="text-[--color-text-secondary] text-sm mb-4">
              Are you sure you want to delete "{config.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-[--color-surface] hover:bg-[--color-border] text-[--color-text-primary] rounded transition-colors border border-[--color-border]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(config.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 px-4 bg-[--color-accent] hover:opacity-90 text-black rounded transition-colors"
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
  // State for bike type and setups
  const [bikeType, setBikeType] = useState('');
  const [currentSetup, setCurrentSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null,
  });
  const [proposedSetup, setProposedSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved configurations on mount
  useEffect(() => {
    loadSavedConfigs();
  }, []);

  // Update available components when bike type changes
  useEffect(() => {
    console.log('🔍 bikeType useEffect triggered:', bikeType);
    
    if (bikeType && bikeConfig[bikeType]) {
      console.log('📝 Setting up defaults for:', bikeType);
      const defaults = bikeConfig[bikeType].defaultSetup;
      const defaultCrankset = componentDatabase.cranksets.find((c) => c.id === defaults.crankset);
      const defaultCassette = componentDatabase.cassettes.find((c) => c.id === defaults.cassette);

      console.log('🔧 Found default components:', { defaultCrankset, defaultCassette });

      setCurrentSetup({
        wheel: defaults.wheel,
        tire: defaults.tire.toString(),
        crankset: defaultCrankset,
        cassette: defaultCassette,
      });
      setProposedSetup({
        wheel: defaults.wheel,
        tire: defaults.tire.toString(),
        crankset: defaultCrankset,
        cassette: defaultCassette,
      });
      
      console.log('✅ Setup states updated');
    }
  }, [bikeType]);

  // Fetch saved configurations from localStorage
  const loadSavedConfigs = () => {
    const { data } = localStorageDB.getConfigs();
    setSavedConfigs(data || []);
  };

  // Handle calculation of setups
  const handleCalculate = async (speedUnit = 'MPH') => {
    // Validate inputs
    if (
      !bikeType ||
      !currentSetup.crankset ||
      !currentSetup.cassette ||
      !proposedSetup.crankset ||
      !proposedSetup.cassette
    ) {
      alert('Please complete all fields before calculating');
      return;
    }

    setLoading(true);

    try {
      // Perform calculations with speed unit
      const comparison = compareSetups(currentSetup, proposedSetup, speedUnit);
      setResults(comparison);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating results. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Save configuration to localStorage
  const handleSaveConfig = () => {
    if (!results) return;

    const name = prompt('Enter a name for this configuration:');
    if (!name) return;

    const config = {
      name,
      bike_type: bikeType,
      current_setup: currentSetup,
      proposed_setup: proposedSetup,
      results: {
        weightChange: results.comparison.weightChange,
        currentMetrics: results.current.metrics,
        proposedMetrics: results.proposed.metrics,
      },
    };

    const { error } = localStorageDB.saveConfig(config);
    if (error) {
      alert('Error saving configuration');
    } else {
      alert('Configuration saved successfully!');
      loadSavedConfigs();
    }
  };

  // Load a saved configuration
  const handleLoadConfig = (config) => {
    setBikeType(config.bike_type);
    setCurrentSetup(config.current_setup);
    setProposedSetup(config.proposed_setup);
    setResults(null);
    setShowSaved(false);
  };

  // Delete a saved configuration
  const handleDeleteConfig = (id) => {
    const { error } = localStorageDB.deleteConfig(id);
    if (error) {
      alert('Error deleting configuration');
    } else {
      loadSavedConfigs();
    }
  };

  return (
    <main className="main-container container mx-auto px-4 py-12 max-w-7xl">
      {/* Clean Hero Section */}
      <div className="text-center mb-12">
        <h1 className="hero-title hero-title-fire">Compare. Calculate. Optimize.</h1>
        <p className="hero-subtitle max-w-2xl mx-auto">
          See exactly how component changes affect your bike's performance with real-world data.
        </p>
        
        {/* New Analysis Button - only show if there's existing data */}
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
              background: 'var(--surface-primary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--surface-elevated)';
              e.target.style.borderColor = 'var(--accent-blue)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--surface-primary)';
              e.target.style.borderColor = 'var(--border-subtle)';
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

      {/* Quick Start Guide - only show when no bike type selected */}
      {!bikeType && !results && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center quick-start-icon-fire">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                How It Works
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Compare any bike components in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
                     style={{ background: 'var(--surface-elevated)', color: 'var(--accent-blue)' }}>
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Choose Your Bike
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Select road, gravel, or mountain bike to see compatible components
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
                     style={{ background: 'var(--surface-elevated)', color: 'var(--accent-blue)' }}>
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Pick Components
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Choose your current setup and the upgrade you're considering
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
                     style={{ background: 'var(--surface-elevated)', color: 'var(--accent-blue)' }}>
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  See Results
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Get clear speed, weight, and performance comparisons
                </p>
              </div>
            </div>

            <div className="border-t pt-8" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg text-center"
                     style={{ background: 'var(--surface-elevated)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    🚴‍♂️ I Know My Components
                  </h4>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    Ready to compare specific parts? Jump right in!
                  </p>
                  <button 
                    onClick={() => document.querySelector('select').focus()}
                    className="btn-primary w-full"
                  >
                    Start Comparing
                  </button>
                </div>

                <div className="p-4 rounded-lg text-center"
                     style={{ background: 'var(--surface-elevated)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    🤔 Need Guidance?
                  </h4>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    Not sure what to upgrade? Let Riley guide you!
                  </p>
                  <button 
                    onClick={() => {
                      // Set bike type to enable the interface
                      setBikeType('road');
                      // REMOVED: No more automatic scrolling that was causing page jump
                      // Show a helpful message without scrolling
                      setTimeout(() => {
                        alert('Great! Now you can use the "Ask Riley" button that appears after you analyze any setup. Try selecting some components first, then click "Analyze Performance" to see Riley!');
                      }, 1000);
                    }}
                    className="w-full px-6 py-3 rounded-xl font-medium transition-all"
                    style={{ 
                      background: 'var(--surface-primary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--surface-elevated)';
                      e.target.style.borderColor = 'var(--accent-blue)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--surface-primary)';
                      e.target.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    🔧 Ask Riley for Help
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Showcase - Always visible when no bike type selected */}
      {!bikeType && !results && (
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              See What CrankSmith Can Do
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Real examples of how component changes affect your ride
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Speed Comparison */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--accent-blue)', color: 'white' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Speed Analysis
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
                  <span style={{ color: 'var(--text-secondary)' }}>31.2 mph</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
                  <span style={{ color: 'var(--text-secondary)' }}>33.1 mph</span>
                </div>
                <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--accent-performance)' }}>
                    +1.9 mph
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                See exactly how upgrades affect your top speed
              </p>
            </div>

            {/* Weight Savings */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--accent-performance)', color: 'white' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Weight Tracking
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
                  <span style={{ color: 'var(--text-secondary)' }}>1,247g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
                  <span style={{ color: 'var(--text-secondary)' }}>1,185g</span>
                </div>
                <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xl font-bold" style={{ color: 'var(--accent-performance)' }}>
                    -62g
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Track weight savings down to the gram
              </p>
            </div>

            {/* AI Guidance */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center quick-start-icon-fire">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Expert Advice
              </h3>
              <div className="p-3 rounded-lg mb-4" style={{ background: 'var(--surface-elevated)' }}>
                <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                  "That 11-34T cassette will give you much easier climbing gears. Perfect for steep hills!"
                </p>
                <div className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  - Riley, AI Mechanic
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Get personalized recommendations from our AI expert
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <button 
              onClick={() => {
                document.querySelector('select').focus();
                window.scrollTo({ 
                  top: document.querySelector('.calculator-section')?.offsetTop || window.innerHeight, 
                  behavior: 'smooth' 
                });
              }}
              className="btn-primary text-lg px-8"
            >
              Try It Now - It's Free
            </button>
          </div>
        </div>
      )}

      {/* Calculator Component */}
      <div className="calculator-section">
        <Calculator
        bikeType={bikeType}
        setBikeType={setBikeType}
        currentSetup={currentSetup}
        setCurrentSetup={setCurrentSetup}
        proposedSetup={proposedSetup}
        setProposedSetup={setProposedSetup}
        onCalculate={handleCalculate}
        loading={loading}
      />

      {/* Results Component */}
      {results && (
        <Results
          results={results}
          onSave={handleSaveConfig}
          bikeType={bikeType}
          currentSetup={currentSetup}
          proposedSetup={proposedSetup}
          componentDatabase={componentDatabase}
        />
      )}

      {/* Garage Section */}
      <div id="garage-section" className="mt-16">
        {/* Garage Header */}
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
          
          {/* Toggle Button - only show if there are saved configs */}
          {savedConfigs.length > 0 && (
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="text-[--color-accent] hover:opacity-80 transition-colors text-lg font-medium"
            >
              {showSaved ? 'Hide Garage' : 'Show Garage'} ({savedConfigs.length} configurations)
            </button>
          )}
        </div>

        {/* Garage Grid - when there are saved configs */}
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

        {/* Empty Garage State - sleek card */}
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
      </div>
    </main>
  );
}