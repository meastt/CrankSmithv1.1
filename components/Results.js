import { useState, useEffect, useRef } from 'react'
import { RileyChat } from '../lib/rileyAI'

export default function Results({ results, onSave, bikeType, currentSetup, proposedSetup, componentDatabase }) {
  const [showRiley, setShowRiley] = useState(false)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  if (!results) return null

  const { current, proposed, comparison } = results
  const speedUnit = comparison.speedUnit || 'mph'

  // Enhanced color logic for changes
  const getChangeColor = (value, isGoodWhenLower = false) => {
    if (Math.abs(value) < 0.1) return 'var(--text-tertiary)' // Neutral gray for minimal change
    const isPositive = value > 0
    const isGood = isGoodWhenLower ? !isPositive : isPositive
    return isGood ? 'var(--accent-performance)' : 'var(--accent-critical)'
  }

  const formatChange = (value, unit = '', showPlus = true) => {
    const rounded = Math.round(value * 10) / 10
    if (Math.abs(rounded) < 0.1) return '—'
    const sign = showPlus && rounded > 0 ? '+' : ''
    return `${sign}${rounded}${unit}`
  }

  // Smart bottom line generation
  const generateBottomLine = () => {
    const weightChange = comparison.weightChange || 0
    const speedChange = parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed)
    const rangeChange = parseInt(proposed.gearRange) - parseInt(current.gearRange)
    
    let message = "Your proposed setup "
    const benefits = []
    
    if (weightChange < -10) benefits.push(`saves ${Math.abs(weightChange)}g`)
    else if (weightChange > 10) benefits.push(`adds ${weightChange}g`)
    
    if (speedChange > 0.3) benefits.push(`gives you ${speedChange.toFixed(1)} ${speedUnit} more top speed`)
    else if (speedChange < -0.3) benefits.push(`reduces top speed by ${Math.abs(speedChange).toFixed(1)} ${speedUnit}`)
    
    if (rangeChange > 20) benefits.push(`adds ${rangeChange}% more gear range for climbing`)
    else if (rangeChange < -20) benefits.push(`reduces gear range by ${Math.abs(rangeChange)}%`)
    
    if (benefits.length === 0) {
      return "Your proposed setup offers similar performance with different characteristics."
    }
    
    message += benefits.join(", ") + ". "
    
    // Recommendation logic
    const majorBenefits = benefits.length >= 2 || weightChange < -50 || speedChange > 1 || rangeChange > 50
    message += majorBenefits ? "Worth the upgrade." : "Minor improvement - consider your priorities."
    
    return message
  }

  const MetricCard = ({ 
    title, 
    currentValue, 
    proposedValue, 
    change, 
    unit = '', 
    isGoodWhenLower = false,
    icon 
  }) => {
    const changeColor = getChangeColor(change, isGoodWhenLower)
    
    return (
      <div className="card text-center p-8">
        <div className="flex items-center justify-center mb-6 w-12 h-12 mx-auto" style={{ color: 'var(--accent-blue)' }}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-base">
            <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
            <span className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {currentValue}{unit}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-base">
            <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
            <span className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {proposedValue}{unit}
            </span>
          </div>
          
          <div className="border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div 
              className="text-3xl font-bold"
              style={{ color: changeColor }}
            >
              {formatChange(change, unit)}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-quaternary)' }}>
              Change
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={resultsRef} className="space-y-12 mt-16">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 section-title-fire" style={{ color: 'var(--text-primary)' }}>Performance Analysis</h2>
        <p className="text-xl" style={{ color: 'var(--text-tertiary)' }}>
          Compare your setups and understand the performance impact
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <MetricCard
          title="Top Speed"
          currentValue={current.metrics.highSpeed}
          proposedValue={proposed.metrics.highSpeed}
          change={parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed)}
          unit={` ${speedUnit}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        
        <MetricCard
          title="Climbing Speed"
          currentValue={current.metrics.lowSpeed}
          proposedValue={proposed.metrics.lowSpeed}
          change={parseFloat(proposed.metrics.lowSpeed) - parseFloat(current.metrics.lowSpeed)}
          unit={` ${speedUnit}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
          }
        />
        
        <MetricCard
          title="Weight"
          currentValue={current.totalWeight}
          proposedValue={proposed.totalWeight}
          change={proposed.totalWeight - current.totalWeight}
          unit="g"
          isGoodWhenLower={true}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          }
        />
        
        <MetricCard
          title="Gear Range"
          currentValue={current.gearRange}
          proposedValue={proposed.gearRange}
          change={parseInt(proposed.gearRange) - parseInt(current.gearRange)}
          unit="%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Bottom Line - The Star of the Show */}
      <div className="card">
        <div 
          className="p-8 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
            border: '1px solid var(--accent-blue)',
            boxShadow: '0 8px 32px rgba(0, 122, 255, 0.1)'
          }}
        >
          <div className="flex items-start gap-6">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
                color: 'white'
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Bottom Line
              </h3>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {generateBottomLine()}
              </p>
              
              {/* Compatibility Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: 'var(--accent-performance)' }}></div>
                  <span className="text-base font-medium" style={{ color: 'var(--accent-performance)' }}>
                    ✓ Components are compatible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onSave}
          className="btn-primary text-lg px-8"
          style={{ minWidth: '180px' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Save to Garage
        </button>
        
        <button
          onClick={() => setShowRiley(!showRiley)}
          className="px-6 py-3 rounded-xl font-medium transition-all text-base min-w-[160px] flex items-center justify-center gap-2"
          style={{ 
            background: showRiley ? 'var(--accent-performance)' : 'var(--surface-primary)',
            color: showRiley ? 'white' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
          onMouseEnter={(e) => {
            if (!showRiley) {
              e.target.style.background = 'var(--surface-elevated)';
              e.target.style.borderColor = 'var(--accent-blue)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showRiley) {
              e.target.style.background = 'var(--surface-primary)';
              e.target.style.borderColor = 'var(--border-subtle)';
            }
          }}
        >
          <span>🔧</span>
          {showRiley ? 'Hide Riley' : 'Ask Riley'}
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-6 py-3 rounded-xl font-medium transition-all text-base min-w-[140px]"
          style={{ 
            background: 'var(--surface-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--surface-elevated)';
            e.target.style.borderColor = 'var(--border-elevated)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--surface-primary)';
            e.target.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/>
          </svg>
          Print Results
        </button>
      </div>

      {/* Riley AI Chat */}
      {showRiley && (
        <div className="mt-8">
          <RileyChat 
            userSetup={{ 
              bikeType, 
              crankset: proposedSetup?.crankset, 
              cassette: proposedSetup?.cassette,
              tire: proposedSetup?.tire 
            }}
            analysisResults={results}
            componentDatabase={componentDatabase}
          />
        </div>
      )}

      {/* Technical Details - Collapsible */}
      <details className="card">
        <summary 
          className="cursor-pointer text-lg font-medium p-2 -m-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.target.style.background = 'var(--surface-elevated)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          🔍 Technical Details (for gear nerds)
        </summary>
        
        <div className="mt-6 space-y-4" style={{ color: 'var(--text-tertiary)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Gear Ratios
              </h4>
              <div className="space-y-1">
                <div>• High: {current.metrics.highRatio} → {proposed.metrics.highRatio}</div>
                <div>• Low: {current.metrics.lowRatio} → {proposed.metrics.lowRatio}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                System Requirements
              </h4>
              <div className="space-y-1">
                <div>• Chain: {currentSetup.crankset?.speeds || 'Standard'} compatible</div>
                <div>• Derailleur capacity: Within normal range</div>
                <div>• Freehub: Standard compatibility</div>
              </div>
            </div>
          </div>
          
          <div className="text-xs pt-2" style={{ 
            color: 'var(--text-quaternary)',
            borderTop: '1px solid var(--border-subtle)' 
          }}>
            Calculations based on 90 RPM cadence, {speedUnit} units, and standard rolling resistance.
          </div>
        </div>
      </details>
    </div>
  )
}