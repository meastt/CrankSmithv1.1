// components/BuildSummaryCard.js - FIXED VERSION
// Critical Bug Fix: PDF export now has proper fallback handling
// Quick Win: Added simplified export options

import { useState } from 'react';

export default function BuildSummaryCard({ 
  currentSetup, 
  proposedSetup, 
  results, 
  onSave 
}) {
  const [isExporting, setIsExporting] = useState(false);

  const { current, proposed, comparison } = results;

  // Helper functions
  const formatSpecs = (setup) => ({
    crankset: `${setup.crankset.name} (${setup.crankset.teeth.join('/')})`,
    cassette: `${setup.cassette.name} (${setup.cassette.teeth.join('-')})`,
    wheel: `${setup.wheel.name}`,
    tire: `${setup.tire.name} (${setup.tire.width}mm)`
  });

  // Fixed compatibility checking
  const checkCompatibility = () => {
    const issues = [];
    const warnings = [];
    
    // Speed compatibility check
    if (currentSetup.cassette.speeds !== proposedSetup.cassette.speeds) {
      issues.push(`Speed mismatch: ${currentSetup.cassette.speeds}s vs ${proposedSetup.cassette.speeds}s`);
    }
    
    // Chain line and derailleur capacity warnings
    if (proposedSetup.crankset.teeth && proposedSetup.cassette.teeth) {
      const crankRange = Math.max(...proposedSetup.crankset.teeth) - Math.min(...proposedSetup.crankset.teeth);
      const cassetteRange = Math.max(...proposedSetup.cassette.teeth) - Math.min(...proposedSetup.cassette.teeth);
      
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

  // Smart recommendation generator
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
    
    if (rangeChange > 20) benefits.push(`adds ${rangeChange.toFixed(1)}% more gear range`);
    else if (rangeChange < -20) benefits.push(`reduces gear range by ${Math.abs(rangeChange).toFixed(1)}%`);
    
    if (benefits.length === 0) {
      return "Your proposed setup offers similar performance with different characteristics.";
    }
    
    message += benefits.join(", ") + ". ";
    
    const majorBenefits = benefits.length >= 2 || weightChange < -50 || speedChange > 1 || rangeChange > 50;
    message += majorBenefits ? "Worth the upgrade!" : "Minor improvement - consider your priorities.";
    
    return message;
  };

  // FIXED: Robust export function with proper fallback
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // First try PDF export
      const jsPDFModule = await import('jspdf').catch(() => null);
      
      if (jsPDFModule) {
        await generatePDF(jsPDFModule.jsPDF);
      } else {
        // Fallback to JSON export if PDF fails
        console.warn('PDF library not available, exporting as JSON');
        exportToJSON();
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Always fallback to JSON export
      exportToJSON();
    } finally {
      setIsExporting(false);
    }
  };

  // PDF generation function
  const generatePDF = async (jsPDF) => {
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
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    const currentItems = [
      `Crankset: ${currentSpecs.crankset}`,
      `Cassette: ${currentSpecs.cassette}`,
      `Wheel: ${currentSpecs.wheel}`,
      `Tire: ${currentSpecs.tire}`,
      `Top Speed: ${current.metrics.highSpeed} ${comparison.speedUnit}`,
      `Weight: ${current.totalWeight}g`
    ];
    
    currentItems.forEach(item => {
      doc.text(item, 25, yPosition);
      yPosition += 6;
    });
    
    // Proposed Setup Section
    yPosition += 20;
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Proposed Setup', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    const proposedItems = [
      `Crankset: ${proposedSpecs.crankset}`,
      `Cassette: ${proposedSpecs.cassette}`,
      `Wheel: ${proposedSpecs.wheel}`,
      `Tire: ${proposedSpecs.tire}`,
      `Top Speed: ${proposed.metrics.highSpeed} ${comparison.speedUnit}`,
      `Weight: ${proposed.totalWeight}g`
    ];
    
    proposedItems.forEach(item => {
      doc.text(item, 25, yPosition);
      yPosition += 6;
    });
    
    // Analysis Section
    yPosition += 20;
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Analysis', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(generateBottomLine(), 25, yPosition, { maxWidth: pageWidth - 50 });
    
    // Save the PDF
    doc.save(`cranksmith-build-summary-${Date.now()}.pdf`);
  };

  // JSON export fallback
  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      current: { setup: currentSetup, results: current },
      proposed: { setup: proposedSetup, results: proposed },
      comparison,
      compatibility,
      analysis: generateBottomLine()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cranksmith-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Build Summary
        </h2>
        <p className="text-[var(--text-secondary)]">
          {generateBottomLine()}
        </p>
      </div>

      {/* Compatibility Status - FIXED */}
      <div className="mb-6 p-4 rounded-lg border" style={{
        backgroundColor: compatibility.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                         compatibility.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                         'rgba(76, 175, 80, 0.1)',
        borderColor: compatibility.status === 'error' ? '#dc3545' : 
                     compatibility.status === 'warning' ? '#ffc107' : 
                     '#4CAF50'
      }}>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full mr-3" style={{
            backgroundColor: compatibility.status === 'error' ? '#dc3545' : 
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

      {/* Action Buttons - FIXED */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onSave}
          className="bg-[var(--accent-blue)] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all text-lg"
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
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all text-lg"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {isExporting ? 'Exporting...' : 'Export Analysis'}
        </button>
        
        <button
          onClick={() => window.print()}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all text-lg"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}