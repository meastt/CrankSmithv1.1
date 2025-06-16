// Enhanced SimulationResults.js with gear-by-gear breakdown and improved views
import { useRef, useEffect, useState } from 'react';

export default function SimulationResults({ results, speedUnit, bikeType }) {
  const resultsRef = useRef(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const { current, proposed, comparison } = results;

  // Enhanced color logic for changes
  const getChangeColor = (value, isGoodWhenLower = false) => {
    if (Math.abs(value) < 0.1) return 'var(--text-tertiary)'; // Neutral gray for minimal change
    const isPositive = value > 0;
    const isGood = isGoodWhenLower ? !isPositive : isPositive;
    return isGood ? 'var(--accent-performance)' : 'var(--accent-critical)';
  };

  const formatChange = (value, unit = '', showPlus = true) => {
    const rounded = Math.round(value * 10) / 10;
    if (Math.abs(rounded) < 0.1) return '—';
    const sign = showPlus && rounded > 0 ? '+' : '';
    return `${sign}${rounded}${unit}`;
  };

  // Generate gear-by-gear breakdown
  const generateGearBreakdown = (setup) => {
    const { crankset, cassette } = setup.setup;
    if (!crankset?.teeth || !cassette?.teeth) return [];

    const gears = [];
    crankset.teeth.forEach((chainring, cIndex) => {
      cassette.teeth.forEach((cog, cassetteIndex) => {
        const ratio = chainring / cog;
        const speed = calculateSpeedAtRatio(ratio, 90, speedUnit); // 90 RPM
        const gearInches = ratio * 27; // Approximate for 700c
        
        gears.push({
          id: `${chainring}-${cog}`,
          chainring,
          cog,
          ratio: ratio.toFixed(2),
          speed: speed.toFixed(1),
          gearInches: gearInches.toFixed(0),
          position: cIndex * cassette.teeth.length + cassetteIndex + 1,
          usage: categorizeGear(ratio, bikeType)
        });
      });
    });

    return gears.sort((a, b) => b.ratio - a.ratio); // Sort by ratio, highest first
  };

  const currentGears = generateGearBreakdown(current);
  const proposedGears = generateGearBreakdown(proposed);

  const MetricCard = ({ 
    title, 
    currentValue, 
    proposedValue, 
    change, 
    unit = '', 
    isGoodWhenLower = false,
    icon 
  }) => {
    const changeColor = getChangeColor(change, isGoodWhenLower);
    
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
    );
  };

  return (
    <div ref={resultsRef} className="space-y-12">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Performance Analysis
        </h2>
        <p className="text-xl" style={{ color: 'var(--text-tertiary)' }}>
          Compare your setups and understand the performance impact
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="flex rounded-xl p-1" 
             style={{ 
               background: 'var(--surface-primary)', 
               border: '1px solid var(--border-subtle)' 
             }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'gears', label: 'All Gears' },
            { key: 'comparison', label: 'Side by Side' }
          ].map(view => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === view.key 
                  ? 'text-white shadow-sm' 
                  : 'hover:opacity-70'
              }`}
              style={{
                background: activeView === view.key 
                  ? 'var(--accent-blue)' 
                  : 'transparent',
                color: activeView === view.key ? 'white' : 'var(--text-secondary)'
              }}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview - Key Metrics */}
      {activeView === 'overview' && (
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
      )}

      {/* All Gears View */}
      {activeView === 'gears' && (
        <div className="space-y-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Proposed Setup - All Gears
            </h3>
            <GearTable gears={proposedGears} speedUnit={speedUnit} />
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Current Setup - All Gears
            </h3>
            <GearTable gears={currentGears} speedUnit={speedUnit} />
          </div>
        </div>
      )}

      {/* Side by Side Comparison */}
      {activeView === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Current Setup
            </h3>
            <div className="space-y-4">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-blue)' }}>
                {current.metrics.highSpeed} {speedUnit}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Top speed • {currentGears.length} total gears
              </div>
              <GearTable gears={currentGears.slice(0, 6)} speedUnit={speedUnit} compact />
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Proposed Setup
            </h3>
            <div className="space-y-4">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-performance)' }}>
                {proposed.metrics.highSpeed} {speedUnit}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Top speed • {proposedGears.length} total gears
              </div>
              <GearTable gears={proposedGears.slice(0, 6)} speedUnit={speedUnit} compact />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Line Analysis */}
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
                {generateBottomLine(comparison, speedUnit)}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ background: 'var(--accent-performance)' }}></div>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-performance)' }}>
                    ✓ Components are compatible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function GearTable({ gears, speedUnit, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th className="text-left py-2 px-3">Gear</th>
            <th className="text-right py-2 px-3">Ratio</th>
            <th className="text-right py-2 px-3">Speed @ 90rpm</th>
            {!compact && <th className="text-right py-2 px-3">Usage</th>}
          </tr>
        </thead>
        <tbody>
          {gears.map((gear, index) => (
            <tr key={gear.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td className="py-2 px-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ background: gear.usage.color }}
                  ></div>
                  <span>{gear.chainring}T × {gear.cog}T</span>
                </div>
              </td>
              <td className="text-right py-2 px-3 font-mono">{gear.ratio}</td>
              <td className="text-right py-2 px-3 font-mono">{gear.speed} {speedUnit}</td>
              {!compact && <td className="text-right py-2 px-3">{gear.usage.label}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper Functions
function calculateSpeedAtRatio(gearRatio, cadence, speedUnit) {
  const wheelCircumference = 2.1; // meters (700c approximation)
  const speedMS = (gearRatio * cadence * wheelCircumference) / 60;
  
  if (speedUnit.toLowerCase() === 'mph') {
    return speedMS * 2.237;
  } else {
    return speedMS * 3.6;
  }
}

function categorizeGear(ratio, bikeType) {
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
    return "Your proposed setup offers similar performance with different characteristics.";
  }
  
  message += benefits.join(", ") + ". ";
  const majorBenefits = benefits.length >= 2 || Math.abs(weightChange) > 50;
  message += majorBenefits ? "Worth the upgrade." : "Minor improvement - consider your priorities.";
  
  return message;
}