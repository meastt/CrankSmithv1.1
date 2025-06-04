import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

export default function Results({ results, onSave, bikeType }) {
  const [showDetails, setShowDetails] = useState(false)
  const [chartType, setChartType] = useState('modern') // 'modern' or 'classic'
  const resultsRef = useRef(null)

  useEffect(() => {
    // Scroll to results when they appear
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const { current, proposed, comparison } = results
  const speedUnit = comparison.speedUnit || 'km/h'

  // Modern gradient line chart data
  const modernChartData = {
    labels: ['0', '20', '40', '60', '80', '90', '100', '120', '140'],
    datasets: [
      {
        label: 'Current Setup',
        data: [0, 8, 16, 24, 32, current.metrics.highSpeed, current.metrics.highSpeed * 1.1, current.metrics.highSpeed * 1.3, current.metrics.highSpeed * 1.5],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Proposed Setup',
        data: [0, 8.5, 17, 25.5, 34, proposed.metrics.highSpeed, proposed.metrics.highSpeed * 1.1, proposed.metrics.highSpeed * 1.3, proposed.metrics.highSpeed * 1.5],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }

  // Classic bar chart data
  const classicChartData = {
    labels: ['Top Speed', 'Climbing Speed'],
    datasets: [
      {
        label: 'Current',
        data: [current.metrics.highSpeed, current.metrics.lowSpeed],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Proposed',
        data: [proposed.metrics.highSpeed, proposed.metrics.lowSpeed],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
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
        color: '#e5e7eb',
        font: {
          size: 16
        }
      },
      tooltip: {
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
          color: 'rgba(75, 85, 99, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return value + ` ${speedUnit}`
          }
        },
        title: {
          display: true,
          text: `Speed (${speedUnit})`,
          color: '#9ca3af'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        },
        title: {
          display: true,
          text: 'Cadence (RPM)',
          color: '#9ca3af'
        }
      }
    }
  }

  const classicChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb'
        }
      },
      title: {
        display: true,
        text: `Speed Comparison at 90 RPM (${speedUnit})`,
        color: '#e5e7eb'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        ticks: {
          color: '#9ca3af',
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
          color: '#9ca3af'
        }
      }
    }
  }

  return (
    <div ref={resultsRef} className="mt-12 space-y-8 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center">Performance Analysis</h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          label="Weight Change"
          value={`${comparison.weightChange > 0 ? '+' : ''}${comparison.weightChange}g`}
          valueColor={comparison.weightChange < 0 ? 'text-green-400' : 'text-red-400'}
          icon="⚖️"
        />
        <MetricCard
          label="Top Speed"
          value={`${Math.max(current.metrics.highSpeed, proposed.metrics.highSpeed).toFixed(1)} ${speedUnit}`}
          valueColor="text-blue-400"
          icon="💨"
        />
        <MetricCard
          label="Climbing Gear"
          value={`${Math.min(current.metrics.lowRatio, proposed.metrics.lowRatio).toFixed(2)}`}
          subtitle="Lower is easier"
          valueColor="text-purple-400"
          icon="⛰️"
        />
        <MetricCard
          label="Gear Range"
          value={`${proposed.gearRange}%`}
          subtitle={`${comparison.rangeIncrease > 0 ? '+' : ''}${comparison.rangeIncrease}% change`}
          valueColor="text-orange-400"
          icon="📊"
        />
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setChartType('modern')}
            className={`px-4 py-2 rounded-md transition-all text-sm ${
              chartType === 'modern' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Modern View
          </button>
          <button
            onClick={() => setChartType('classic')}
            className={`px-4 py-2 rounded-md transition-all text-sm ${
              chartType === 'classic' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Classic View
          </button>
        </div>
      </div>

      {/* Speed Comparison Chart */}
      <div className="card">
        {chartType === 'modern' ? (
          <>
            {/* Legend for modern chart */}
            <div className="flex justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-400">Current Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-400">Proposed Setup</span>
              </div>
            </div>
            <Line data={modernChartData} options={modernChartOptions} />
          </>
        ) : (
          <Bar data={classicChartData} options={classicChartOptions} />
        )}
      </div>

      {/* Visual Gear Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-4">Current Setup</h3>
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="text-6xl">⚙️</div>
              <div className="text-left">
                <p className="text-2xl font-bold text-blue-400">{current.metrics.highSpeed} {speedUnit}</p>
                <p className="text-sm text-gray-400">Top Speed @ 90 RPM</p>
              </div>
            </div>
            <div className="h-px bg-gray-700"></div>
            <div className="text-sm space-y-1">
              <p>Weight: {current.totalWeight}g</p>
              <p>Gear Range: {current.gearRange}%</p>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-4">Proposed Setup</h3>
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="text-6xl">🚀</div>
              <div className="text-left">
                <p className="text-2xl font-bold text-green-400">{proposed.metrics.highSpeed} {speedUnit}</p>
                <p className="text-sm text-gray-400">Top Speed @ 90 RPM</p>
              </div>
            </div>
            <div className="h-px bg-gray-700"></div>
            <div className="text-sm space-y-1">
              <p>Weight: {proposed.totalWeight}g</p>
              <p>Gear Range: {proposed.gearRange}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="card">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left flex justify-between items-center"
        >
          <h3 className="text-xl font-semibold">Detailed Comparison</h3>
          <svg
            className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="mt-6 space-y-4">
            <ComparisonTable current={current} proposed={proposed} speedUnit={speedUnit} />
            
            {/* Warnings */}
            {(current.warnings.length > 0 || proposed.warnings.length > 0) && (
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Compatibility Warnings</h4>
                {current.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-yellow-200">Current: {warning}</p>
                ))}
                {proposed.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-yellow-200">Proposed: {warning}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onSave}
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
          </svg>
          Save Configuration
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
          </svg>
          Print Results
        </button>
      </div>
    </div>
  )
}

function MetricCard({ label, value, subtitle, valueColor, icon }) {
  return (
    <div className="card text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function ComparisonTable({ current, proposed, speedUnit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-2">Metric</th>
            <th className="text-right py-2">Current</th>
            <th className="text-right py-2">Proposed</th>
            <th className="text-right py-2">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-800">
            <td className="py-2">Total Weight</td>
            <td className="text-right">{current.totalWeight}g</td>
            <td className="text-right">{proposed.totalWeight}g</td>
            <td className="text-right font-semibold">
              {proposed.totalWeight - current.totalWeight > 0 ? '+' : ''}
              {proposed.totalWeight - current.totalWeight}g
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="py-2">High Speed</td>
            <td className="text-right">{current.metrics.highSpeed} {speedUnit}</td>
            <td className="text-right">{proposed.metrics.highSpeed} {speedUnit}</td>
            <td className="text-right">
              {(proposed.metrics.highSpeed - current.metrics.highSpeed).toFixed(1)} {speedUnit}
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="py-2">Low Speed</td>
            <td className="text-right">{current.metrics.lowSpeed} {speedUnit}</td>
            <td className="text-right">{proposed.metrics.lowSpeed} {speedUnit}</td>
            <td className="text-right">
              {(proposed.metrics.lowSpeed - current.metrics.lowSpeed).toFixed(1)} {speedUnit}
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="py-2">High Gear Ratio</td>
            <td className="text-right">{current.metrics.highRatio}</td>
            <td className="text-right">{proposed.metrics.highRatio}</td>
            <td className="text-right">{(proposed.metrics.highRatio - current.metrics.highRatio).toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="py-2">Low Gear Ratio</td>
            <td className="text-right">{current.metrics.lowRatio}</td>
            <td className="text-right">{proposed.metrics.lowRatio}</td>
            <td className="text-right">{(proposed.metrics.lowRatio - current.metrics.lowRatio).toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="py-2">Gear Range</td>
            <td className="text-right">{current.gearRange}%</td>
            <td className="text-right">{proposed.gearRange}%</td>
            <td className="text-right">{proposed.gearRange - current.gearRange}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}