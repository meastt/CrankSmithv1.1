// components/mobile/ResultsScreen.js - Mobile-optimized results display
import { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function ResultsScreen({
  results,
  speedUnit,
  bikeType,
  onSave,
  onBack,
  onNewCalculation
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Radar Chart Effect (must be called before any conditional returns)
  useEffect(() => {
    if (!results || !activeTab) return;
    const { current, proposed } = results;
    if (!current || !proposed || activeTab !== 'chart') return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Get actual values
    const currentValues = {
      topSpeed: parseFloat(current.metrics.highSpeed),
      climbingSpeed: parseFloat(current.metrics.lowSpeed),
      weight: current.totalWeight,
      gearRange: parseInt(current.gearRange)
    };

    const proposedValues = {
      topSpeed: parseFloat(proposed.metrics.highSpeed),
      climbingSpeed: parseFloat(proposed.metrics.lowSpeed),
      weight: proposed.totalWeight,
      gearRange: parseInt(proposed.gearRange)
    };

    // Find the ranges for proper scaling
    const maxTopSpeed = Math.max(currentValues.topSpeed, proposedValues.topSpeed) * 1.1;
    const maxClimbingSpeed = Math.max(currentValues.climbingSpeed, proposedValues.climbingSpeed) * 1.1;
    
    // For weight, we need the heaviest weight as our reference point
    const maxWeight = Math.max(currentValues.weight, proposedValues.weight);
    const minWeight = Math.min(currentValues.weight, proposedValues.weight);
    const weightRange = maxWeight - minWeight + 100; // Add buffer for scaling
    
    const maxGearRange = Math.max(currentValues.gearRange, proposedValues.gearRange) * 1.1;

    // Normalize to 0-100 scale properly
    const normalizeData = (values) => [
      (values.topSpeed / maxTopSpeed) * 100,
      (values.climbingSpeed / maxClimbingSpeed) * 100,
      // Invert weight: lighter weight = higher score on radar
      ((maxWeight + 100 - values.weight) / (maxWeight + 100 - minWeight + 100)) * 100,
      (values.gearRange / maxGearRange) * 100
    ];

    const data = {
      labels: ['Top Speed', 'Climbing', 'Weight', 'Range'],
      datasets: [
        {
          label: 'Current',
          data: normalizeData(currentValues),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
        },
        {
          label: 'Proposed',
          data: normalizeData(proposedValues),
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
        }
      ]
    };

    const config = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            pointLabels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 11,
                weight: '600'
              }
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              backdropColor: 'transparent',
              font: {
                size: 10
              },
              callback: function(value) {
                return Math.round(value) + '%';
              }
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12,
                weight: '600'
              },
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const metric = context.label;
                
                // Show actual values in tooltip
                let actualValue;
                if (metric === 'Top Speed') {
                  actualValue = context.datasetIndex === 0 ? 
                    currentValues.topSpeed : proposedValues.topSpeed;
                  return `${label}: ${actualValue.toFixed(1)} ${speedUnit}`;
                } else if (metric === 'Climbing') {
                  actualValue = context.datasetIndex === 0 ? 
                    currentValues.climbingSpeed : proposedValues.climbingSpeed;
                  return `${label}: ${actualValue.toFixed(1)} ${speedUnit}`;
                } else if (metric === 'Weight') {
                  actualValue = context.datasetIndex === 0 ? 
                    currentValues.weight : proposedValues.weight;
                  return `${label}: ${actualValue}g`;
                } else if (metric === 'Range') {
                  actualValue = context.datasetIndex === 0 ? 
                    currentValues.gearRange : proposedValues.gearRange;
                  return `${label}: ${actualValue}%`;
                }
                return `${label}: ${context.raw.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [current, proposed, speedUnit, activeTab]);

  if (!results) return null;

  const { current, proposed, comparison, compatibility } = results;

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
      title: 'Climbing',
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
      title: 'Range',
      icon: '📊',
      current: current.gearRange,
      proposed: proposed.gearRange,
      unit: '%',
      change: parseInt(proposed.gearRange) - parseInt(current.gearRange),
      isGoodWhenHigher: true
    }
  ];

  const getChangeColor = (change, isGoodWhenHigher) => {
    if (Math.abs(change) < 0.1) return '#666';
    const isPositive = change > 0;
    const isGood = isGoodWhenHigher ? isPositive : !isPositive;
    return isGood ? '#10B981' : '#EF4444';
  };

  const formatChange = (change, unit = '') => {
    const rounded = Math.round(change * 10) / 10;
    if (Math.abs(rounded) < 0.1) return '—';
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}${unit}`;
  };

  const generateBottomLine = () => {
    const weightChange = comparison?.weightChange || 0;
    const speedChange = comparison?.speedChange || 0;
    const rangeChange = comparison?.rangeChange || 0;
    
    let message = "Your proposed setup ";
    const benefits = [];
    
    if (weightChange < -10) benefits.push(`saves ${Math.abs(weightChange)}g`);
    if (speedChange > 0.3) benefits.push(`gives you ${speedChange.toFixed(1)} ${speedUnit} more top speed`);
    if (rangeChange > 20) benefits.push(`adds ${rangeChange}% more gear range`);
    
    if (benefits.length === 0) {
      return "offers similar performance with different characteristics.";
    }
    
    message += benefits.join(", ") + ". ";
    const majorBenefits = benefits.length >= 2 || Math.abs(weightChange) > 50;
    message += majorBenefits ? "Thats a solid improvement!" : "Minor improvement.";
    
    return message;
  };

  const handleShare = async () => {
    const shareText = `Check out my bike gear analysis on CrankSmith! ${generateBottomLine()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CrankSmith Gear Analysis',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'chart', label: 'Chart', icon: '📈' },
    { id: 'details', label: 'Details', icon: '🔍' },
    { id: 'compatibility', label: 'Compatibility', icon: '🔧' }
  ];

  return (
    <div className="mobile-screen results-screen" style={{ 
      padding: '0', 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <div className="results-header" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
        color: 'white',
        flexShrink: 0
      }}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white'
            }}
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Performance Analysis</h1>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'white'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
          </button>
        </div>

        {/* Bottom Line Summary */}
        <div className="bottom-line" style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <p className="text-base leading-relaxed">
            {generateBottomLine()}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="tab-btn"
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: activeTab === tab.id ? '#3B82F6' : '#999',
              fontSize: '14px',
              fontWeight: '600',
              borderBottom: `2px solid ${activeTab === tab.id ? '#3B82F6' : 'transparent'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content" style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '20px',
        minHeight: 0
      }}>
        {activeTab === 'overview' && (
          <div className="overview-tab space-y-6">
            {/* Metrics Grid */}
            <div className="metrics-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="metric-card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div className="metric-icon text-2xl mb-2">{metric.icon}</div>
                  <div className="metric-title text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>{metric.title}</div>
                  
                  <div className="metric-values space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-placeholder)' }}>Current</span>
                      <span className="font-mono text-white">{metric.current}{metric.unit}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-placeholder)' }}>Proposed</span>
                      <span className="font-mono text-white">{metric.proposed}{metric.unit}</span>
                    </div>
                    <div className="border-t pt-2" style={{ borderColor: 'var(--border-primary)' }}>
                      <div
                        className="text-lg font-bold"
                        style={{ color: getChangeColor(metric.change, metric.isGoodWhenHigher) }}
                      >
                        {formatChange(metric.change, metric.unit)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Component Summary */}
            <div className="component-summary">
              <h3 className="text-lg font-semibold mb-3 text-white">Component Changes</h3>
              <div className="space-y-3">
                <div className="component-row" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Crankset</div>
                  <div className="text-white font-medium">
                    {proposed.setup.crankset?.model} {proposed.setup.crankset?.variant}
                  </div>
                </div>
                <div className="component-row" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Cassette</div>
                  <div className="text-white font-medium">
                    {proposed.setup.cassette?.model} {proposed.setup.cassette?.variant}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="chart-tab space-y-6">
            {/* Chart Header */}
            <div className="chart-header text-center">
              <h3 className="text-lg font-semibold mb-2 text-white">Performance Comparison</h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Visual comparison of your setups</p>
            </div>

            {/* Chart Container */}
            <div className="chart-container" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                height: '280px',
                position: 'relative'
              }}>
                <canvas ref={chartRef} style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}></canvas>
              </div>
            </div>

            {/* Chart Explanation */}
            <div className="chart-explanation" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 className="font-medium text-white mb-2">How to read this chart:</h4>
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(59, 130, 246, 1)' }}></div>
                  <span>Current setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(16, 185, 129, 1)' }}></div>
                  <span>Proposed setup</span>
                </div>
                <p className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Larger area = better performance. Weight shows "better" (lighter = higher score).
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div className="text-2xl font-bold text-white">
                  {Math.round((parseFloat(proposed.metrics.highSpeed) / parseFloat(current.metrics.highSpeed)) * 100)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Top Speed</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div className="text-2xl font-bold text-white">
                  {Math.round((parseFloat(proposed.metrics.lowSpeed) / parseFloat(current.metrics.lowSpeed)) * 100)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Climbing</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-tab space-y-6">
            {/* Detailed Metrics */}
            <div className="detailed-metrics">
              <h3 className="text-lg font-semibold mb-4 text-white">Performance Details</h3>
              <div className="space-y-4">
                <div className="detail-card" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 className="font-medium text-white mb-3">Gear Ratios</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>High Ratio:</span>
                      <span className="font-mono text-white">
                        {current.metrics.highRatio} → {proposed.metrics.highRatio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Low Ratio:</span>
                      <span className="font-mono text-white">
                        {current.metrics.lowRatio} → {proposed.metrics.lowRatio}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-card" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 className="font-medium text-white mb-3">Speed Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Top Speed @ 90 RPM:</span>
                      <span className="font-mono text-white">
                        {proposed.metrics.highSpeed} {speedUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Climbing Speed @ 90 RPM:</span>
                      <span className="font-mono text-white">
                        {proposed.metrics.lowSpeed} {speedUnit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-card" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 className="font-medium text-white mb-3">Weight Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Total Weight:</span>
                      <span className="font-mono text-white">{proposed.totalWeight}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Weight Change:</span>
                      <span className="font-mono" style={{ 
                        color: getChangeColor(proposed.totalWeight - current.totalWeight, false) 
                      }}>
                        {formatChange(proposed.totalWeight - current.totalWeight, 'g')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div className="compatibility-tab">
            {compatibility ? (
              <div className="compatibility-status" style={{
                background: compatibility.status === 'compatible' ? 'rgba(16, 185, 129, 0.1)' : 
                           compatibility.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                           'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${compatibility.status === 'compatible' ? '#10B981' : 
                                   compatibility.status === 'warning' ? '#F59E0B' : '#EF4444'}`,
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="status-icon text-2xl">
                    {compatibility.status === 'compatible' ? '✅' : 
                     compatibility.status === 'warning' ? '⚠️' : '❌'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{compatibility.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{compatibility.message}</p>
                  </div>
                </div>

                {compatibility.criticalIssues && compatibility.criticalIssues.length > 0 && (
                  <div className="issues-section mb-4">
                    <h4 className="font-medium text-red-400 mb-2">Critical Issues:</h4>
                    {compatibility.criticalIssues.map((issue, index) => (
                      <div key={index} className="text-sm text-red-300 mb-1">• {issue}</div>
                    ))}
                  </div>
                )}

                {compatibility.minorWarnings && compatibility.minorWarnings.length > 0 && (
                  <div className="warnings-section mb-4">
                    <h4 className="font-medium text-yellow-400 mb-2">Considerations:</h4>
                    {compatibility.minorWarnings.map((warning, index) => (
                      <div key={index} className="text-sm text-yellow-300 mb-1">• {warning}</div>
                    ))}
                  </div>
                )}

                {compatibility.actionItems && compatibility.actionItems.length > 0 && (
                  <div className="recommendations-section">
                    <h4 className="font-medium text-blue-400 mb-2">Recommendations:</h4>
                    {compatibility.actionItems.map((item, index) => (
                      <div key={index} className="text-sm text-blue-300 mb-1">• {item}</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-compatibility" style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <div className="text-6xl mb-4">🔧</div>
                <p>No compatibility analysis available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions" style={{
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="action-buttons" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <button
            onClick={onSave}
            className="save-btn"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Save
          </button>
          <button
            onClick={onNewCalculation}
            className="new-calc-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New
          </button>
        </div>
      </div>

      {/* Share Menu */}
      {showShareMenu && (
        <div 
          className="share-menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'flex-end'
          }}
          onClick={() => setShowShareMenu(false)}
        >
          <div 
            className="share-panel"
            style={{
              width: '100%',
              background: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '20px 20px 0 0',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="share-header mb-4">
              <h3 className="text-lg font-semibold text-white text-center">Share Results</h3>
            </div>
            <div className="share-options space-y-3">
              <button
                onClick={handleShare}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                Share Analysis
              </button>
              <button
                onClick={handleCopyLink}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}