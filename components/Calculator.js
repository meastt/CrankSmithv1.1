import React, { useState, useEffect } from 'react';
import { bikeConfig, getComponentsForBikeType } from '../lib/components';

export default function Calculator({
  bikeType,
  setBikeType,
  currentSetup,
  setCurrentSetup,
  proposedSetup,
  setProposedSetup,
  onCalculate,
  loading
}) {
  const [speedUnit, setSpeedUnit] = useState('MPH');
  const components = bikeType ? getComponentsForBikeType(bikeType) : { cassettes: [], cranksets: [] };
  const config = bikeType ? bikeConfig[bikeType] : null;

  useEffect(() => {
    const savedUnit = localStorage.getItem('speedUnit') || 'MPH';
    setSpeedUnit(savedUnit);
  }, []);

  const handleUnitChange = (unit) => {
    setSpeedUnit(unit);
    localStorage.setItem('speedUnit', unit);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="hero-title">Optimize Your Ride</h1>
        <p className="hero-subtitle max-w-2xl mx-auto">
          Analyze gear ratios, speed potential, and component weights with precision. 
          Make informed decisions about your next upgrade.
        </p>
      </div>

      {/* Speed Unit Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-xl p-1" 
             style={{ 
               background: 'var(--surface-primary)', 
               border: '1px solid var(--border-subtle)' 
             }}>
          {['KMH', 'MPH'].map(unit => (
            <button
              key={unit}
              onClick={() => handleUnitChange(unit)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                speedUnit === unit 
                  ? 'text-white shadow-sm' 
                  : 'hover:opacity-70'
              }`}
              style={{
                background: speedUnit === unit 
                  ? 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' 
                  : 'transparent',
                color: speedUnit === unit ? 'white' : 'var(--text-secondary)'
              }}
            >
              {unit.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bike Type Selection */}
      <div className="max-w-md mx-auto mb-12">
        <label className="form-label">Select Your Bike Type</label>
        <select
          value={bikeType}
          onChange={(e) => setBikeType(e.target.value)}
          className="input-field text-base"
          style={{ fontSize: '16px' }}
        >
          <option value="">Choose bike type...</option>
          <option value="road">Road Bike</option>
          <option value="gravel">Gravel Bike</option>
          <option value="mtb">Mountain Bike</option>
        </select>
      </div>

      {/* Component Configuration Cards */}
      {bikeType && (
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <SetupCard
            title="Current Setup"
            subtitle="Your baseline configuration"
            badge="Baseline"
            badgeColor="var(--surface-elevated)"
            setup={currentSetup}
            setSetup={setCurrentSetup}
            config={config}
            components={components}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <SetupCard
            title="Proposed Setup"
            subtitle="Your potential upgrade"
            badge="Upgrade"
            badgeColor="var(--accent-performance)"
            setup={proposedSetup}
            setSetup={setProposedSetup}
            config={config}
            components={components}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Calculate Button */}
      {bikeType && (
        <div className="text-center">
          <button
            onClick={() => onCalculate(speedUnit)}
            disabled={!bikeType || loading}
            className="btn-primary text-lg px-8 py-4"
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Analyze Performance
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function SetupCard({ title, subtitle, badge, badgeColor, setup, setSetup, config, components, icon }) {
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
            {icon}
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
        {/* Tire Width */}
        <div>
          <label className="form-label">Tire Width</label>
          <select
            value={setup.tire}
            onChange={(e) => setSetup({ ...setup, tire: e.target.value })}
            className="input-field"
          >
            <option value="">Select tire width...</option>
            {config?.tireWidths.map(width => (
              <option key={width} value={width}>
                {typeof width === 'number' && width < 10 ? `${width}"` : `${width}mm`}
              </option>
            ))}
          </select>
        </div>

        {/* Crankset */}
        <div>
          <label className="form-label">Crankset</label>
          <select
            value={setup.crankset?.id || ''}
            onChange={(e) => {
              const crankset = components.cranksets.find(c => c.id === e.target.value);
              setSetup({ ...setup, crankset });
            }}
            className="input-field"
          >
            <option value="">Select crankset...</option>
            {components.cranksets.map(c => (
              <option key={c.id} value={c.id}>
                {c.model} {c.variant}
              </option>
            ))}
          </select>
        </div>

        {/* Cassette */}
        <div>
          <label className="form-label">Cassette</label>
          <select
            value={setup.cassette?.id || ''}
            onChange={(e) => {
              const cassette = components.cassettes.find(c => c.id === e.target.value);
              setSetup({ ...setup, cassette });
            }}
            className="input-field"
          >
            <option value="">Select cassette...</option>
            {components.cassettes.map(c => (
              <option key={c.id} value={c.id}>
                {c.model} {c.variant}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Completion Indicator */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Configuration Status
          </span>
          <div className="flex items-center space-x-2">
            {setup.tire && setup.crankset && setup.cassette ? (
              <>
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-performance)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--accent-performance)' }}>
                  Complete
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-quaternary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Incomplete
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}