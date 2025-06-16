// BuildSummaryCard.js - Build summary with export and save functionality
import React, { useState } from 'react';

export default function BuildSummaryCard({ 
  currentSetup,
  proposedSetup, 
  results,
  bikeType,
  onSave,
  onExportPDF,
  speedUnit = 'mph'
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveMode, setSaveMode] = useState('garage'); // 'garage' | 'export'

  if (!results) return null;

  const { current, proposed, comparison } = results;
  const buildData = generateBuildData(currentSetup, proposedSetup, results, bikeType);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
              color: 'white'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Build Summary
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} bike configuration
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg transition-colors"
          style={{ 
            background: 'var(--surface-elevated)',
            color: 'var(--text-secondary)' 
          }}
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatItem 
          label="Weight"
          value={`${proposed.totalWeight}g`}
          change={proposed.totalWeight - current.totalWeight}
          unit="g"
          isGoodWhenLower
        />
        <StatItem 
          label="Range" 
          value={`${proposed.gearRange}%`}
          change={parseInt(proposed.gearRange) - parseInt(current.gearRange)}
          unit="%"
        />
        <StatItem 
          label="Top Speed"
          value={`${proposed.metrics.highSpeed} ${speedUnit}`}
          change={parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed)}
          unit={` ${speedUnit}`}
        />
        <StatItem 
          label="Est. Cost"
          value={`$${buildData.estimatedCost}`}
          icon="💰"
        />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Component Breakdown */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Component Breakdown
            </h4>
            <div className="space-y-3">
              <ComponentRow 
                label="Crankset"
                current={currentSetup.crankset}
                proposed={proposedSetup.crankset}
              />
              <ComponentRow 
                label="Cassette"
                current={currentSetup.cassette}
                proposed={proposedSetup.cassette}
              />
              <ComponentRow 
                label="Wheel"
                current={`${currentSetup.wheel} with ${currentSetup.tire}mm tire`}
                proposed={`${proposedSetup.wheel} with ${proposedSetup.tire}mm tire`}
              />
            </div>
          </div>

          {/* Drivetrain Analysis */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Drivetrain Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Type:</span>
                <span className="ml-2 font-medium">{buildData.drivetrainType}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Gear Count:</span>
                <span className="ml-2 font-medium">{buildData.gearCount} speeds</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Ratio Coverage:</span>
                <span className="ml-2 font-medium">{buildData.ratioCoverage}%</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Compatibility:</span>
                <span className="ml-2 font-medium" style={{ color: 'var(--accent-performance)' }}>
                  ✓ Compatible
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Upgrade Recommendations
            </h4>
            <div className="space-y-2">
              {buildData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-xs mt-1">•</span>
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6" 
           style={{ borderTop: '1px solid var(--border-subtle)' }}>
        
        {/* Save Mode Toggle */}
        <div className="flex rounded-lg p-1 flex-grow" 
             style={{ 
               background: 'var(--surface-primary)', 
               border: '1px solid var(--border-subtle)' 
             }}>
          <button
            onClick={() => setSaveMode('garage')}
            className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-all ${
              saveMode === 'garage' ? 'text-white' : ''
            }`}
            style={{
              background: saveMode === 'garage' ? 'var(--accent-blue)' : 'transparent',
              color: saveMode === 'garage' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Save to Garage
          </button>
          <button
            onClick={() => setSaveMode('export')}
            className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-all ${
              saveMode === 'export' ? 'text-white' : ''
            }`}
            style={{
              background: saveMode === 'export' ? 'var(--accent-blue)' : 'transparent',
              color: saveMode === 'export' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export PDF
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={saveMode === 'garage' ? () => handleSaveToGarage(buildData) : () => handleExportPDF(buildData)}
          className="btn-primary px-6 py-2 text-sm whitespace-nowrap"
        >
          {saveMode === 'garage' ? (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Save Build
            </>
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              Download PDF
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={() => handleShare(buildData)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          style={{ 
            background: 'var(--surface-primary)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

// Helper Components
function StatItem({ label, value, change, unit = '', isGoodWhenLower = false, icon }) {
  const hasChange = change !== undefined && Math.abs(change) > 0.1;
  const changeColor = hasChange ? getChangeColor(change, isGoodWhenLower) : 'var(--text-tertiary)';
  
  return (
    <div className="text-center">
      <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
        {icon || value}
      </div>
      {hasChange && (
        <div className="text-xs mt-1" style={{ color: changeColor }}>
          {formatChange(change, unit)}
        </div>
      )}
    </div>
  );
}

function ComponentRow({ label, current, proposed }) {
  const currentText = current ? `${current.model} ${current.variant}` : 'Not selected';
  const proposedText = proposed ? `${proposed.model} ${proposed.variant}` : 'Not selected';
  const isUpgrade = current && proposed && (proposed.weight < current.weight || proposed.model.includes('Ultegra') || proposed.model.includes('Dura-Ace'));
  
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}:
      </span>
      <div className="text-right">
        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {currentText}
        </div>
        <div className="flex items-center justify-end mt-1">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {proposedText}
          </span>
          {isUpgrade && (
            <svg className="w-4 h-4 ml-2" style={{ color: 'var(--accent-performance)' }} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Functions
function generateBuildData(currentSetup, proposedSetup, results, bikeType) {
  const { proposed } = results;
  
  // Estimate cost based on component tier
  const estimatedCost = estimateUpgradeCost(currentSetup, proposedSetup);
  
  // Determine drivetrain type
  const drivetrainType = proposedSetup.crankset?.teeth.length === 1 ? '1x' : '2x';
  
  // Extract gear count from cassette speeds
  const gearCount = extractGearCount(proposedSetup.cassette?.speeds || '11-speed');
  
  // Calculate ratio coverage
  const ratioCoverage = parseInt(proposed.gearRange);
  
  // Generate recommendations
  const recommendations = generateRecommendations(currentSetup, proposedSetup, results, bikeType);
  
  return {
    estimatedCost,
    drivetrainType,
    gearCount,
    ratioCoverage,
    recommendations
  };
}

function estimateUpgradeCost(current, proposed) {
  let cost = 0;
  
  // Crankset pricing (simplified)
  if (proposed.crankset && (!current.crankset || current.crankset.id !== proposed.crankset.id)) {
    if (proposed.crankset.model.includes('Dura-Ace') || proposed.crankset.model.includes('XTR')) {
      cost += 800;
    } else if (proposed.crankset.model.includes('Ultegra') || proposed.crankset.model.includes('XT')) {
      cost += 400;
    } else if (proposed.crankset.model.includes('105') || proposed.crankset.model.includes('SLX')) {
      cost += 250;
    } else if (proposed.crankset.model.includes('Red') || proposed.crankset.model.includes('XX1')) {
      cost += 1200;
    } else if (proposed.crankset.model.includes('Force') || proposed.crankset.model.includes('X01')) {
      cost += 600;
    } else {
      cost += 150;
    }
  }
  
  // Cassette pricing (simplified)
  if (proposed.cassette && (!current.cassette || current.cassette.id !== proposed.cassette.id)) {
    if (proposed.cassette.model.includes('Dura-Ace') || proposed.cassette.model.includes('XTR')) {
      cost += 300;
    } else if (proposed.cassette.model.includes('Ultegra') || proposed.cassette.model.includes('XT')) {
      cost += 150;
    } else if (proposed.cassette.model.includes('105') || proposed.cassette.model.includes('SLX')) {
      cost += 80;
    } else if (proposed.cassette.model.includes('Red') || proposed.cassette.model.includes('XX1')) {
      cost += 400;
    } else {
      cost += 50;
    }
  }
  
  return cost;
}

function extractGearCount(speedsString) {
  const match = speedsString.match(/(\d+)-speed/);
  return match ? parseInt(match[1]) : 11;
}

function generateRecommendations(current, proposed, results, bikeType) {
  const recommendations = [];
  const { comparison } = results;
  
  // Weight-based recommendations
  if (comparison?.weightChange && comparison.weightChange < -100) {
    recommendations.push('Significant weight savings - great for climbing performance');
  }
  
  // Speed-based recommendations
  if (comparison?.speedChange && comparison.speedChange > 1) {
    recommendations.push('Higher top speed - excellent for flat terrain and time trials');
  }
  
  // Range-based recommendations
  if (comparison?.rangeChange && comparison.rangeChange > 30) {
    recommendations.push('Much wider gear range - perfect for varied terrain');
  }
  
  // Bike type specific recommendations
  if (bikeType === 'mtb' && proposed.cassette?.teeth[1] > 50) {
    recommendations.push('Large cassette ideal for steep climbs and technical terrain');
  }
  
  if (bikeType === 'road' && proposed.crankset?.teeth.length === 1) {
    recommendations.push('1x setup offers simplicity but may have gear gaps');
  }
  
  if (bikeType === 'gravel' && proposed.crankset?.teeth.length === 2) {
    recommendations.push('2x setup provides excellent range for mixed terrain');
  }
  
  // Add installation recommendation
  recommendations.push('Professional installation recommended for optimal performance');
  
  return recommendations.length > 0 ? recommendations : ['Solid upgrade choice for your riding style'];
}

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

// Action Handlers
function handleSaveToGarage(buildData) {
  // This would integrate with your garage functionality
  console.log('Saving to garage:', buildData);
  // You could call your existing onSave prop here
  alert('Build saved to garage! (Integration needed)');
}

function handleExportPDF(buildData) {
  // PDF generation logic
  console.log('Exporting PDF:', buildData);
  
  // Simple approach - you could integrate with jsPDF or similar
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>CrankSmith Build Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { border-bottom: 2px solid #007AFF; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CrankSmith Build Summary</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="section">
          <div class="label">Estimated Cost:</div>
          <div>${buildData.estimatedCost}</div>
        </div>
        <div class="section">
          <div class="label">Drivetrain Type:</div>
          <div>${buildData.drivetrainType}</div>
        </div>
        <div class="section">
          <div class="label">Gear Count:</div>
          <div>${buildData.gearCount} speeds</div>
        </div>
        <div class="section">
          <div class="label">Recommendations:</div>
          <ul>
            ${buildData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function handleShare(buildData) {
  // Share functionality
  const shareData = {
    title: 'CrankSmith Build Summary',
    text: `Check out my bike build: ${buildData.drivetrainType} drivetrain, ${buildData.gearCount} speeds, estimated ${buildData.estimatedCost}`,
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
    alert('Build details copied to clipboard!');
  }
}