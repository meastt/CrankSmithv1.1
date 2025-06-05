import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { RileyChat } from '../lib/rileyAI' // Import Riley

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

export default function Results({ results, onSave, bikeType, currentSetup, proposedSetup, componentDatabase }) {
  const [showDetails, setShowDetails] = useState(false)
  const [chartType, setChartType] = useState('modern')
  const [showRiley, setShowRiley] = useState(false)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const { current, proposed, comparison } = results
  const speedUnit = comparison.speedUnit || 'km/h'

  // All your existing chart data and options stay the same...
  const modernChartData = {
    labels: ['0', '20', '40', '60', '80', '90', '100', '120', '140'],
    datasets: [
      {
        label: 'Current Setup',
        data: [0, 8, 16, 24, 32, current.metrics.highSpeed, current.metrics.highSpeed * 1.1, current.metrics.highSpeed * 1.3, current.metrics.highSpeed * 1.5],
        borderColor: '#007aff',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(0, 122, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 122, 255, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: '#007aff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        borderWidth: 3,
      },
      {
        label: 'Proposed Setup',
        data: [0, 8.5, 17, 25.5, 34, proposed.metrics.highSpeed, proposed.metrics.highSpeed * 1.1, proposed.metrics.highSpeed * 1.3, proposed.metrics.highSpeed * 1.5],
        borderColor: '#30d158',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(48, 209, 88, 0.3)');
          gradient.addColorStop(1, 'rgba(48, 209, 88, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: '#30d158',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        borderWidth: 3,
      }
    ]
  }

  const classicChartData = {
    labels: ['Top Speed', 'Climbing Speed'],
    datasets: [
      {
        label: 'Current',
        data: [current.metrics.highSpeed, current.metrics.lowSpeed],
        backgroundColor: 'rgba(0, 122, 255, 0.8)',
        borderColor: '#007aff',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Proposed',
        data: [proposed.metrics.highSpeed, proposed.metrics.lowSpeed],
        backgroundColor: 'rgba(48, 209, 88, 0.8)',
        borderColor: '#30d158',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  }

  const modernChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Speed vs Cadence (${speedUnit})`,
        color: 'var(--text-secondary)',
        font: {
          size: 18,
          weight: '600'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-subtle)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} ${speedUnit}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-subtle)',
          drawBorder: false,
        },
        ticks: {
          color: 'var(--text-tertiary)',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + ` ${speedUnit}`
          }
        },
        title: {
          display: true,
          text: `Speed (${speedUnit})`,
          color: 'var(--text-secondary)',
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-tertiary)',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Cadence (RPM)',
          color: 'var(--text-secondary)',
          font: {
            size: 14,
            weight: '500'
          }
        }
      }
    }
  }

  const classicChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-secondary)',
          font: {
            size: 14
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: `Speed Comparison at 90 RPM (${speedUnit})`,
        color: 'var(--text-secondary)',
        font: {
          size: 18,
          weight: '600'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-subtle)',
        borderWidth: 1,
        cornerRadius: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-subtle)'
        },
        ticks: {
          color: 'var(--text-tertiary)',
          callback: function(value) {
            return value + ` ${speedUnit}`
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-tertiary)'
        }
      }
    }
  }

  return (
    <div ref={resultsRef} className="space-y-12 mt-16">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="section-title">Performance Analysis</h2>
        <p className="hero-subtitle max-w-2xl mx-auto">
          Compare your setups and understand the performance impact of each component change.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <AppleMetricCard
          label="Weight Change"
          value={`${comparison.weightChange > 0 ? '+' : ''}${comparison.weightChange}g`}
          type={comparison.weightChange < 0 ? 'positive' : comparison.weightChange > 0 ? 'negative' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          }
        />
        <AppleMetricCard
          label="Top Speed"
          value={`${Math.max(current.metrics.highSpeed, proposed.metrics.highSpeed).toFixed(1)}`}
          unit={speedUnit}
          type="neutral"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          }
        />
        <AppleMetricCard
          label="Climbing Gear"
          value={Math.min(current.metrics.lowRatio, proposed.metrics.lowRatio).toFixed(2)}
          subtitle="Lower is easier"
          type="neutral"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M5 3l14 9-14 9V3z"/>
            </svg>
          }
        />
        <AppleMetricCard
          label="Gear Range"
          value={`${proposed.gearRange}`}
          unit="%"
          subtitle={`${comparison.rangeIncrease > 0 ? '+' : ''}${comparison.rangeIncrease}% change`}
          type={comparison.rangeIncrease > 0 ? 'positive' : comparison.rangeIncrease < 0 ? 'negative' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          }
        />
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center">
        <div className="flex rounded-xl p-1" 
             style={{ 
               background: 'var(--surface-primary)', 
               border: '1px solid var(--border-subtle)' 
             }}>
          <button
            onClick={() => setChartType('modern')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              chartType === 'modern' 
                ? 'text-white shadow-sm' 
                : 'hover:opacity-70'
            }`}
            style={{
              background: chartType === 'modern' 
                ? 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' 
                : 'transparent',
              color: chartType === 'modern' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Modern View
          </button>
          <button
            onClick={() => setChartType('classic')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              chartType === 'classic' 
                ? 'text-white shadow-sm' 
                : 'hover:opacity-70'
            }`}
            style={{
              background: chartType === 'classic' 
                ? 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' 
                : 'transparent',
              color: chartType === 'classic' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Classic View
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="card" style={{ padding: '32px' }}>
        {chartType === 'modern' ? (
          <>
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: '#007aff' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Current Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: '#30d158' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Proposed Setup</span>
              </div>
            </div>
            <Line data={modernChartData} options={modernChartOptions} />
          </>
        ) : (
          <Bar data={classicChartData} options={classicChartOptions} />
        )}
      </div>

      {/* Setup Comparison Cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        <SetupComparisonCard
          title="Current Setup"
          badge="Baseline"
          badgeColor="var(--surface-elevated)"
          metrics={current.metrics}
          totalWeight={current.totalWeight}
          gearRange={current.gearRange}
          speedUnit={speedUnit}
          icon="⚙️"
          accentColor="#007aff"
        />
        
        <SetupComparisonCard
          title="Proposed Setup"
          badge="Upgrade"
          badgeColor="var(--accent-performance)"
          metrics={proposed.metrics}
          totalWeight={proposed.totalWeight}
          gearRange={proposed.gearRange}
          speedUnit={speedUnit}
          icon="🚀"
          accentColor="#30d158"
        />
      </div>

      {/* Detailed Comparison */}
      <div className="card">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left flex justify-between items-center p-2 -m-2 rounded-lg transition-colors"
          onMouseEnter={(e) => e.target.style.background = 'var(--surface-elevated)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Detailed Analysis
          </h3>
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="mt-6 space-y-6">
            <AppleComparisonTable current={current} proposed={proposed} speedUnit={speedUnit} />
            
            {(current.warnings?.length > 0 || proposed.warnings?.length > 0) && (
              <div className="p-4 rounded-xl" 
                   style={{ 
                     background: 'rgba(255, 159, 10, 0.1)', 
                     border: '1px solid rgba(255, 159, 10, 0.3)' 
                   }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <h4 className="font-semibold" style={{ color: 'var(--accent-warning)' }}>
                    Compatibility Warnings
                  </h4>
                </div>
                {current.warnings?.map((warning, i) => (
                  <p key={i} className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Current:</strong> {warning}
                  </p>
                ))}
                {proposed.warnings?.map((warning, i) => (
                  <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Proposed:</strong> {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔧 RILEY AI INTEGRATION - NEW! */}
      <div className="border-t pt-12" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-center mb-8">
          <h2 className="section-title">Questions About Your Results?</h2>
          <p className="hero-subtitle max-w-2xl mx-auto mb-6">
            Chat with Riley, our expert bike mechanic, about component compatibility, upgrade recommendations, or any cycling tech questions.
          </p>
          
          {!showRiley && (
            <button
              onClick={() => setShowRiley(true)}
              className="btn-primary text-lg px-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Ask Riley
            </button>
          )}
        </div>

        {showRiley && (
          <RileyChat 
            userSetup={{ 
              bikeType, 
              crankset: currentSetup?.crankset, 
              cassette: currentSetup?.cassette,
              tire: currentSetup?.tire 
            }}
            analysisResults={results}
            componentDatabase={componentDatabase}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
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
    </div>
  )
}

// All your existing helper components stay the same
function AppleMetricCard({ label, value, unit, subtitle, type, icon }) {
  return (
    <div className="card text-center">
      <div className="flex items-center justify-center mb-4" style={{ color: 'var(--accent-blue)' }}>
        {icon}
      </div>
      <div className={`metric-large ${type}`}>
        {value}
        {unit && (
          <span className="text-lg font-medium ml-1" style={{ color: 'var(--text-tertiary)' }}>
            {unit}
          </span>
        )}
      </div>
      <div className="metric-label">{label}</div>
      {subtitle && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-quaternary)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function SetupComparisonCard({ title, badge, badgeColor, metrics, totalWeight, gearRange, speedUnit, icon, accentColor }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <span className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ background: badgeColor }}>
          {badge}
        </span>
      </div>
      
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-6xl">{icon}</div>
          <div className="text-left">
            <p className="text-3xl font-bold" style={{ color: accentColor }}>
              {metrics.highSpeed} {speedUnit}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Top Speed @ 90 RPM
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-tertiary)' }}>Weight</span>
          <span style={{ color: 'var(--text-secondary)' }}>{totalWeight}g</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-tertiary)' }}>Gear Range</span>
          <span style={{ color: 'var(--text-secondary)' }}>{gearRange}%</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-tertiary)' }}>Low Speed</span>
          <span style={{ color: 'var(--text-secondary)' }}>{metrics.lowSpeed} {speedUnit}</span>
        </div>
      </div>
    </div>
  );
}

function AppleComparisonTable({ current, proposed, speedUnit }) {
  const metrics = [
    { label: 'Total Weight', currentValue: `${current.totalWeight}g`, proposedValue: `${proposed.totalWeight}g`, change: `${proposed.totalWeight - current.totalWeight > 0 ? '+' : ''}${proposed.totalWeight - current.totalWeight}g` },
    { label: 'High Speed', currentValue: `${current.metrics.highSpeed} ${speedUnit}`, proposedValue: `${proposed.metrics.highSpeed} ${speedUnit}`, change: `${(proposed.metrics.highSpeed - current.metrics.highSpeed).toFixed(1)} ${speedUnit}` },
    { label: 'Low Speed', currentValue: `${current.metrics.lowSpeed} ${speedUnit}`, proposedValue: `${proposed.metrics.lowSpeed} ${speedUnit}`, change: `${(proposed.metrics.lowSpeed - current.metrics.lowSpeed).toFixed(1)} ${speedUnit}` },
    { label: 'High Gear Ratio', currentValue: current.metrics.highRatio, proposedValue: proposed.metrics.highRatio, change: (proposed.metrics.highRatio - current.metrics.highRatio).toFixed(2) },
    { label: 'Low Gear Ratio', currentValue: current.metrics.lowRatio, proposedValue: proposed.metrics.lowRatio, change: (proposed.metrics.lowRatio - current.metrics.lowRatio).toFixed(2) },
    { label: 'Gear Range', currentValue: `${current.gearRange}%`, proposedValue: `${proposed.gearRange}%`, change: `${proposed.gearRange - current.gearRange}%` }
  ];

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border-subtle)' }}>
      <table className="w-full text-sm">
        <thead style={{ background: 'var(--surface-elevated)' }}>
          <tr>
            <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Metric</th>
            <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Current</th>
            <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Proposed</th>
            <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Change</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={metric.label} 
                style={{ 
                  borderTop: index > 0 ? '1px solid var(--border-subtle)' : 'none',
                  background: index % 2 === 0 ? 'transparent' : 'var(--surface-secondary)'
                }}>
              <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{metric.label}</td>
              <td className="text-right py-3 px-4" style={{ color: 'var(--text-tertiary)' }}>{metric.currentValue}</td>
              <td className="text-right py-3 px-4" style={{ color: 'var(--text-tertiary)' }}>{metric.proposedValue}</td>
              <td className="text-right py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                {metric.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}