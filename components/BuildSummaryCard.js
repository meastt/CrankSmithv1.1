import { useState } from 'react';

export default function BuildSummaryCard({ currentSetup, proposedSetup, results, onSave }) {
  const [isExporting, setIsExporting] = useState(false);
  
  if (!results) return null;

  const { current, proposed, comparison } = results;

  const formatSpecs = (setup) => {
    console.log('Formatting specs for setup:', setup);
    
    // Get crankset info
    const crankset = setup.crankset;
    const cranksetText = crankset ? 
      `${crankset.model || ''} ${crankset.teeth ? crankset.teeth.join('/') + 'T' : ''}`.trim() : 
      'N/A';
    
    // Get cassette info
    const cassette = setup.cassette;
    const cassetteText = cassette ? 
      `${cassette.model || ''} ${cassette.teeth ? cassette.teeth.join('-') + 'T' : ''}`.trim() : 
      'N/A';
    
    // Get wheel and tire info
    const wheelText = setup.wheel ? `${setup.wheel} wheel` : 'N/A';
    const tireText = setup.tire ? `${setup.tire}mm tire` : 'N/A';
    
    return { 
      crankset: cranksetText,
      cassette: cassetteText,
      wheel: wheelText,
      tire: tireText
    };
  };

  // Enhanced compatibility checker
  const checkCompatibility = () => {
    const issues = [];
    const warnings = [];
    
    // Check derailleur capacity (if you have derailleur data)
    if (proposedSetup.cassette && proposedSetup.cassette.teeth) {
      const maxCog = Math.max(...proposedSetup.cassette.teeth);
      if (maxCog > 36) {
        warnings.push("Large cassette may require long-cage derailleur");
      }
      if (maxCog > 50) {
        issues.push("Cassette too large for standard road derailleurs");
      }
    }
    
    // Check chain line compatibility
    if (proposedSetup.crankset && proposedSetup.cassette) {
      const crankRange = proposedSetup.crankset.teeth ? 
        Math.max(...proposedSetup.crankset.teeth) - Math.min(...proposedSetup.crankset.teeth) : 0;
      const cassetteRange = proposedSetup.cassette.teeth ? 
        Math.max(...proposedSetup.cassette.teeth) - Math.min(...proposedSetup.cassette.teeth) : 0;
      
      if (crankRange > 20 && cassetteRange > 400) {
        warnings.push("Wide range setup may have chain line issues");
      }
    }
    
    return {
      status: issues.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'compatible',
      issues,
      warnings
    };
  };

  const compatibility = checkCompatibility();
  const currentSpecs = formatSpecs(currentSetup);
  const proposedSpecs = formatSpecs(proposedSetup);

  // Smart bottom line generation
  const generateBottomLine = () => {
    const weightChange = comparison.weightChange || 0;
    const speedChange = parseFloat(proposed.metrics.highSpeed) - parseFloat(current.metrics.highSpeed);
    const rangeChange = parseInt(proposed.gearRange) - parseInt(current.gearRange);
    
    let message = "Your proposed setup ";
    const benefits = [];
    
    if (weightChange < -10) benefits.push(`saves ${Math.abs(weightChange)}g`);
    else if (weightChange > 10) benefits.push(`adds ${weightChange}g`);
    
    if (speedChange > 0.3) benefits.push(`gives you ${speedChange.toFixed(1)} ${comparison.speedUnit} more top speed`);
    else if (speedChange < -0.3) benefits.push(`reduces top speed by ${Math.abs(speedChange).toFixed(1)} ${comparison.speedUnit}`);
    
    if (rangeChange > 20) benefits.push(`adds ${rangeChange}% more gear range for climbing`);
    else if (rangeChange < -20) benefits.push(`reduces gear range by ${Math.abs(rangeChange)}%`);
    
    if (benefits.length === 0) {
      return "Your proposed setup offers similar performance with different characteristics.";
    }
    
    message += benefits.join(", ") + ". ";
    
    // Recommendation logic
    const majorBenefits = benefits.length >= 2 || weightChange < -50 || speedChange > 1 || rangeChange > 50;
    message += majorBenefits ? "Worth the upgrade?" : "Minor improvement - consider your priorities.";
    
    return message;
  };

  // PDF Export function
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create a clean version for PDF
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>CrankSmith Build Comparison</title>
            <style>
              @page { 
                size: A4; 
                margin: 1in; 
              }
              * {
                box-sizing: border-box;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                color: #333; 
                line-height: 1.4;
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #007AFF;
                padding-bottom: 20px;
              }
              .header h1 {
                margin: 0 0 10px 0;
                color: #007AFF;
                font-size: 24px;
              }
              .comparison { 
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px; 
                margin-bottom: 30px; 
              }
              .setup { 
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #ddd;
              }
              .setup h3 { 
                color: #007AFF; 
                border-bottom: 2px solid #007AFF; 
                padding-bottom: 8px; 
                margin: 0 0 15px 0;
                font-size: 18px;
              }
              .spec-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 10px 0; 
                padding: 5px 0;
                border-bottom: 1px dotted #ccc;
              }
              .spec-row:last-child {
                border-bottom: none;
              }
              .spec-row span:first-child {
                font-weight: 500;
                color: #666;
              }
              .spec-row span:last-child {
                font-weight: 600;
                color: #333;
              }
              .bottom-line { 
                background: #f0f8ff; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border: 1px solid #007AFF;
              }
              .bottom-line h3 {
                margin: 0 0 10px 0;
                color: #007AFF;
              }
              .bottom-line p {
                margin: 0;
                font-size: 16px;
                line-height: 1.5;
              }
              .compatibility { 
                margin: 20px 0; 
                padding: 15px; 
                border-radius: 8px; 
                page-break-inside: avoid;
              }
              .compatibility h3 {
                margin: 0 0 10px 0;
                font-size: 16px;
              }
              .compatibility p {
                margin: 5px 0;
                font-size: 14px;
              }
              .compatible { 
                background: #e8f5e8; 
                border: 1px solid #4CAF50;
                color: #2e7d32;
              }
              .warning { 
                background: #fff3cd; 
                border: 1px solid #ffc107; 
                color: #856404;
              }
              .error { 
                background: #f8d7da; 
                border: 1px solid #dc3545; 
                color: #721c24;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔧 CrankSmith Build Comparison</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="comparison">
              <div class="setup">
                <h3>📊 Current Setup</h3>
                <div class="spec-row"><span>Crankset:</span><span>${currentSpecs.crankset}</span></div>
                <div class="spec-row"><span>Cassette:</span><span>${currentSpecs.cassette}</span></div>
                <div class="spec-row"><span>Wheel:</span><span>${currentSpecs.wheel}</span></div>
                <div class="spec-row"><span>Tire:</span><span>${currentSpecs.tire}</span></div>
                <div class="spec-row"><span>Top Speed:</span><span>${current.metrics.highSpeed} ${comparison.speedUnit}</span></div>
                <div class="spec-row"><span>Weight:</span><span>${current.totalWeight}g</span></div>
              </div>
              
              <div class="setup">
                <h3>🚀 Proposed Setup</h3>
                <div class="spec-row"><span>Crankset:</span><span>${proposedSpecs.crankset}</span></div>
                <div class="spec-row"><span>Cassette:</span><span>${proposedSpecs.cassette}</span></div>
                <div class="spec-row"><span>Wheel:</span><span>${proposedSpecs.wheel}</span></div>
                <div class="spec-row"><span>Tire:</span><span>${proposedSpecs.tire}</span></div>
                <div class="spec-row"><span>Top Speed:</span><span>${proposed.metrics.highSpeed} ${comparison.speedUnit}</span></div>
                <div class="spec-row"><span>Weight:</span><span>${proposed.totalWeight}g</span></div>
              </div>
            </div>
            
            <div class="bottom-line">
              <h3>💡 Performance Analysis</h3>
              <p>${generateBottomLine()}</p>
            </div>
            
            <div class="compatibility ${compatibility.status}">
              <h3>🔧 Compatibility Status</h3>
              <p><strong>Status:</strong> ${compatibility.status.charAt(0).toUpperCase() + compatibility.status.slice(1)}</p>
              ${compatibility.issues.length > 0 ? `<p><strong>❌ Issues:</strong> ${compatibility.issues.join(', ')}</p>` : ''}
              ${compatibility.warnings.length > 0 ? `<p><strong>⚠️ Warnings:</strong> ${compatibility.warnings.join(', ')}</p>` : ''}
              ${compatibility.status === 'compatible' ? '<p><strong>✅ All components are compatible!</strong></p>' : ''}
            </div>

            <div class="footer">
              <p>Generated by CrankSmith v2.0 - The Ultimate Cycling Gear Calculator</p>
              <p>Visit us at cranksmith.app for more cycling tools and insights</p>
            </div>
          </body>
        </html>
      `;
      
      // Create new window with proper size
      const printWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes');
      
      if (!printWindow) {
        alert('Please allow popups for PDF export to work');
        return;
      }
      
      // Write content and wait for it to load
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to render, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          
          // Close window after print dialog
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 300);
      };
      
      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.focus();
          printWindow.print();
        }
      }, 1000);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share function
  const shareResults = async () => {
    const shareData = {
      title: 'CrankSmith Build Comparison',
      text: `${generateBottomLine()} Check out my gear analysis on CrankSmith!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      // Final fallback: just copy URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        alert('Sharing not supported. Copy the URL from your browser address bar.');
      }
    }
  };

  return (
    <div className="card">
      <div 
        className="p-8 rounded-xl"
        style={{ 
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
          border: '1px solid var(--accent-blue)',
          boxShadow: '0 8px 32px rgba(0, 122, 255, 0.1)'
        }}
      >
        <div className="flex items-start gap-6">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)',
              color: 'white'
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Build Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Current Setup
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Crankset:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{currentSpecs.crankset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Cassette:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{currentSpecs.cassette}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Wheel:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{currentSpecs.wheel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Tire:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{currentSpecs.tire}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Top Speed:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{current.metrics.highSpeed} {comparison.speedUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Weight:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{current.totalWeight}g</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Proposed Setup
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Crankset:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposedSpecs.crankset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Cassette:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposedSpecs.cassette}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Wheel:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposedSpecs.wheel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Tire:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposedSpecs.tire}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Top Speed:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposed.metrics.highSpeed} {comparison.speedUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Weight:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{proposed.totalWeight}g</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {generateBottomLine()}
            </p>
            
            {/* Enhanced Compatibility Status */}
            <div className="mb-6 p-4 rounded-lg" style={{
              background: compatibility.status === 'error' ? 'rgba(220, 53, 69, 0.1)' : 
                         compatibility.status === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 
                         'rgba(76, 175, 80, 0.1)',
              border: `1px solid ${compatibility.status === 'error' ? '#dc3545' : 
                                 compatibility.status === 'warning' ? '#ffc107' : 
                                 '#4CAF50'}`
            }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ 
                  background: compatibility.status === 'error' ? '#dc3545' : 
                             compatibility.status === 'warning' ? '#ffc107' : 
                             '#4CAF50'
                }}></div>
                <span className="text-base font-medium" style={{ 
                  color: compatibility.status === 'error' ? '#dc3545' : 
                         compatibility.status === 'warning' ? '#ffc107' : 
                         '#4CAF50'
                }}>
                  {compatibility.status === 'error' ? '⚠️ Compatibility Issues' : 
                   compatibility.status === 'warning' ? '⚠️ Compatibility Warnings' : 
                   '✓ Components are compatible'}
                </span>
              </div>
              
              {compatibility.issues.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                  {compatibility.issues.map((issue, index) => (
                    <p key={index} className="text-sm text-red-700">• {issue}</p>
                  ))}
                </div>
              )}
              
              {compatibility.warnings.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Warnings:</p>
                  {compatibility.warnings.map((warning, index) => (
                    <p key={index} className="text-sm text-yellow-700">• {warning}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={onSave}
                className="btn-primary text-lg px-8"
                style={{ minWidth: '180px' }}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Save to Garage
              </button>
              
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="px-6 py-3 rounded-xl font-medium transition-all text-base"
                style={{ 
                  background: isExporting ? 'var(--surface-disabled)' : 'var(--accent-blue)',
                  color: 'white',
                  opacity: isExporting ? 0.6 : 1
                }}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              
              <button
                onClick={shareResults}
                className="px-6 py-3 rounded-xl font-medium transition-all text-base"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}