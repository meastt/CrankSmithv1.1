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
      bikeType: crankset.bikeType,
      recommended: crankset.recommended,
      popular: crankset.popular
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
      bikeType: cassette.bikeType,
      recommended: cassette.recommended,
      popular: cassette.popular
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
      <div className="card dropdown-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl">
              {Icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>
            </div>
          </div>
          {badge && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColor || 'bg-blue-500'}`}>
              {badge}
            </div>
          )}
        </div>
        <div className="text-center py-12">
          <div className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">
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
      <div className="card dropdown-container">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-neutral-600 dark:text-neutral-400 font-medium">Loading components...</span>
        </div>
      </div>
    );
  }

  // Show error state if there was an error loading components
  if (error) {
    return (
      <div className="card dropdown-container">
        <div className="flex items-center justify-center py-12">
          <span className="text-red-500 font-medium">Error loading components: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card dropdown-container">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
            {Icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              {subtitle}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${badgeColor || 'bg-blue-500'}`}>
          {badge}
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Wheel Size Selection */}
        <div>
          <label className="block text-sm font-bold mb-4 text-neutral-900 dark:text-white">
            Wheel Size
          </label>
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
          <label className="block text-sm font-bold mb-4 text-neutral-900 dark:text-white">
            Tire Width
          </label>
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
          <label className="block text-sm font-bold mb-4 text-neutral-900 dark:text-white">
            Crankset
          </label>
          <div className="relative">
            <SearchableDropdown
              options={cranksetOptions}
              value={setup.crankset?.id || ''}
              onChange={handleCranksetChange}
              placeholder="Search cranksets..."
            />
          </div>
        </div>

        {/* Cassette with Visual Icons */}
        <div>
          <label className="block text-sm font-bold mb-4 text-neutral-900 dark:text-white">
            Cassette
          </label>
          <div className="relative">
            <SearchableDropdown
              options={cassetteOptions}
              value={setup.cassette?.id || ''}
              onChange={handleCassetteChange}
              placeholder="Search cassettes..."
            />
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-racing-red/0 via-racing-red/0 to-racing-red/0 group-hover:from-racing-red/5 group-hover:via-racing-red/10 group-hover:to-racing-red/5 transition-all duration-500 rounded-xl" />
    </div>
  );
});

// Add display name for debugging
GearSelectorPanel.displayName = 'GearSelectorPanel';

export default GearSelectorPanel;

 