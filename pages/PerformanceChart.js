// PerformanceChart.js - Visual speed vs cadence analysis
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function PerformanceChart({ 
  current, 
  proposed, 
  speedUnit = 'mph',
  bikeType = 'road' 
}) {
  const [chartType, setChartType] = useState('speed-cadence');
  const [showComparison, setShowComparison] = useState(true);

  if (!current || !proposed) return null;

  const chartData = generateChartData(current, proposed, speedUnit);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Performance Visualization
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Speed vs cadence across all gears
          </p>
        </div>
        
        {/* Chart Controls */}
        <div className="flex gap-3">
          {/* Chart Type Toggle */}
          <div className="flex rounded-lg p-1" 
               style={{ 
                 background: 'var(--surface-primary)', 
                 border: '1px solid var(--border-subtle)' 
               }}>
            {[
              { key: 'speed-cadence', label: 'Speed/Cadence' },
              { key: 'gear-range', label: 'Gear Range' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setChartType(option.key)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  chartType === option.key ? 'text-white' : ''
                }`}
                style={{
                  background: chartType === option.key ? 'var(--accent-blue)' : 'transparent',
                  color: chartType === option.key ? 'white' : 'var(--text-secondary)'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Comparison Toggle */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
              showComparison ? 'text-white' : ''
            }`}
            style={{
              background: showComparison ? 'var(--accent-performance)' : 'transparent',
              color: showComparison ? 'white' : 'var(--text-secondary)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        {chartType === 'speed-cadence' ? (
          <SpeedCadenceChart 
            data={chartData.speedCadence}
            speedUnit={speedUnit}
            showComparison={showComparison}
          />
        ) : (
          <GearRangeChart 
            current={current}
            proposed={proposed}
            showComparison={showComparison}
          />
        )}
      </div>

      {/* Chart Insights */}
      <ChartInsights 
        current={current} 
        proposed={proposed} 
        chartType={chartType}
        speedUnit={speedUnit}
      />
    </div>
  );
}

// Speed vs Cadence Line Chart
function SpeedCadenceChart({ data, speedUnit, showComparison }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis 
          dataKey="cadence" 
          stroke="var(--text-tertiary)"
          label={{ value: 'Cadence (RPM)', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          stroke="var(--text-tertiary)"
          label={{ value: `Speed (${speedUnit})`, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}
          formatter={(value, name) => [
            `${value} ${speedUnit}`,
            name === 'currentMax' ? 'Current Max' : 
            name === 'proposedMax' ? 'Proposed Max' :
            name === 'currentMin' ? 'Current Min' : 'Proposed Min'
          ]}
        />
        <Legend />
        
        {/* Current Setup Lines */}
        <Line 
          type="monotone" 
          dataKey="currentMax" 
          stroke="var(--accent-blue)" 
          strokeWidth={2}
          dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 3 }}
          name="Current High Gear"
        />
        <Line 
          type="monotone" 
          dataKey="currentMin" 
          stroke="var(--accent-blue)" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 3 }}
          name="Current Low Gear"
        />
        
        {/* Proposed Setup Lines */}
        {showComparison && (
          <>
            <Line 
              type="monotone" 
              dataKey="proposedMax" 
              stroke="var(--accent-performance)" 
              strokeWidth={2}
              dot={{ fill: 'var(--accent-performance)', strokeWidth: 2, r: 3 }}
              name="Proposed High Gear"
            />
            <Line 
              type="monotone" 
              dataKey="proposedMin" 
              stroke="var(--accent-performance)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--accent-performance)', strokeWidth: 2, r: 3 }}
              name="Proposed Low Gear"
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Gear Range Bar Chart
function GearRangeChart({ current, proposed, showComparison }) {
  const data = [
    {
      name: 'Current',
      highGear: parseFloat(current.metrics.highRatio),
      lowGear: parseFloat(current.metrics.lowRatio),
      range: parseFloat(current.gearRange)
    }
  ];

  if (showComparison) {
    data.push({
      name: 'Proposed',
      highGear: parseFloat(proposed.metrics.highRatio),
      lowGear: parseFloat(proposed.metrics.lowRatio),
      range: parseFloat(proposed.gearRange)
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis dataKey="name" stroke="var(--text-tertiary)" />
        <YAxis stroke="var(--text-tertiary)" label={{ value: 'Gear Ratio', angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}
          formatter={(value, name) => [
            value.toFixed(2),
            name === 'highGear' ? 'High Gear Ratio' : 
            name === 'lowGear' ? 'Low Gear Ratio' : 
            `${value}% Range`
          ]}
        />
        <Legend />
        <Bar dataKey="highGear" fill="var(--accent-critical)" name="High Gear" />
        <Bar dataKey="lowGear" fill="var(--accent-performance)" name="Low Gear" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Chart Insights Section
function ChartInsights({ current, proposed, chartType, speedUnit }) {
  const insights = generateInsights(current, proposed, chartType, speedUnit);
  
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <h4 className="font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
        Chart Insights
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: insight.color }}
            >
              {insight.icon}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {insight.title}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {insight.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Functions
function generateChartData(current, proposed, speedUnit) {
  const cadenceRange = [60, 70, 80, 90, 100, 110, 120];
  
  const speedCadence = cadenceRange.map(cadence => {
    return {
      cadence,
      currentMax: calculateSpeed(current.metrics.highRatio, cadence, speedUnit),
      currentMin: calculateSpeed(current.metrics.lowRatio, cadence, speedUnit),
      proposedMax: calculateSpeed(proposed.metrics.highRatio, cadence, speedUnit),
      proposedMin: calculateSpeed(proposed.metrics.lowRatio, cadence, speedUnit)
    };
  });

  return { speedCadence };
}

function calculateSpeed(gearRatio, cadence, speedUnit) {
  // Simplified speed calculation: gear ratio * cadence * wheel circumference factor
  const wheelCircumference = 2.1; // meters (approximate for 700c wheel)
  const speedMS = (gearRatio * cadence * wheelCircumference) / 60; // m/s
  
  if (speedUnit.toLowerCase() === 'mph') {
    return (speedMS * 2.237).toFixed(1); // Convert to mph
  } else {
    return (speedMS * 3.6).toFixed(1); // Convert to km/h
  }
}

function generateInsights(current, proposed, chartType, speedUnit) {
  const insights = [];
  
  if (chartType === 'speed-cadence') {
    // Speed/Cadence insights
    const speedDiff = parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed);
    const climbingDiff = parseFloat(proposed.metrics.lowSpeed) - parseFloat(current.metrics.lowSpeed);
    
    if (speedDiff > 0.5) {
      insights.push({
        icon: '🚀',
        title: 'Higher Top Speed',
        description: `+${speedDiff.toFixed(1)} ${speedUnit} more top end`,
        color: 'var(--accent-performance)'
      });
    } else if (speedDiff < -0.5) {
      insights.push({
        icon: '⬇️',
        title: 'Lower Top Speed',
        description: `${speedDiff.toFixed(1)} ${speedUnit} less top end`,
        color: 'var(--accent-critical)'
      });
    }
    
    if (climbingDiff > 0.3) {
      insights.push({
        icon: '⛰️',
        title: 'Better Climbing',
        description: `Easier gear for hills`,
        color: 'var(--accent-performance)'
      });
    }
    
    insights.push({
      icon: '🎯',
      title: 'Sweet Spot',
      description: '85-95 RPM optimal for most riders',
      color: 'var(--accent-blue)'
    });
    
  } else {
    // Gear Range insights
    const rangeDiff = parseInt(proposed.gearRange) - parseInt(current.gearRange);
    
    if (rangeDiff > 20) {
      insights.push({
        icon: '📈',
        title: 'Wider Range',
        description: `+${rangeDiff}% more gear coverage`,
        color: 'var(--accent-performance)'
      });
    }
    
    insights.push({
      icon: '⚖️',
      title: 'Balance',
      description: 'High/low gear ratio balance',
      color: 'var(--accent-blue)'
    });
  }
  
  return insights;
}