// components/SimulationResults.js - Enhanced results with real-world performance context and mobile optimization
// UPDATED: Added practical context, terrain analysis, and mobile-friendly performance insights

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
    if (Math.abs(value) < 0.1) return 'var(--text-tertiary)';
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

  // Generate gear-by-gear breakdown with real-world context
  const generateGearBreakdown = (setup) => {
    const { crankset, cassette } = setup.setup;
    if (!crankset?.teeth || !cassette?.teeth) return [];

    const gears = [];
    crankset.teeth.forEach((chainring, cIndex) => {
      cassette.teeth.forEach((cog, cassetteIndex) => {
        const ratio = chainring / cog;
        const speed = calculateSpeedAtRatio(ratio, 90, speedUnit);
        const gearInches = ratio * 27; // Approximate for 700c
        const terrainContext = getTerrainContext(ratio, bikeType);
        const cadenceContext = getCadenceContext(ratio, speedUnit);
        
        gears.push({
          id: `${chainring}-${cog}`,
          chainring,
          cog,
          ratio: ratio.toFixed(2),
          speed: speed.toFixed(1),
          gearInches: gearInches.toFixed(0),
          position: cIndex * cassette.teeth.length + cassetteIndex + 1,
          usage: categorizeGear(ratio, bikeType),
          terrainContext,
          cadenceContext
        });
      });
    });

    return gears.sort((a, b) => b.ratio - a.ratio);
  };

  // Real-world terrain context
  const getTerrainContext = (ratio, bikeType) => {
    const contexts = {
      road: {
        low: { threshold: 2.5, terrain: '12%+ climbs', description: 'Steep road climbs' },
        medium: { threshold: 3.5, terrain: '3-8% grades', description: 'Rolling hills' },
        high: { threshold: 999, terrain: 'Flats/descents', description: 'High speed sections' }
      },
      gravel: {
        low: { threshold: 2.0, terrain: '15%+ loose climbs', description: 'Technical ascents' },
        medium: { threshold: 3.0, terrain: 'Mixed terrain', description: 'Adventure pace' },
        high: { threshold: 999, terrain: 'Fire roads', description: 'Fast gravel sections' }
      },
      mtb: {
        low: { threshold: 1.5, terrain: '20%+ technical', description: 'Rock gardens' },
        medium: { threshold: 2.5, terrain: 'Singletrack', description: 'Trail flow' },
        high: { threshold: 999, terrain: 'XC racing', description: 'Fast sections' }
      }
    };

    const typeContexts = contexts[bikeType] || contexts.road;
    
    if (ratio <= typeContexts.low.threshold) {
      return { terrain: typeContexts.low.terrain, description: typeContexts.low.description };
    } else if (ratio <= typeContexts.medium.threshold) {
      return { terrain: typeContexts.medium.terrain, description: typeContexts.medium.description };
    } else {
      return { terrain: typeContexts.high.terrain, description: typeContexts.high.description };
    }
  };

  // Cadence context for different speeds
  const getCadenceContext = (ratio, speedUnit) => {
    const speed80rpm = calculateSpeedAtRatio(ratio, 80, speedUnit);
    const speed100rpm = calculateSpeedAtRatio(ratio, 100, speedUnit);
    
    return {
      comfortable: `${speed80rpm.toFixed(1)} ${speedUnit} @ 80rpm`,
      pushing: `${speed100rpm.toFixed(1)} ${speedUnit} @ 100rpm`,
      efficient: calculateOptimalCadence(ratio, speedUnit)
    };
  };

  const calculateOptimalCadence = (ratio, speedUnit) => {
    // Optimal cadence varies by gear ratio and bike type
    if (ratio < 2.0) return '75-85rpm (climbing)';
    if (ratio < 3.5) return '85-95rpm (cruising)';
    return '90-100rpm (speed)';
  };

  const currentGears = generateGearBreakdown(current);
  const proposedGears = generateGearBreakdown(proposed);

  // Enhanced performance analysis
  const generatePerformanceInsights = () => {
    const insights = [];
    const speedChange = parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed);
    const climbingChange = parseFloat(proposed.metrics.lowSpeed) - parseFloat(current.metrics.lowSpeed);
    const weightChange = proposed.totalWeight - current.totalWeight;
    const rangeChange = parseInt(proposed.gearRange) - parseInt(current.gearRange);

    // Speed insights
    if (speedChange > 1) {
      insights.push({
        type: 'improvement',
        icon: '🚀',
        title: 'Significant Speed Gain',
        description: `Your new setup gives you ${speedChange.toFixed(1)} ${speedUnit} more top speed. You'll notice this on descents and when chasing down breakaways.`,
        impact: 'high'
      });
    } else if (speedChange < -1) {
      insights.push({
        type: 'tradeoff',
        icon: '⚖️',
        title: 'Speed vs Other Benefits',
        description: `You're trading ${Math.abs(speedChange).toFixed(1)} ${speedUnit} of top speed for other improvements. Consider if this fits your riding style.`,
        impact: 'medium'
      });
    }

    // Climbing insights  
    if (climbingChange > 0.5) {
      insights.push({
        type: 'improvement',
        icon: '⛰️',
        title: 'Better Climbing Power',
        description: `Your easiest gear is now ${climbingChange.toFixed(1)} ${speedUnit} faster at the same effort. Steep climbs will feel more manageable.`,
        impact: 'high'
      });
    }

    // Weight insights
    if (weightChange < -100) {
      insights.push({
        type: 'improvement',
        icon: '🪶',
        title: 'Meaningful Weight Savings',
        description: `Saving ${Math.abs(weightChange)}g is equivalent to removing about ${Math.round(Math.abs(weightChange)/28)} standard water bottles from your bike.`,
        impact: 'medium'
      });
    } else if (weightChange > 100) {
      insights.push({
        type: 'consideration',
        icon: '⚖️',
        title: 'Weight Increase',
        description: `Adding ${weightChange}g is noticeable on climbs. Make sure the performance benefits justify the extra weight.`,
        impact: 'medium'
      });
    }

    // Range insights
    if (rangeChange > 30) {
      insights.push({
        type: 'improvement',
        icon: '📏',
        title: 'Dramatically Wider Range',
        description: `${rangeChange}% more gear range opens up new terrain possibilities. Perfect for adventure riding and varied conditions.`,
        impact: 'high'
      });
    }

    // Terrain-specific insights
    const terrainInsight = getTerrainSpecificInsight(bikeType, proposed);
    if (terrainInsight) {
      insights.push(terrainInsight);
    }

    return insights;
  };

  const getTerrainSpecificInsight = (bikeType, proposedSetup) => {
    const lowRatio = parseFloat(proposedSetup.metrics.lowRatio);
    const highRatio = parseFloat(proposedSetup.metrics.highRatio);

    switch (bikeType) {
      case 'road':
        if (lowRatio < 1.8) {
          return {
            type: 'terrain',
            icon: '🏔️',
            title: 'Alpine-Ready Gearing',
            description: 'Your lowest gear handles 15%+ climbs comfortably. Perfect for mountain stages and steep European climbs.',
            impact: 'high'
          };
        }
        break;
      case 'gravel':
        if (lowRatio < 1.5 && highRatio > 3.0) {
          return {
            type: 'terrain',
            icon: '🌄',
            title: 'Adventure-Optimized Range',
            description: 'Ideal for bikepacking and mixed terrain. Handles technical climbs and still efficient on road sections.',
            impact: 'high'
          };
        }
        break;
      case 'mtb':
        if (lowRatio < 1.2) {
          return {
            type: 'terrain',
            icon: '🪨',
            title: 'Technical Climbing Machine',
            description: 'Your lowest gear conquers 25%+ grades with traction. Perfect for rock gardens and technical ascents.',
            impact: 'high'
          };
        }
        break;
    }
    return null;
  };

  const performanceInsights = generatePerformanceInsights();

  const MetricCard = ({ 
    title, 
    currentValue, 
    proposedValue, 
    change, 
    unit = '', 
    isGoodWhenLower = false,
    icon,
    context
  }) => {
    const changeColor = getChangeColor(change, isGoodWhenLower);
    
    return (
      <div className="card text-center p-6">
        <div className="flex items-center justify-center mb-4 w-12 h-12 mx-auto" style={{ color: 'var(--accent-blue)' }}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>Current</span>
            <span className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {currentValue}{unit}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>Proposed</span>
            <span className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {proposedValue}{unit}
            </span>
          </div>
          
          <div className="border-t pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: changeColor }}
            >
              {formatChange(change, unit)}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-quaternary)' }}>
              Change
            </div>
          </div>

          {/* Real-world context */}
          {context && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {context}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={resultsRef} className="space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Performance Analysis
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
          Real-world performance impact with terrain-specific insights
        </p>
      </div>

      {/* Performance Insights Cards */}
      {performanceInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceInsights.map((insight, index) => (
              <div key={index} 
                   className="p-4 rounded-lg border"
                   style={{ 
                     background: insight.type === 'improvement' ? 'rgba(0, 166, 81, 0.1)' : 
                                insight.type === 'consideration' ? 'rgba(255, 105, 0, 0.1)' : 
                                'var(--surface-elevated)',
                     borderColor: insight.type === 'improvement' ? 'var(--success-green)' : 
                                 insight.type === 'consideration' ? 'var(--warning-orange)' : 
                                 'var(--border-subtle)'
                   }}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{insight.icon}</div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      {insight.title}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Overview - Key Metrics with Context */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard
            title="Top Speed"
            currentValue={current.metrics.highSpeed}
            proposedValue={proposed.metrics.highSpeed}
            change={parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed)}
            unit={` ${speedUnit}`}
            context={`At 90rpm: ${proposed.metrics.highSpeed} ${speedUnit}`}
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
            context={getClimbingContext(parseFloat(proposed.metrics.lowRatio), bikeType)}
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
            context={getWeightContext(proposed.totalWeight - current.totalWeight)}
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
            context={getRangeContext(parseInt(proposed.gearRange), bikeType)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
      )}

      {/* All Gears View with Enhanced Context */}
      {activeView === 'gears' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Proposed Setup - All Gears
            </h3>
            <EnhancedGearTable gears={proposedGears} speedUnit={speedUnit} />
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Current Setup - All Gears
            </h3>
            <EnhancedGearTable gears={currentGears} speedUnit={speedUnit} />
          </div>
        </div>
      )}

      {/* Side by Side Comparison */}
      {activeView === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Current Setup
            </h3>
            <div className="space-y-4">
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>
                {current.metrics.highSpeed} {speedUnit}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Top speed • {currentGears.length} total gears
              </div>
              <EnhancedGearTable gears={currentGears.slice(0, 6)} speedUnit={speedUnit} compact />
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Proposed Setup
            </h3>
            <div className="space-y-4">
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-performance)' }}>
                {proposed.metrics.highSpeed} {speedUnit}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Top speed • {proposedGears.length} total gears
              </div>
              <EnhancedGearTable gears={proposedGears.slice(0, 6)} speedUnit={speedUnit} compact />
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
                {generateBottomLine(comparison, speedUnit, bikeType)}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ background: 'var(--accent-performance)' }}></div>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-performance)' }}>
                    ✓ Setup analyzed and optimized
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

// Enhanced Gear Table with real-world context
function EnhancedGearTable({ gears, speedUnit, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th className="text-left py-2 px-3">Gear</th>
            <th className="text-right py-2 px-3">Ratio</th>
            <th className="text-right py-2 px-3">Speed @ 90rpm</th>
            {!compact && <th className="text-right py-2 px-3">Best For</th>}
            {!compact && <th className="text-right py-2 px-3">Cadence Range</th>}
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
                  <span className="font-mono">{gear.chainring}T × {gear.cog}T</span>
                </div>
              </td>
              <td className="text-right py-2 px-3 font-mono">{gear.ratio}</td>
              <td className="text-right py-2 px-3 font-mono font-semibold">
                {gear.speed} {speedUnit}
              </td>
              {!compact && (
                <td className="text-right py-2 px-3 text-xs">
                  {gear.terrainContext?.terrain}
                </td>
              )}
              {!compact && (
                <td className="text-right py-2 px-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {gear.cadenceContext?.efficient}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper context functions
function getClimbingContext(lowRatio, bikeType) {
  if (lowRatio < 1.2) return 'Conquers 20%+ grades';
  if (lowRatio < 1.8) return 'Handles 12-15% climbs';
  if (lowRatio < 2.2) return 'Good for 8-12% grades';
  return 'Best for rolling terrain';
}

function getWeightContext(weightChange) {
  if (Math.abs(weightChange) < 50) return 'Minimal weight impact';
  if (weightChange < -100) return `Saves ~${Math.round(Math.abs(weightChange)/28)} water bottles worth`;
  if (weightChange > 100) return `Adds ~${Math.round(weightChange/28)} water bottles worth`;
  return 'Moderate weight change';
}

function getRangeContext(gearRange, bikeType) {
  const excellent = bikeType === 'mtb' ? 450 : bikeType === 'gravel' ? 350 : 300;
  const good = bikeType === 'mtb' ? 350 : bikeType === 'gravel' ? 280 : 250;
  
  if (gearRange >= excellent) return 'Excellent for varied terrain';
  if (gearRange >= good) return 'Good range for most riding';
  return 'Limited range - specialized use';
}

// Helper Functions (keeping existing)
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

function generateBottomLine(comparison, speedUnit, bikeType) {
  const weightChange = comparison?.weightChange || 0;
  const speedChange = comparison?.speedChange || 0;
  const rangeChange = comparison?.rangeChange || 0;
  
  let message = "Your proposed setup ";
  const benefits = [];
  
  if (weightChange < -50) benefits.push(`saves ${Math.abs(weightChange)}g`);
  if (speedChange > 0.5) benefits.push(`gives you ${speedChange.toFixed(1)} ${speedUnit} more top speed`);
  if (rangeChange > 25) benefits.push(`adds ${rangeChange}% more gear range for varied terrain`);
  
  // Add terrain-specific benefits
  if (bikeType === 'gravel' && rangeChange > 30) {
    benefits.push('opens up new adventure possibilities');
  } else if (bikeType === 'mtb' && rangeChange > 40) {
    benefits.push('handles more technical terrain');
  } else if (bikeType === 'road' && speedChange > 1) {
    benefits.push('noticeable in group rides and races');
  }
  
  if (benefits.length === 0) {
    return `Your proposed setup offers similar performance with different characteristics. The changes are subtle but may better match your specific riding style and terrain.`;
  }
  
  message += benefits.slice(0, 3).join(", ") + ". ";
  
  const majorBenefits = benefits.length >= 2 || Math.abs(weightChange) > 100 || speedChange > 1.5;
  message += majorBenefits ? "This is a meaningful upgrade worth considering." : "Minor improvements - evaluate based on your priorities and budget.";
  
  return message;
}