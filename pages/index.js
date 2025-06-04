import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Calculator from '../components/Calculator'
import Results from '../components/Results'
import { localStorageDB } from '../lib/supabase'
import { compareSetups } from '../lib/calculations'
import { bikeConfig, getComponentsForBikeType, componentDatabase } from '../lib/components'

export default function Home() {
  const [bikeType, setBikeType] = useState('')
  const [currentSetup, setCurrentSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  })
  const [proposedSetup, setProposedSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedConfigs, setSavedConfigs] = useState([])
  const [showSaved, setShowSaved] = useState(false)

  // Load saved configurations on mount
  useEffect(() => {
    loadSavedConfigs()
  }, [])

  // Update available components when bike type changes
  useEffect(() => {
    if (bikeType && bikeConfig[bikeType]) {
      const defaults = bikeConfig[bikeType].defaultSetup
      const defaultCrankset = componentDatabase.cranksets.find(c => c.id === defaults.crankset)
      const defaultCassette = componentDatabase.cassettes.find(c => c.id === defaults.cassette)
      
      setCurrentSetup({
        wheel: defaults.wheel,
        tire: defaults.tire.toString(),
        crankset: defaultCrankset,
        cassette: defaultCassette
      })
      setProposedSetup({
        wheel: defaults.wheel,
        tire: defaults.tire.toString(),
        crankset: defaultCrankset,
        cassette: defaultCassette
      })
    }
  }, [bikeType])

  const loadSavedConfigs = async () => {
    const { data } = await localStorageDB.getConfigs()
    setSavedConfigs(data || [])
  }

  const handleCalculate = async (speedUnit = 'MPH') => {
    // Validate inputs
    if (!bikeType || !currentSetup.crankset || !currentSetup.cassette || 
        !proposedSetup.crankset || !proposedSetup.cassette) {
      alert('Please complete all fields before calculating')
      return
    }

    setLoading(true)
    
    try {
      // Perform calculations with speed unit
      const comparison = compareSetups(currentSetup, proposedSetup, speedUnit)
      setResults(comparison)
    } catch (error) {
      console.error('Calculation error:', error)
      alert('Error calculating results. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!results) return

    const name = prompt('Enter a name for this configuration:')
    if (!name) return

    const config = {
      name,
      bike_type: bikeType,
      current_setup: currentSetup,
      proposed_setup: proposedSetup,
      results: {
        weightChange: results.comparison.weightChange,
        currentMetrics: results.current.metrics,
        proposedMetrics: results.proposed.metrics
      }
    }

    const { error } = await localStorageDB.saveConfig(config)
    if (error) {
      alert('Error saving configuration')
    } else {
      alert('Configuration saved successfully!')
      loadSavedConfigs()
    }
  }

  const handleLoadConfig = (config) => {
    setBikeType(config.bike_type)
    setCurrentSetup(config.current_setup)
    setProposedSetup(config.proposed_setup)
    setResults(null)
    setShowSaved(false)
  }

  const handleDeleteConfig = async (id) => {
    if (confirm('Delete this configuration?')) {
      await localStorageDB.deleteConfig(id)
      loadSavedConfigs()
    }
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Gear Ratio Calculator
          </h1>
          <p className="text-xl text-gray-400">
            Optimize your bike&apos;s performance and save weight
          </p>
        </div>

        {/* Saved Configurations Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showSaved ? 'Hide' : 'Show'} Saved Configurations ({savedConfigs.length})
          </button>
        </div>

        {/* Saved Configurations List */}
        {showSaved && savedConfigs.length > 0 && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedConfigs.map(config => (
              <div key={config.id} className="card">
                <h3 className="font-semibold text-lg mb-2">{config.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {config.bike_type} • {new Date(config.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadConfig(config)}
                    className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calculator Component */}
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
          />
        )}
      </main>
    </Layout>
  )
}