// lib/compatibilityChecker.js - Enhanced compatibility checking with detailed explanations
// UPDATED: Added comprehensive derailleur capacity, chain line, and speed compatibility checks

export class CompatibilityChecker {
    constructor() {
      // Define derailleur capacity limits by bike type
      this.derailleurLimits = {
        road: {
          shortCage: { maxCapacity: 29, maxCog: 32 },
          mediumCage: { maxCapacity: 35, maxCog: 36 },
          longCage: { maxCapacity: 41, maxCog: 42 }
        },
        gravel: {
          mediumCage: { maxCapacity: 35, maxCog: 42 },
          longCage: { maxCapacity: 41, maxCog: 50 }
        },
        mtb: {
          mediumCage: { maxCapacity: 35, maxCog: 46 },
          longCage: { maxCapacity: 41, maxCog: 52 },
          extraLongCage: { maxCapacity: 47, maxCog: 52 }
        }
      };
  
      // Chain line compatibility ranges (mm from center)
      this.chainLineStandards = {
        'road': { ideal: 43.5, tolerance: 2.5 },
        'gravel': { ideal: 45, tolerance: 3 },
        'mtb': { ideal: 52, tolerance: 4 }
      };
    }
  
    /**
     * Comprehensive compatibility check
     * @param {Object} setup - Complete bike setup
     * @param {string} bikeType - road, gravel, or mtb
     * @returns {Object} Detailed compatibility analysis
     */
    checkCompatibility(setup, bikeType) {
      const results = {
        status: 'compatible',
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {
          derailleurCapacity: true,
          chainLength: true,
          speedCompatibility: true,
          chainLine: true
        }
      };
  
      if (!setup.crankset || !setup.cassette) {
        return results;
      }
  
      // Check derailleur capacity (bike-type specific)
      this.checkDerailleurCapacity(setup, bikeType, results);
      
      // Check chain length requirements
      this.checkChainLength(setup, results);
      
      // Check speed compatibility
      this.checkSpeedCompatibility(setup, results);
      
      // Check chain line issues
      this.checkChainLine(setup, bikeType, results);
  
      // Determine overall status
      if (results.criticalIssues.length > 0) {
        results.status = 'error';
      } else if (results.minorWarnings.length > 0) {
        results.status = 'warning';
      }
  
      return results;
    }
  
    /**
     * Check derailleur capacity requirements
     */
    checkDerailleurCapacity(setup, bikeType, results) {
      const { crankset, cassette } = setup;
      
      if (!crankset.teeth || !cassette.teeth) return;
  
      const maxChainring = Math.max(...crankset.teeth);
      const minChainring = Math.min(...crankset.teeth);
      const maxCog = Math.max(...cassette.teeth);
      const minCog = Math.min(...cassette.teeth);
      
      const totalCapacity = (maxChainring - minChainring) + (maxCog - minCog);
      const limits = this.derailleurLimits[bikeType];
  
      // Check against bike-type appropriate limits
      let recommendedCage = null;
      let isCompatible = false;
  
      Object.entries(limits).forEach(([cageType, limit]) => {
        if (totalCapacity <= limit.maxCapacity && maxCog <= limit.maxCog) {
          if (!recommendedCage) recommendedCage = cageType;
          isCompatible = true;
        }
      });
  
      if (!isCompatible) {
        results.criticalIssues.push(`Total capacity (${totalCapacity}T) exceeds ${bikeType} derailleur limits`);
        results.actionItems.push(`Consider smaller cassette range or different crankset for ${bikeType} setup`);
        results.checks.derailleurCapacity = false;
      } else if (recommendedCage === 'longCage' || recommendedCage === 'extraLongCage') {
        results.minorWarnings.push(`${recommendedCage.replace('Cage', '-cage')} derailleur recommended for this range`);
      }
  
      // Large cassette warnings (bike-type specific)
      if (bikeType === 'road' && maxCog > 36) {
        results.minorWarnings.push('Large cassette may require GRX or MTB derailleur for road bikes');
      } else if (bikeType === 'gravel' && maxCog > 50) {
        results.minorWarnings.push('Very large cassette - ensure derailleur can handle range');
      }
    }
  
    /**
     * Check speed compatibility between components
     */
    checkSpeedCompatibility(setup, results) {
      const { crankset, cassette } = setup;
      
      if (!crankset.speeds || !cassette.speeds) return;
  
      const cranksetSpeed = this.extractSpeedCount(crankset.speeds);
      const cassetteSpeed = this.extractSpeedCount(cassette.speeds);
  
      if (cranksetSpeed === 0 || cassetteSpeed === 0) {
        results.minorWarnings.push('Speed compatibility cannot be determined - missing speed information');
        results.actionItems.push('Verify component speeds match (e.g., both 11-speed)');
        return;
      }
  
      if (cranksetSpeed !== cassetteSpeed) {
        results.criticalIssues.push(`Speed mismatch: ${cranksetSpeed}-speed crankset with ${cassetteSpeed}-speed cassette`);
        results.actionItems.push(`Use matching ${cassetteSpeed}-speed crankset or ${cranksetSpeed}-speed cassette`);
        
        // Suggest specific compatibility solutions
        if (Math.abs(cranksetSpeed - cassetteSpeed) === 1) {
          results.actionItems.push('Components may work with chain and derailleur adjustments (not recommended for optimal performance)');
        }
      } else {
        results.actionItems.push(`${cranksetSpeed}-speed components are perfectly matched`);
      }
  
      // Check for outdated speeds
      if (cranksetSpeed < 10 && cassetteSpeed < 10) {
        results.minorWarnings.push('Older drivetrain technology - consider 11-12 speed upgrade');
        results.actionItems.push('Modern 11-12 speed drivetrains offer better performance and availability');
      }
    }
  
    /**
     * Analyze chain line compatibility
     */
    checkChainLine(setup, bikeType, results) {
      const { crankset, cassette } = setup;
      
      if (!crankset.teeth || !cassette.teeth) return;
  
      const standard = this.chainLineStandards[bikeType] || this.chainLineStandards['road'];
      
      // Analyze gear combinations for potential chain line issues
      if (crankset.teeth.length > 1) {
        const smallRing = Math.min(...crankset.teeth);
        const bigRing = Math.max(...crankset.teeth);
        const smallCog = Math.min(...cassette.teeth);
        const bigCog = Math.max(...cassette.teeth);
        
        // Big ring to big cog (avoid)
        const extremeRatio1 = bigRing / bigCog;
        // Small ring to small cog (avoid)
        const extremeRatio2 = smallRing / smallCog;
        
        if (extremeRatio1 < 1.5 || extremeRatio2 > 3.5) {
          results.minorWarnings.push('Some gear combinations may cause poor chain line');
          results.actionItems.push('Avoid big ring + big cassette and small ring + small cassette combinations');
        }
      }
      
      // 1x specific analysis
      if (crankset.teeth.length === 1) {
        const chainring = crankset.teeth[0];
        const cassetteRange = Math.max(...cassette.teeth) / Math.min(...cassette.teeth);
        
        if (cassetteRange > 5) {
          results.minorWarnings.push('Wide range cassette with 1x may have chain line issues at extremes');
          results.actionItems.push('Consider narrow-wide chainring and clutch derailleur for chain retention');
        }
        
        results.actionItems.push('1x drivetrain offers excellent chain line in middle gears');
      }
    }
  
    /**
     * Analyze gear ratios for practical usage
     */
    analyzeGearRatios(setup, bikeType) {
      const result = {
        warnings: [],
        recommendations: [],
        analysis: {}
      };
  
      if (!setup.crankset?.teeth || !setup.cassette?.teeth) {
        return result;
      }
  
      const crankTeeth = setup.crankset.teeth;
      const cassetteTeeth = setup.cassette.teeth;
      
      // Calculate gear ratios
      const allRatios = [];
      crankTeeth.forEach(chainring => {
        cassetteTeeth.forEach(cog => {
          allRatios.push(chainring / cog);
        });
      });
      
      const minRatio = Math.min(...allRatios);
      const maxRatio = Math.max(...allRatios);
      const ratioSpread = maxRatio / minRatio;
      
      result.analysis = {
        minRatio: minRatio.toFixed(2),
        maxRatio: maxRatio.toFixed(2),
        ratioSpread: ratioSpread.toFixed(1),
        totalGears: allRatios.length
      };
  
      // Analyze based on bike type
      const recommendations = this.getBikeTypeRecommendations(bikeType, minRatio, maxRatio, ratioSpread);
      result.warnings.push(...recommendations.warnings);
      result.recommendations.push(...recommendations.suggestions);
  
      // Check for gear overlaps in 2x systems
      if (crankTeeth.length === 2) {
        const gearOverlap = this.analyzeGearOverlap(crankTeeth, cassetteTeeth);
        if (gearOverlap.percentage > 30) {
          result.warnings.push(`${gearOverlap.percentage}% gear overlap between chainrings`);
          result.recommendations.push('Consider 1x drivetrain for simpler shifting');
        }
      }
  
      return result;
    }
  
    /**
     * Get bike type specific recommendations
     */
    getBikeTypeRecommendations(bikeType, minRatio, maxRatio, ratioSpread) {
      const warnings = [];
      const suggestions = [];
  
      switch (bikeType) {
        case 'road':
          if (minRatio > 1.5) {
            warnings.push('May struggle on steep climbs (consider lower gearing)');
            suggestions.push('Add larger cassette or compact crankset for better climbing');
          }
          if (maxRatio < 3.5) {
            warnings.push('Limited top speed potential');
            suggestions.push('Consider larger chainrings for higher top speed');
          }
          if (ratioSpread > 4.5) {
            suggestions.push('Excellent gear range for varied terrain');
          }
          break;
  
        case 'gravel':
          if (minRatio > 1.2) {
            warnings.push('May need easier gears for loose/steep gravel climbs');
            suggestions.push('Consider wider range cassette (11-42T or larger)');
          }
          if (ratioSpread < 3.5) {
            warnings.push('Limited gear range for adventure riding');
            suggestions.push('Gravel benefits from wide gear range for varied terrain');
          }
          suggestions.push('Setup well-suited for mixed terrain adventure riding');
          break;
  
        case 'mtb':
          if (minRatio > 1.0) {
            warnings.push('May need easier gears for technical climbs');
            suggestions.push('Consider larger cassette (10-50T+) for steep technical terrain');
          }
          if (maxRatio > 3.0) {
            suggestions.push('Good top-end for XC racing and fire roads');
          }
          suggestions.push('Mountain bike gearing optimized for trail efficiency');
          break;
      }
  
      return { warnings, suggestions };
    }
  
    /**
     * Analyze gear overlap in 2x systems
     */
    analyzeGearOverlap(crankTeeth, cassetteTeeth) {
      if (crankTeeth.length !== 2) return { percentage: 0, overlaps: [] };
  
      const [smallRing, bigRing] = crankTeeth.sort((a, b) => a - b);
      const overlaps = [];
      let overlapCount = 0;
  
      cassetteTeeth.forEach(cog => {
        const smallRingRatio = smallRing / cog;
        const bigRingRatio = bigRing / cog;
        
        // Check if this cog creates overlapping ratios
        cassetteTeeth.forEach(otherCog => {
          if (cog === otherCog) return;
          
          const otherSmallRatio = smallRing / otherCog;
          const otherBigRatio = bigRing / otherCog;
          
          if (Math.abs(smallRingRatio - otherBigRatio) < 0.1) {
            overlaps.push(`${smallRing}×${cog} ≈ ${bigRing}×${otherCog}`);
            overlapCount++;
          }
        });
      });
  
      const totalCombinations = cassetteTeeth.length * 2;
      const percentage = Math.round((overlapCount / totalCombinations) * 100);
  
      return { percentage, overlaps };
    }
  
    /**
     * Assess installation complexity
     */
    assessInstallationComplexity(setup) {
      const result = {
        complexity: 'moderate',
        recommendations: [],
        requiredTools: [],
        estimatedTime: '1-2 hours'
      };
  
      const complexityFactors = [];
  
      // Check for electronic components
      if (setup.crankset?.speeds?.includes('Di2') || setup.cassette?.speeds?.includes('Di2')) {
        complexityFactors.push('electronic');
        result.recommendations.push('Electronic shifting requires cable routing and battery setup');
        result.requiredTools.push('Di2 specific tools and software');
      }
  
      // Check for bottom bracket compatibility
      if (setup.crankset?.model?.includes('BB30') || setup.crankset?.model?.includes('PF30')) {
        complexityFactors.push('press-fit-bb');
        result.recommendations.push('Press-fit bottom bracket may require professional installation');
        result.requiredTools.push('Bottom bracket press/removal tools');
      }
  
      // Check for cassette type
      if (setup.cassette?.model?.includes('XDR') || setup.cassette?.model?.includes('XD')) {
        complexityFactors.push('xd-driver');
        result.recommendations.push('XD/XDR cassette requires compatible freehub body');
        result.requiredTools.push('XD cassette tool');
      }
  
      // Determine overall complexity
      if (complexityFactors.length === 0) {
        result.complexity = 'basic';
        result.estimatedTime = '30-60 minutes';
        result.recommendations.push('Standard installation - suitable for home mechanics');
        result.requiredTools.push('Basic bike tools', 'Chain whip', 'Cassette tool');
      } else if (complexityFactors.length <= 2) {
        result.complexity = 'moderate';
        result.estimatedTime = '1-2 hours';
        result.recommendations.push('Moderate complexity - some special tools required');
      } else {
        result.complexity = 'advanced';
        result.estimatedTime = '2-3 hours';
        result.recommendations.push('Complex installation - consider professional help');
      }
  
      // Always recommend professional help for safety-critical items
      result.recommendations.push('Professional installation recommended for optimal performance and safety');
  
      return result;
    }
  
    /**
     * Extract speed count from speed string
     */
    extractSpeedCount(speedString) {
      if (!speedString) return 0;
      const match = speedString.match(/(\d+)-speed/);
      return match ? parseInt(match[1]) : 0;
    }
  
    /**
     * Generate compatibility summary for UI display
     */
    generateCompatibilitySummary(compatibilityResults) {
      // Support both new and old result shapes for safety
      const status = compatibilityResults.status || compatibilityResults.overall || 'compatible';
      const criticalIssues = compatibilityResults.criticalIssues || compatibilityResults.issues || [];
      const minorWarnings = compatibilityResults.minorWarnings || compatibilityResults.warnings || [];
      const actionItems = compatibilityResults.actionItems || compatibilityResults.recommendations || [];

      const summary = {
        status,
        title: this.getStatusTitle(status),
        message: this.getStatusMessage(status, criticalIssues, minorWarnings),
        actionItems: actionItems.slice(0, 3), // Top 3 recommendations
        criticalIssues,
        minorWarnings
      };

      return summary;
    }
  
    getStatusTitle(status) {
      switch (status) {
        case 'compatible': return '✅ Components Compatible';
        case 'warning': return '⚠️ Compatible with Considerations';
        case 'error': return '❌ Compatibility Issues';
        case 'incomplete': return '📝 Incomplete Setup';
        default: return 'Unknown Status';
      }
    }
  
    getStatusMessage(status, issues, warnings) {
      switch (status) {
        case 'compatible':
          return 'All components work together perfectly. Ready to ride!';
        case 'warning':
          return `Components are compatible but consider ${warnings.length} optimization${warnings.length > 1 ? 's' : ''}.`;
        case 'error':
          return `${issues.length} critical issue${issues.length > 1 ? 's' : ''} prevent${issues.length === 1 ? 's' : ''} this combination from working.`;
        case 'incomplete':
          return 'Add all components to check compatibility.';
        default:
          return 'Compatibility status unknown.';
      }
    }
  
    checkChainLength(setup, results) {
      const { crankset, cassette } = setup;
      
      if (!crankset.teeth || !cassette.teeth) return;

      const maxChainring = Math.max(...crankset.teeth);
      const maxCog = Math.max(...cassette.teeth);
      
      // Only warn about chain length for extreme combinations
      if (crankset.teeth.length > 1 && maxCog > 46) {
        results.minorWarnings.push('Wide range setup may require longer chain');
        results.actionItems.push('Check chain length when installing');
      }
    }
  }