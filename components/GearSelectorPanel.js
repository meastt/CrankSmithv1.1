import React from 'react';
import SearchableDropdown from './SearchableDropdown';

export default function GearSelectorPanel({ 
  title,
  subtitle,
  badge,
  badgeColor,
  setup,
  setSetup,
  config,
  components,
  icon: Icon 
}) {
  // Debug logging
  console.log(`🔍 GearSelectorPanel (${title}):`, {
    components,
    cranksets: components?.cranksets,
    cassettes: components?.cassettes,
    setup,
    config
  });

  // Transform components data for SearchableDropdown
  const cranksetOptions = components?.cranksets?.map(crankset => ({
    id: crankset.id,
    label: `${crankset.model} ${crankset.variant}`,
    model: crankset.model,
    variant: crankset.variant,
    teeth: crankset.teeth,
    speeds: crankset.speeds,
    weight: crankset.weight,
    bikeType: crankset.bikeType
  })) || [];

  const cassetteOptions = components?.cassettes?.map(cassette => ({
    id: cassette.id,
    label: `${cassette.model} ${cassette.variant}`,
    model: cassette.model,
    variant: cassette.variant,
    teeth: cassette.teeth,
    speeds: cassette.speeds,
    weight: cassette.weight,
    bikeType: cassette.bikeType
  })) || [];

  console.log(`🔧 Transformed options for ${title}:`, {
    cranksetOptions,
    cassetteOptions
  });

  const handleCranksetChange = (selectedOption) => {
    console.log('🔄 Crankset selected:', selectedOption);
    if (config?.onCranksetChange) {
      config.onCranksetChange(selectedOption);
    }
  };

  const handleCassetteChange = (selectedOption) => {
    console.log('🔄 Cassette selected:', selectedOption);
    if (config?.onCassetteChange) {
      config.onCassetteChange(selectedOption);
    }
  };

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

      {/* Compatibility Warnings */}
      {setup.crankset && setup.cassette && (
        <CompatibilityWarnings crankset={setup.crankset} cassette={setup.cassette} />
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Wheel Size Selection */}
        <div>
          <label className="form-label">Wheel Size</label>
          <select
            value={setup.wheel}
            onChange={(e) => config.onWheelChange(e.target.value)}
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
            onChange={(e) => config.onTireChange(e.target.value)}
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
}

// Helper Components
function CompatibilityWarnings({ crankset, cassette }) {
  const warnings = validateCompatibility(crankset, cassette);
  
  if (warnings.length === 0) return null;

  return (
    <div className="mb-4 p-3 rounded-lg border" 
         style={{ 
           background: 'rgba(255, 193, 7, 0.1)', 
           borderColor: 'rgba(255, 193, 7, 0.3)' 
         }}>
      <div className="flex items-center space-x-2 mb-2">
        <svg className="w-4 h-4" style={{ color: '#ffc107' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm0 3.47L20.53 19H3.47L12 5.47z"/>
          <path d="M11 16h2v2h-2zm0-6h2v4h-2z"/>
        </svg>
        <span className="text-sm font-medium" style={{ color: '#ffc107' }}>
          Compatibility Check
        </span>
      </div>
      {warnings.map((warning, index) => (
        <div key={index} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          • {warning}
        </div>
      ))}
    </div>
  );
}

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

function validateCompatibility(crankset, cassette) {
  const warnings = [];
  
  // Check if both components are from the same manufacturer
  if (crankset.manufacturer !== cassette.manufacturer) {
    warnings.push('Components from different manufacturers may have compatibility issues');
  }
  
  // Check if the cassette range is appropriate for the crankset
  const totalTeeth = crankset.teeth.reduce((a, b) => a + b, 0);
  const cassetteRange = cassette.teeth[1] - cassette.teeth[0];
  
  if (cassetteRange > 40 && totalTeeth < 50) {
    warnings.push('Large cassette range may require a longer chain');
  }
  
  return warnings;
} 