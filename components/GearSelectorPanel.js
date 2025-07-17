import React, { useCallback, useMemo } from 'react';
import SearchableDropdown from './SearchableDropdown';
import { useComponentDatabase } from '../hooks/useComponentDatabase';

const GearSelectorPanel = React.memo(({ 
  title,
  subtitle,
  badge,
  badgeColor,
  setup,
  setSetup,
  config,
  bikeType,
  icon: Icon 
}) => {
  // Early return if bikeType is not set - prevents empty options rendering
  if (!bikeType || bikeType === '') {
    return (
      <div className="card group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              {Icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
            </div>
          </div>
          {badge && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor || 'badge'}`}>
              {badge}
            </div>
          )}
        </div>
        <div className="text-center py-8">
          <div className="text-[var(--text-secondary)] text-sm">
            Please select a bike type to view components
          </div>
        </div>
      </div>
    );
  }

  // Use the optimized hook for component loading
  const { components, loading, error } = useComponentDatabase(bikeType);

  // Enhanced debug logging with better context
  // console.log(`🔍 GearSelectorPanel (${title}):`, {
  //   bikeType,
  //   components,
  //   cranksets: components?.cranksets,
  //   cassettes: components?.cassettes,
  //   cranksetsLength: components?.cranksets?.length,
  //   cassettesLength: components?.cassettes?.length,
  //   setup,
  //   config,
  //   loading,
  //   error,
  //   context: `Rendering for bikeType: ${bikeType}`
  // });

  // Transform components data for SearchableDropdown - memoized to prevent recalculation
  const cranksetOptions = useMemo(() => 
    components?.cranksets?.map(crankset => ({
      id: crankset.id,
      label: `${crankset.model} ${crankset.variant}`,
      model: crankset.model,
      variant: crankset.variant,
      teeth: crankset.teeth,
      speeds: crankset.speeds,
      weight: crankset.weight,
      bikeType: crankset.bikeType
    })) || [], [components?.cranksets]
  );

  const cassetteOptions = useMemo(() => 
    components?.cassettes?.map(cassette => ({
      id: cassette.id,
      label: `${cassette.model} ${cassette.variant}`,
      model: cassette.model,
      variant: cassette.variant,
      teeth: cassette.teeth,
      speeds: cassette.speeds,
      weight: cassette.weight,
      bikeType: cassette.bikeType
    })) || [], [components?.cassettes]
  );

  // console.log(`🔧 Transformed options for ${title}:`, {
  //   cranksetOptions: cranksetOptions,
  //   cassetteOptions: cassetteOptions,
  //   cranksetOptionsLength: cranksetOptions?.length || 0,
  //   cassetteOptionsLength: cassetteOptions?.length || 0,
  //   firstCrankset: cranksetOptions[0],
  //   firstCassette: cassetteOptions[0]
  // });

  // Memoized event handlers to prevent unnecessary re-renders
  const handleCranksetChange = useCallback((selectedOption) => {
    // console.log('🔄 Crankset selected:', selectedOption);
    // Update the setup state directly with the full component object
    setSetup({ ...setup, crankset: selectedOption });
    
    // Also call the config handler if it exists
    if (config?.onCranksetChange) {
      config.onCranksetChange(selectedOption);
    }
  }, [setup, setSetup, config]);

  const handleCassetteChange = useCallback((selectedOption) => {
    // console.log('🔄 Cassette selected:', selectedOption);
    // Update the setup state directly with the full component object
    setSetup({ ...setup, cassette: selectedOption });
    
    // Also call the config handler if it exists
    if (config?.onCassetteChange) {
      config.onCassetteChange(selectedOption);
    }
  }, [setup, setSetup, config]);

  // Memoized wheel change handler
  const handleWheelChange = useCallback((value) => {
    config.onWheelChange(value);
  }, [config]);

  // Memoized tire change handler
  const handleTireChange = useCallback((value) => {
    config.onTireChange(value);
  }, [config]);

  // Show loading state if components are still loading
  if (loading) {
    return (
      <div className="card group">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-blue)' }}></div>
          <span className="ml-3" style={{ color: 'var(--text-secondary)' }}>Loading components...</span>
        </div>
      </div>
    );
  }

  // Show error state if there was an error loading components
  if (error) {
    return (
      <div className="card group">
        <div className="flex items-center justify-center py-8">
                      <span className="text-red-600 dark:text-red-400">Error loading components: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card group">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
               style={{ 
                 background: 'var(--surface-elevated)', 
                 color: 'var(--accent-blue)' 
               }}>
            {Icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {subtitle}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ background: badgeColor }}>
          {badge}
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Wheel Size Selection */}
        <div>
          <label className="form-label">Wheel Size</label>
          <select
            value={setup.wheel}
            onChange={(e) => handleWheelChange(e.target.value)}
            className="input-field"
          >
            <option value="">Select wheel size</option>
            {config.wheelSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Tire Width */}
        <div>
          <label className="form-label">Tire Width</label>
          <select
            value={setup.tire}
            onChange={(e) => handleTireChange(e.target.value)}
            className="input-field"
          >
            <option value="">Select tire width</option>
            {config.tireWidths.map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </div>

        {/* Crankset with Visual Icons */}
        <div>
          <label className="form-label">Crankset</label>
          <SearchableDropdown
            options={cranksetOptions}
            value={setup.crankset}
            onChange={handleCranksetChange}
            placeholder="Search cranksets..."
          />
        </div>

        {/* Cassette with Visual Icons */}
        <div>
          <label className="form-label">Cassette</label>
          <SearchableDropdown
            options={cassetteOptions}
            value={setup.cassette}
            onChange={handleCassetteChange}
            placeholder="Search cassettes..."
          />
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
GearSelectorPanel.displayName = 'GearSelectorPanel';

export default GearSelectorPanel;

function ChainringIcon({ teeth }) {
  const isDouble = teeth.length === 2;
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2" 
         style={{ borderColor: 'var(--accent-blue)' }}>
      <span className="text-xs font-bold" style={{ color: 'var(--accent-blue)' }}>
        {isDouble ? `${teeth[0]}/${teeth[1]}` : teeth[0]}
      </span>
    </div>
  );
}

function CassetteIcon({ teeth }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center" 
         style={{ color: 'var(--text-tertiary)' }}>
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </div>
  );
}

// Helper functions
function formatWheelSize(size) {
  return size.replace('c', 'mm');
}

function formatTireWidth(width) {
  return `${width}mm`;
} 