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
    <div className="space-y-8">
      {/* Speed Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          {['KMH', 'MPH'].map(unit => (
            <button
              key={unit}
              onClick={() => handleUnitChange(unit)}
              className={`px-4 py-2 rounded-md transition-all ${
                speedUnit === unit ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {unit.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bike Type Selection */}
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium mb-2 text-gray-400">Select Your Bike Type</label>
        <select
          value={bikeType}
          onChange={(e) => setBikeType(e.target.value)}
          className="input-field"
        >
          <option value="">Choose bike type...</option>
          <option value="road">Road Bike</option>
          <option value="gravel">Gravel Bike</option>
          <option value="mtb">Mountain Bike</option>
        </select>
      </div>

      {/* Config Cards */}
      {bikeType && (
        <div className="grid md:grid-cols-2 gap-8">
          <SetupCard
            title="Current Setup"
            icon="⚙️"
            setup={currentSetup}
            setSetup={setCurrentSetup}
            config={config}
            components={components}
            colorClass="from-blue-500 to-purple-600"
          />
          <SetupCard
            title="New Setup"
            icon="🚀"
            setup={proposedSetup}
            setSetup={setProposedSetup}
            config={config}
            components={components}
            colorClass="from-green-500 to-teal-600"
          />
        </div>
      )}

      {/* Calculate Button */}
      <div className="text-center">
        <button
          onClick={() => onCalculate(speedUnit)}
          disabled={!bikeType || loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2v14a2 2 0 002 2z" />
              </svg>
              Calculate & Compare
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SetupCard({ title, icon, setup, setSetup, config, components, colorClass }) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-white">{icon} {title}</h2>

      {/* Tire */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-400">Tire Width</label>
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
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-400">Crankset</label>
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
        <label className="block text-sm font-medium mb-2 text-gray-400">Cassette</label>
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
  );
}