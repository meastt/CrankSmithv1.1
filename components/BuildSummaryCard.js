import { useState } from 'react';

// Simple toast system - add this at the top of your file
const showToast = (message, type = 'success') => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  toast.textContent = message;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

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

  // Fixed PDF export with proper error handling
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Try to import jsPDF - if it fails, fallback to HTML
      let jsPDFModule;
      try {
        jsPDFModule = await import('jspdf');
      } catch (importError) {
        console.warn('jsPDF not available, falling back to HTML export');
        exportToHTML();
        return;
      }
      
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(0, 122, 255);
      doc.text('CrankSmith Build Summary', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });
      
      // Current Setup Section
      let yPosition = 60;
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Current Setup', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(60);
      
      doc.text(`Crankset: ${currentSpecs.crankset}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Cassette: ${currentSpecs.cassette}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Wheel: ${currentSpecs.wheel}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Tire: ${currentSpecs.tire}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Top Speed: ${current.metrics.highSpeed} ${comparison.speedUnit}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Weight: ${current.totalWeight}g`, 25, yPosition);
      
      // Proposed Setup Section
      yPosition += 20;
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Proposed Setup', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(60);
      
      doc.text(`Crankset: ${proposedSpecs.crankset}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Cassette: ${proposedSpecs.cassette}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Wheel: ${proposedSpecs.wheel}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Tire: ${proposedSpecs.tire}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Top Speed: ${proposed.metrics.highSpeed} ${comparison.speedUnit}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Weight: ${proposed.totalWeight}g`, 25, yPosition);
      
      // Performance Analysis
      yPosition += 20;
      doc.setFontSize(16);
      doc.setTextColor(0, 122, 255);
      doc.text('Performance Analysis', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      const bottomLine = generateBottomLine();
      const lines = doc.splitTextToSize(bottomLine, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      
      // Compatibility Status
      yPosition += lines.length * 6 + 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Components are compatible', 20, yPosition);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('Generated by CrankSmith - The Ultimate Cycling Gear Calculator', 
               pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
      doc.text('Visit cranksmith.com for more cycling tools', 
               pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
      
      // Download the PDF
      const fileName = `cranksmith-build-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      showToast('✅ PDF downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('PDF export failed:', error);
      showToast('❌ PDF export failed. Trying HTML export...', 'error');
      // Fallback to HTML export
      setTimeout(() => exportToHTML(), 1000);
    } finally {
      setIsExporting(false);
    }
  };

  // HTML export fallback
  const exportToHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CrankSmith Build Summary</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #007AFF; padding-bottom: 20px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .spec-item { margin: 8px 0; display: flex; justify-content: space-between; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; }
            .analysis { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007AFF; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔧 CrankSmith Build Summary</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="spec-grid">
            <div class="section">
              <h2>📊 Current Setup</h2>
              <div class="spec-item"><span class="label">Crankset:</span> <span class="value">${currentSpecs.crankset}</span></div>
              <div class="spec-item"><span class="label">Cassette:</span> <span class="value">${currentSpecs.cassette}</span></div>
              <div class="spec-item"><span class="label">Wheel:</span> <span class="value">${currentSpecs.wheel}</span></div>
              <div class="spec-item"><span class="label">Tire:</span> <span class="value">${currentSpecs.tire}</span></div>
              <div class="spec-item"><span class="label">Top Speed:</span> <span class="value">${current.metrics.highSpeed} ${comparison.speedUnit}</span></div>
              <div class="spec-item"><span class="label">Weight:</span> <span class="value">${current.totalWeight}g</span></div>
            </div>
            
            <div class="section">
              <h2>🚀 Proposed Setup</h2>
              <div class="spec-item"><span class="label">Crankset:</span> <span class="value">${proposedSpecs.crankset}</span></div>
              <div class="spec-item"><span class="label">Cassette:</span> <span class="value">${proposedSpecs.cassette}</span></div>
              <div class="spec-item"><span class="label">Wheel:</span> <span class="value">${proposedSpecs.wheel}</span></div>
              <div class="spec-item"><span class="label">Tire:</span> <span class="value">${proposedSpecs.tire}</span></div>
              <div class="spec-item"><span class="label">Top Speed:</span> <span class="value">${proposed.metrics.highSpeed} ${comparison.speedUnit}</span></div>
              <div class="spec-item"><span class="label">Weight:</span> <span class="value">${proposed.totalWeight}g</span></div>
            </div>
          </div>
          
          <div class="analysis">
            <h2>💡 Performance Analysis</h2>
            <p>${generateBottomLine()}</p>
          </div>
          
          <div class="section" style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>Generated by CrankSmith - Visit cranksmith.com for more cycling tools</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cranksmith-build-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('✅ Build summary downloaded!', 'success');
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
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('✅ Link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('✅ Link copied to clipboard!', 'success');
      } catch (clipboardError) {
        showToast('❌ Sharing not supported', 'error');
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
                  background: isExporting ? '#6B7280' : 'var(--accent-blue)',
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
                  background: '#F9FAFB',
                  color: '#6B7280',
                  border: '1px solid #D1D5DB'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F3F4F6';
                  e.target.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#F9FAFB';
                  e.target.style.borderColor = '#D1D5DB';
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