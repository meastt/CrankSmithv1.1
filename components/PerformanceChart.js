// PerformanceChart.js - OPTIMIZED VERSION
import React, { useRef, useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';

export default function PerformanceChart({ current, proposed, speedUnit = 'mph' }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    if (!current || !proposed) return null;

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
    const maxWeight = Math.max(currentValues.weight, proposedValues.weight);
    const minWeight = Math.min(currentValues.weight, proposedValues.weight);
    const maxGearRange = Math.max(currentValues.gearRange, proposedValues.gearRange) * 1.1;

    // Normalize to 0-100 scale
    const normalizeData = (values) => [
      (values.topSpeed / maxTopSpeed) * 100,
      (values.climbingSpeed / maxClimbingSpeed) * 100,
      // Invert weight: lighter weight = higher score
      ((maxWeight + 100 - values.weight) / (maxWeight + 100 - minWeight + 100)) * 100,
      (values.gearRange / maxGearRange) * 100
    ];

    return {
      labels: ['Top Speed', 'Climbing Speed', 'Weight (Better)', 'Gear Range'],
      datasets: [
        {
          label: 'Current Setup',
          data: normalizeData(currentValues),
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          borderColor: 'rgba(0, 122, 255, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(0, 122, 255, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 122, 255, 1)'
        },
        {
          label: 'Proposed Setup',
          data: normalizeData(proposedValues),
          backgroundColor: 'rgba(88, 86, 214, 0.2)',
          borderColor: 'rgba(88, 86, 214, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(88, 86, 214, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(88, 86, 214, 1)'
        }
      ],
      currentValues,
      proposedValues
    };
  }, [current, proposed]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => {
    if (!chartData) return null;

    return {
      type: 'radar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500 // Faster animation
        },
        scales: {
          r: {
            angleLines: {
              color: 'rgba(128, 128, 128, 0.2)'
            },
            grid: {
              color: 'rgba(128, 128, 128, 0.2)'
            },
            pointLabels: {
              color: 'var(--text-secondary)',
              font: {
                size: 12
              }
            },
            ticks: {
              color: 'var(--text-tertiary)',
              backdropColor: 'transparent',
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
            labels: {
              color: 'var(--text-secondary)',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const metric = context.label;
                
                // Show actual values in tooltip
                let actualValue;
                if (metric === 'Top Speed') {
                  actualValue = context.datasetIndex === 0 ? 
                    chartData.currentValues.topSpeed : chartData.proposedValues.topSpeed;
                  return `${label}: ${actualValue.toFixed(1)} ${speedUnit}`;
                } else if (metric === 'Climbing Speed') {
                  actualValue = context.datasetIndex === 0 ? 
                    chartData.currentValues.climbingSpeed : chartData.proposedValues.climbingSpeed;
                  return `${label}: ${actualValue.toFixed(1)} ${speedUnit}`;
                } else if (metric === 'Weight (Better)') {
                  actualValue = context.datasetIndex === 0 ? 
                    chartData.currentValues.weight : chartData.proposedValues.weight;
                  return `${label}: ${actualValue}g`;
                } else if (metric === 'Gear Range') {
                  actualValue = context.datasetIndex === 0 ? 
                    chartData.currentValues.gearRange : chartData.proposedValues.gearRange;
                  return `${label}: ${actualValue}%`;
                }
                return `${label}: ${context.raw.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };
  }, [chartData, speedUnit]);

  useEffect(() => {
    if (!chartConfig || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartConfig]);

  if (!chartData) return null;

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Performance Comparison
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Visual comparison of your current vs proposed setup
        </p>
      </div>
      
      <div className="relative" style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      <div className="mt-4 pt-4 text-xs" 
           style={{ 
             borderTop: '1px solid var(--border-subtle)',
             color: 'var(--text-quaternary)' 
           }}>
        <p>
          Larger area = better performance. Weight shows "better" (lighter = higher score).
        </p>
      </div>
    </div>
  );
}