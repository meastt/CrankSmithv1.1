import { useState, useEffect } from 'react'
import { bikeConfig, getComponentsForBikeType } from '../lib/components'

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
  const [speedUnit, setSpeedUnit] = useState('MPH') // Default to MPH for US
  const components = bikeType ? getComponentsForBikeType(bikeType) : { cassettes: [], cranksets: [] }
  const config = bikeType ? bikeConfig[bikeType] : null

  // Load saved preference on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem('speedUnit') || 'MPH'
    setSpeedUnit(savedUnit)
  }, [])

  // Save preference when changed
  const handleUnitChange = (unit) => {
    setSpeedUnit(unit)
    localStorage.setItem('speedUnit', unit)
  }

  return (
    <div className="space-y-8">
      {/* Speed Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => handleUnitChange('KMH')}
            className={`px-4 py-2 rounded-md transition-all ${
              speedUnit === 'KMH' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            km/h
          </button>
          <button
            onClick={() => handleUnitChange('MPH')}
            className={`px-4 py-2 rounded-md transition-all ${
              speedUnit === 'MPH' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            mph
          </button>
        </div>
      </div>

      {/* Bike Type Selection */}
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium mb-2 text-gray-400">
          Select Your Bike Type
        </label>
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

      {/* Configuration Cards */}
      {bikeType && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Setup */}
          <SetupCard
            title="Current Setup"
            icon="⚙️"
            setup={currentSetup}
            setSetup={setCurrentSetup}
            config={config}
            components={components}
            colorClass="from-blue-500 to-purple-600"
          />

          {/* Proposed Setup */}
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

      {/* Calculate Button - Pass speedUnit to parent */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate & Compare
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function SetupCard({ title, icon, setup, setSetup, config, components, colorClass }) {
  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center mr-4 text-2xl`}>
          {icon}
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Wheel Size */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Wheel Size
          </label>
          <select
            value={setup.wheel}
            onChange={(e) => setSetup({ ...setup, wheel: e.target.value })}
            className="input-field"
          >
            <option value="">Select wheel size...</option>
            {config?.wheelSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Tire Width */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Tire Width (mm)
          </label>
          <select
            value={setup.tire}
            onChange={(e) => setSetup({ ...setup, tire: e.target.value })}
            className="input-field"
          >
            <option value="">Select tire width...</option>
            {config?.tireWidths.map(width => (
              <option key={width} value={width}>{width}mm</option>
            ))}
          </select>
        </div>

        {/* Crankset */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Crankset
          </label>
          <select
            value={setup.crankset?.id || ''}
            onChange={(e) => {
              const crankset = components.cranksets.find(c => c.id === e.target.value)
              setSetup({ ...setup, crankset })
            }}
            className="input-field"
          >
            <option value="">Select crankset...</option>
            {components.cranksets.map(crankset => (
              <option key={crankset.id} value={crankset.id}>
                {crankset.model} {crankset.variant} ({crankset.weight}g) - ${crankset.price}
              </option>
            ))}
          </select>
        </div>

        {/* Cassette */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Cassette
          </label>
          <select
            value={setup.cassette?.id || ''}
            onChange={(e) => {
              const cassette = components.cassettes.find(c => c.id === e.target.value)
              setSetup({ ...setup, cassette })
            }}
            className="input-field"
          >
            <option value="">Select cassette...</option>
            {components.cassettes.map(cassette => (
              <option key={cassette.id} value={cassette.id}>
                {cassette.model} {cassette.variant} ({cassette.weight}g) - ${cassette.price}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}