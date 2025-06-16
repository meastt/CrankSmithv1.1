import { useRef, useEffect } from 'react';

export default function SimulationResults({ results, speedUnit, bikeType }) {
  const resultsRef = useRef(null);

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
        <h2 className="text-4xl font-bold mb-4 section-title-fire" style={{ color: 'var(--text-primary)' }}>
          Performance Analysis
        </h2>
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
    </div>
  );
} 