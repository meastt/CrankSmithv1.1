import React, { useCallback, useMemo } from 'react';
import SearchableDropdown from './SearchableDropdown/index.js';
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
  // Use the optimized hook for component loading (must be called before any conditional returns)
  const { cranksets, cassettes, loading, error } = useComponentDatabase(bikeType);

  // Transform components data for SearchableDropdown - memoized to prevent recalculation
  const cranksetOptions = useMemo(() => 
    cranksets?.map(crankset => ({
      id: crankset.id,
      label: `${crankset.model} ${crankset.variant}`,
      model: crankset.model,
      variant: crankset.variant,
      teeth: crankset.teeth,
      speeds: crankset.speeds,
      weight: crankset.weight,
      bikeType: crankset.bikeType
    })) || [], [cranksets]
  );

  const cassetteOptions = useMemo(() => 
    cassettes?.map(cassette => ({
      id: cassette.id,
      label: `${cassette.model} ${cassette.variant}`,
      model: cassette.model,
      variant: cassette.variant,
      teeth: cassette.teeth,
      speeds: cassette.speeds,
      weight: cassette.weight,
      bikeType: cassette.bikeType
    })) || [], [cassettes]
  );

  // Memoized event handlers to prevent unnecessary re-renders
  const handleCranksetChange = useCallback((selectedOptionId) => {
    const selectedOption = cranksetOptions.find(opt => opt.id === selectedOptionId);
    setSetup({ ...setup, crankset: selectedOption });
  }, [setup, setSetup, cranksetOptions]);

  const handleCassetteChange = useCallback((selectedOptionId) => {
    const selectedOption = cassetteOptions.find(opt => opt.id === selectedOptionId);
    setSetup({ ...setup, cassette: selectedOption });
  }, [setup, setSetup, cassetteOptions]);

  const handleWheelChange = useCallback((value) => {
    setSetup({ ...setup, wheel: value });
  }, [setup, setSetup]);

  const handleTireChange = useCallback((value) => {
    setSetup({ ...setup, tire: value });
  }, [setup, setSetup]);

  // Early return if bikeType is not set - prevents empty options rendering
  if (!bikeType || bikeType === '') {
    return (
      <div className="card group dropdown-container">
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

  // Enhanced debug logging with better context
  console.log(`🔍 GearSelectorPanel (${title}):`, {
    bikeType,
    cranksets,
    cassettes,
    cranksetsLength: cranksets?.length,
    cassettesLength: cassettes?.length,
    setup,
    config,
    loading,
    error,
    context: `Rendering for bikeType: ${bikeType}`
  });

  console.log(`🔧 Transformed options for ${title}:`, {
    cranksetOptions: cranksetOptions,
    cassetteOptions: cassetteOptions,
    cranksetOptionsLength: cranksetOptions?.length || 0,
    cassetteOptionsLength: cassetteOptions?.length || 0,
    firstCrankset: cranksetOptions[0],
    firstCassette: cassetteOptions[0]
  });



  // Show loading state if components are still loading
  if (loading) {
    return (
      <div className="card group dropdown-container">
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
      <div className="card group dropdown-container">
        <div className="flex items-center justify-center py-8">
          <span className="text-red-500">Error loading components: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card group dropdown-container">
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
            value={setup.crankset?.id || ''}
            onChange={handleCranksetChange}
            placeholder="Search cranksets..."
          />
        </div>

        {/* Cassette with Visual Icons */}
        <div>
          <label className="form-label">Cassette</label>
          <SearchableDropdown
            options={cassetteOptions}
            value={setup.cassette?.id || ''}
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

 