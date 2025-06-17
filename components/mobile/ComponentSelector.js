// components/mobile/ComponentSelector.js - Mobile-optimized component selection
import { useState } from 'react';
import { bikeConfig, getComponentsForBikeType } from '../../lib/components';
import MobileDropdown from './MobileDropdown';

export default function ComponentSelector({
  bikeType,
  currentSetup,
  setCurrentSetup,
  proposedSetup,
  setProposedSetup,
  setupStep,
  setSetupStep,
  onCalculate,
  loading,
  onReset
}) {
  const [activeSetup, setActiveSetup] = useState('current'); // 'current' or 'proposed'
  
  const config = bikeConfig[bikeType];
  const components = getComponentsForBikeType(bikeType);
  
  const isCurrentSetup = activeSetup === 'current';
  const setup = isCurrentSetup ? currentSetup : proposedSetup;
  const setSetup = isCurrentSetup ? setCurrentSetup : setProposedSetup;

  const calculateCompletion = (setup) => {
    const required = ['wheel', 'tire', 'crankset', 'cassette'];
    const completed = required.filter(field => {
      const value = setup[field];
      if (field === 'crankset' || field === 'cassette') {
        return value && typeof value === 'object' && Object.keys(value).length > 0;
      }
      // Fix: Convert to string before trimming, handle all types
      return value && String(value).trim() !== '';
    });
    return (completed.length / required.length) * 100;
  };

  const currentCompletion = calculateCompletion(currentSetup);
  const proposedCompletion = calculateCompletion(proposedSetup);
  const totalCompletion = (currentCompletion + proposedCompletion) / 2;

  const canCalculate = currentCompletion === 100 && proposedCompletion === 100;

  const handleComponentChange = (field, value) => {
    setSetup(prev => ({ ...prev, [field]: value }));
  };

  const formatComponentOptions = (components, type) => {
    return components.map(component => ({
      id: component.id,
      label: `${component.model} ${component.variant}`,
      subtitle: `${component.weight}g • ${component.speeds}`,
      value: component
    }));
  };

  return (
    <div className="mobile-screen" style={{ padding: '0' }}>
      {/* Header */}
      <div className="mobile-header" style={{ 
        padding: '20px 20px 16px 20px',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onReset}
            className="reset-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'white' }}>
            {config.name} Setup
          </h1>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="progress-container mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Setup Progress</span>
            <span>{Math.round(totalCompletion)}%</span>
          </div>
          <div 
            className="progress-bar"
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div 
              className="progress-fill"
              style={{
                width: `${totalCompletion}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Setup Toggle */}
        <div className="setup-toggle" style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveSetup('current')}
            className="toggle-btn"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: activeSetup === 'current' ? 'white' : 'transparent',
              color: activeSetup === 'current' ? '#000' : 'white',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Current ({Math.round(currentCompletion)}%)
          </button>
          <button
            onClick={() => setActiveSetup('proposed')}
            className="toggle-btn"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: activeSetup === 'proposed' ? 'white' : 'transparent',
              color: activeSetup === 'proposed' ? '#000' : 'white',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Proposed ({Math.round(proposedCompletion)}%)
          </button>
        </div>
      </div>

      {/* Component Selection */}
      <div className="component-form" style={{ padding: '20px' }}>
        <div className="space-y-6">
          {/* Wheel Size */}
          <div>
            <label className="mobile-label">Wheel Size</label>
            <MobileDropdown
              options={config.wheelSizes.map(size => ({
                id: size,
                label: size === '700c' ? '700c (Road/Gravel)' : 
                       size === '650b' ? '650b (Gravel)' : 
                       size === '26-inch' ? '26" (MTB)' :
                       size === '27.5-inch' ? '27.5" (MTB)' :
                       size === '29-inch' ? '29" (MTB)' : size,
                value: size
              }))}
              value={setup.wheel}
              onChange={(value) => handleComponentChange('wheel', value)}
              placeholder="Select wheel size"
            />
          </div>

          {/* Tire Width */}
          <div>
            <label className="mobile-label">Tire Width</label>
            <MobileDropdown
              options={config.tireWidths.map(width => ({
                id: width,
                label: typeof width === 'number' && width < 10 ? `${width}"` : `${width}mm`,
                value: width
              }))}
              value={setup.tire}
              onChange={(value) => handleComponentChange('tire', value)}
              placeholder="Select tire width"
            />
          </div>

          {/* Crankset */}
          <div>
            <label className="mobile-label">Crankset</label>
            <MobileDropdown
              options={formatComponentOptions(components.cranksets, 'crankset')}
              value={setup.crankset}
              onChange={(value) => handleComponentChange('crankset', value)}
              placeholder="Select crankset"
              searchable
            />
          </div>

          {/* Cassette */}
          <div>
            <label className="mobile-label">Cassette</label>
            <MobileDropdown
              options={formatComponentOptions(components.cassettes, 'cassette')}
              value={setup.cassette}
              onChange={(value) => handleComponentChange('cassette', value)}
              placeholder="Select cassette"
              searchable
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="bottom-actions" style={{
        position: 'sticky',
        bottom: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 20%)',
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Quick Setup Status */}
        <div className="status-cards" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div className="status-card" style={{
            background: currentCompletion === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${currentCompletion === 100 ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div className="text-sm text-gray-300">Current</div>
            <div className="text-lg font-bold" style={{ 
              color: currentCompletion === 100 ? '#10B981' : 'white' 
            }}>
              {Math.round(currentCompletion)}%
            </div>
          </div>
          <div className="status-card" style={{
            background: proposedCompletion === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${proposedCompletion === 100 ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div className="text-sm text-gray-300">Proposed</div>
            <div className="text-lg font-bold" style={{ 
              color: proposedCompletion === 100 ? '#10B981' : 'white' 
            }}>
              {Math.round(proposedCompletion)}%
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={onCalculate}
          disabled={!canCalculate || loading}
          className="calculate-btn"
          style={{
            width: '100%',
            background: canCalculate && !loading ? 
              'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' : 
              'rgba(255, 255, 255, 0.1)',
            color: canCalculate && !loading ? 'white' : '#666',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            cursor: canCalculate && !loading ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyze Performance
            </>
          )}
        </button>

        {!canCalculate && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Complete both setups to analyze performance
          </p>
        )}
      </div>

      <style jsx>{`
        .mobile-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
