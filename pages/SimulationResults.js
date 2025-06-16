// SimulationResults.js - Performance output with gear analysis
import React, { useState } from 'react';

export default function SimulationResults({ 
  results, 
  speedUnit = 'mph',
  bikeType,
  onSave,
  showComparison = true 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!results) return null;

  const { current, proposed, comparison } = results;

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Performance Analysis
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
          {showComparison ? 'Compare your setups' : 'Gear performance breakdown'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex rounded-xl p-1" 
             style={{ 
               background: 'var(--surface-primary)', 
               border: '1px solid var(--border-subtle)' 
             }}>
          {['overview', 'gears', 'technical'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab 
                  ? 'text-white shadow-sm' 
                  : 'hover:opacity-70'
              }`}
              style={{
                background: activeTab === tab 
                  ? 'var(--accent-blue)' 
                  : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          current={current} 
          proposed={proposed} 
          comparison={comparison}
          speedUnit={speedUnit}
          showComparison={showComparison}
          onSave={onSave}
        />
      )}
      
      {activeTab === 'gears' && (
        <GearsTab 
          current={current} 
          proposed={proposed} 
          speedUnit={speedUnit}
          bikeType={bikeType}
        />
      )}
      
      {activeTab === 'technical' && (
        <TechnicalTab 
          current={current} 
          proposed={proposed} 
          comparison={comparison}
        />
      )}
    </div>
  );
}

// Overview Tab - Key metrics and bottom line
function OverviewTab({ current, proposed, comparison, speedUnit, showComparison, onSave }) {
  const metrics = [
    {
      title: 'Top Speed',
      icon: '⚡',
      current: current.metrics.highSpeed,
      proposed: proposed.metrics.highSpeed,
      unit: ` ${speedUnit}`,
      change: parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed),
      isGoodWhenHigher: true
    },
    {
      title: 'Climbing Speed',
      icon: '⛰️',
      current: current.metrics.lowSpeed,
      proposed: proposed.metrics.lowSpeed,
      unit: ` ${speedUnit}`,
      change: parseFloat(proposed.metrics.lowSpeed) - parseFloat(current.metrics.lowSpeed),
      isGoodWhenHigher: true
    },
    {
      title: 'Weight',
      icon: '⚖️',
      current: current.totalWeight,
      proposed: proposed.totalWeight,
      unit: 'g',
      change: proposed.totalWeight - current.totalWeight,
      isGoodWhenHigher: false
    },
    {
      title: 'Gear Range',
      icon: '📊',
      current: current.gearRange,
      proposed: proposed.gearRange,
      unit: '%',
      change: parseInt(proposed.gearRange) - parseInt(current.gearRange),
      isGoodWhenHigher: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} showComparison={showComparison} />
        ))}
      </div>

      {/* Bottom Line Analysis */}
      <BottomLineCard 
        comparison={comparison} 
        speedUnit={speedUnit}
        onSave={onSave}
      />
    </div>
  );
}

// Gears Tab - Individual gear analysis with color coding
function GearsTab({ current, proposed, speedUnit, bikeType }) {
  return (
    <div className="space-y-8">
      {/* Current Setup Gears */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Current Setup Gears
        </h3>
        <GearTable gears={current.gears} speedUnit={speedUnit} bikeType={bikeType} />
      </div>

      {/* Proposed Setup Gears */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Proposed Setup Gears
        </h3>
        <GearTable gears={proposed.gears} speedUnit={speedUnit} bikeType={bikeType} />
      </div>

      {/* Gear Analysis Legend */}
      <div className="card">
        <h4 className="font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          Gear Analysis Key
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ background: 'var(--accent-performance)' }}></div>
            <span>Climbing gears (ideal for hills)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ background: 'var(--accent-blue)' }}></div>
            <span>All-around gears (versatile)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ background: 'var(--accent-critical)' }}></div>
            <span>Sprint gears (high speed)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Technical Tab - Detailed calculations
function TechnicalTab({ current, proposed, comparison }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gear Ratios */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Gear Ratios
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-tertiary)' }}>High Ratio:</span>
              <span className="font-mono">
                {current.metrics.highRatio} → {proposed.metrics.highRatio}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-tertiary)' }}>Low Ratio:</span>
              <span className="font-mono">
                {current.metrics.lowRatio} → {proposed.metrics.lowRatio}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-tertiary)' }}>Range:</span>
              <span className="font-mono">
                {((current.metrics.highRatio / current.metrics.lowRatio) * 100).toFixed(0)}% → 
                {((proposed.metrics.highRatio / proposed.metrics.lowRatio) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            System Requirements
          </h3>
          <div className="space-y-3 text-sm">
            <RequirementItem 
              label="Chain Compatibility" 
              status="compatible" 
              detail="11-speed compatible"
            />
            <RequirementItem 
              label="Derailleur Capacity" 
              status="compatible" 
              detail="Within normal range"
            />
            <RequirementItem 
              label="Freehub Compatibility" 
              status="compatible" 
              detail="Standard HG/XDR"
            />
          </div>
        </div>
      </div>

      {/* Calculation Notes */}
      <div className="text-xs pt-4" 
           style={{ 
             color: 'var(--text-quaternary)',
             borderTop: '1px solid var(--border-subtle)' 
           }}>
        <p>
          Calculations based on 90 RPM cadence, standard rolling resistance, and wheel circumference. 
          Gear inches calculated as (chainring teeth ÷ cassette teeth) × wheel diameter.
        </p>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ title, icon, current, proposed, unit, change, isGoodWhenHigher, showComparison }) {
  const changeColor = getChangeColor(change, !isGoodWhenHigher);
  
  return (
    <div className="card text-center p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
      
      {showComparison ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
            <span className="font-mono font-semibold">{current}{unit}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
            <span className="font-mono font-semibold">{proposed}{unit}</span>
          </div>
          <div className="border-t pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-2xl font-bold" style={{ color: changeColor }}>
              {formatChange(change, unit)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
          {proposed}{unit}
        </div>
      )}
    </div>
  );
}

function BottomLineCard({ comparison, speedUnit, onSave }) {
  const bottomLine = generateBottomLine(comparison, speedUnit);
  
  return (
    <div className="card">
      <div 
        className="p-6 rounded-xl"
        style={{ 
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
          border: '1px solid var(--accent-blue)'
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
              color: 'white'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Bottom Line
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {bottomLine.message}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" 
                     style={{ background: 'var(--accent-performance)' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--accent-performance)' }}>
                  ✓ Components are compatible
                </span>
              </div>
              {onSave && (
                <button
                  onClick={onSave}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Save to Garage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GearTable({ gears, speedUnit, bikeType }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th className="text-left py-2 px-3">Gear</th>
            <th className="text-right py-2 px-3">Ratio</th>
            <th className="text-right py-2 px-3">Speed @ 90rpm</th>
            <th className="text-right py-2 px-3">Use Case</th>
          </tr>
        </thead>
        <tbody>
          {gears?.map((gear, index) => {
            const gearType = categorizeGear(gear.ratio, bikeType);
            return (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="py-2 px-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ background: gearType.color }}
                    ></div>
                    <span>{gear.chainring}T × {gear.cassette}T</span>
                  </div>
                </td>
                <td className="text-right py-2 px-3 font-mono">{gear.ratio}</td>
                <td className="text-right py-2 px-3 font-mono">{gear.speed} {speedUnit}</td>
                <td className="text-right py-2 px-3">{gearType.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RequirementItem({ label, status, detail }) {
  const statusColor = status === 'compatible' ? 'var(--accent-performance)' : 'var(--accent-critical)';
  const statusIcon = status === 'compatible' ? '✓' : '⚠';
  
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: 'var(--text-tertiary)' }}>{label}:</span>
      <div className="flex items-center space-x-2">
        <span style={{ color: statusColor }}>{statusIcon}</span>
        <span className="text-xs">{detail}</span>
      </div>
    </div>
  );
}

// Helper Functions
function getChangeColor(value, isGoodWhenLower = false) {
  if (Math.abs(value) < 0.1) return 'var(--text-tertiary)';
  const isPositive = value > 0;
  const isGood = isGoodWhenLower ? !isPositive : isPositive;
  return isGood ? 'var(--accent-performance)' : 'var(--accent-critical)';
}

function formatChange(value, unit = '') {
  const rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded) < 0.1) return '—';
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}${unit}`;
}

function generateBottomLine(comparison, speedUnit) {
  const weightChange = comparison?.weightChange || 0;
  const speedChange = comparison?.speedChange || 0;
  const rangeChange = comparison?.rangeChange || 0;
  
  let message = "Your proposed setup ";
  const benefits = [];
  
  if (weightChange < -10) benefits.push(`saves ${Math.abs(weightChange)}g`);
  if (speedChange > 0.3) benefits.push(`gives you ${speedChange.toFixed(1)} ${speedUnit} more top speed`);
  if (rangeChange > 20) benefits.push(`adds ${rangeChange}% more gear range`);
  
  if (benefits.length === 0) {
    return { message: "Your proposed setup offers similar performance with different characteristics." };
  }
  
  message += benefits.join(", ") + ". ";
  const majorBenefits = benefits.length >= 2 || Math.abs(weightChange) > 50;
  message += majorBenefits ? "Worth the upgrade." : "Minor improvement - consider your priorities.";
  
  return { message };
}

function categorizeGear(ratio, bikeType) {
  // Simplified gear categorization based on bike type and ratio
  const thresholds = {
    road: { climbing: 2.5, sprint: 4.0 },
    gravel: { climbing: 2.0, sprint: 3.5 },
    mtb: { climbing: 1.5, sprint: 2.5 }
  };
  
  const threshold = thresholds[bikeType] || thresholds.road;
  
  if (ratio < threshold.climbing) {
    return { label: 'Climbing', color: 'var(--accent-performance)' };
  } else if (ratio > threshold.sprint) {
    return { label: 'Sprint', color: 'var(--accent-critical)' };
  } else {
    return { label: 'All-around', color: 'var(--accent-blue)' };
  }
}