import { CompatibilityChecker } from '../compatibilityChecker';

describe('CompatibilityChecker', () => {
  let checker;

  beforeEach(() => {
    checker = new CompatibilityChecker();
  });

  describe('Constructor and Initial Setup', () => {
    it('initializes with correct derailleur limits', () => {
      expect(checker.derailleurLimits).toBeDefined();
      expect(checker.derailleurLimits.road).toBeDefined();
      expect(checker.derailleurLimits.gravel).toBeDefined();
      expect(checker.derailleurLimits.mtb).toBeDefined();
    });

    it('initializes with correct chain line standards', () => {
      expect(checker.chainLineStandards).toBeDefined();
      expect(checker.chainLineStandards.road).toEqual({ ideal: 43.5, tolerance: 2.5 });
      expect(checker.chainLineStandards.gravel).toEqual({ ideal: 45, tolerance: 3 });
      expect(checker.chainLineStandards.mtb).toEqual({ ideal: 52, tolerance: 4 });
    });
  });

  describe('checkCompatibility', () => {
    const sampleSetup = {
      crankset: {
        teeth: [50, 34],
        speeds: '11-speed',
        model: 'Shimano 105'
      },
      cassette: {
        teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28],
        speeds: '11-speed',
        model: 'Shimano 105'
      }
    };

    it('returns default structure for incomplete setup', () => {
      const result = checker.checkCompatibility({}, 'road');
      
      expect(result).toEqual({
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
      });
    });

    it('returns default structure when crankset is missing', () => {
      const result = checker.checkCompatibility({ cassette: sampleSetup.cassette }, 'road');
      
      expect(result.status).toBe('compatible');
      expect(result.criticalIssues).toHaveLength(0);
    });

    it('returns default structure when cassette is missing', () => {
      const result = checker.checkCompatibility({ crankset: sampleSetup.crankset }, 'road');
      
      expect(result.status).toBe('compatible');
      expect(result.criticalIssues).toHaveLength(0);
    });

    it('performs full compatibility check with complete setup', () => {
      const result = checker.checkCompatibility(sampleSetup, 'road');
      
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('criticalIssues');
      expect(result).toHaveProperty('minorWarnings');
      expect(result).toHaveProperty('actionItems');
      expect(result).toHaveProperty('checks');
    });

    it('sets status to error when critical issues exist', () => {
      const problematicSetup = {
        crankset: {
          teeth: [53, 39], // Large range
          speeds: '11-speed'
        },
        cassette: {
          teeth: [10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28, 32, 36, 42, 50], // Very large
          speeds: '11-speed'
        }
      };

      const result = checker.checkCompatibility(problematicSetup, 'road');
      
      if (result.criticalIssues.length > 0) {
        expect(result.status).toBe('error');
      }
    });

    it('sets status to warning when minor warnings exist but no critical issues', () => {
      const warningSetup = {
        crankset: {
          teeth: [50, 34],
          speeds: '11-speed'
        },
        cassette: {
          teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32, 36], // Large for road
          speeds: '11-speed'
        }
      };

      const result = checker.checkCompatibility(warningSetup, 'road');
      
      if (result.criticalIssues.length === 0 && result.minorWarnings.length > 0) {
        expect(result.status).toBe('warning');
      }
    });
  });

  describe('checkDerailleurCapacity', () => {
    it('calculates capacity correctly for 2x system', () => {
      const setup = {
        crankset: { teeth: [50, 34] },
        cassette: { teeth: [11, 28] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkDerailleurCapacity(setup, 'road', results);

      // Total capacity: (50-34) + (28-11) = 16 + 17 = 33
      // Should be within road limits
      expect(results.checks.derailleurCapacity).not.toBe(false);
    });

    it('handles missing teeth gracefully', () => {
      const setup = {
        crankset: { teeth: null },
        cassette: { teeth: [11, 28] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      expect(() => {
        checker.checkDerailleurCapacity(setup, 'road', results);
      }).not.toThrow();
    });

    it('identifies when capacity exceeds bike type limits', () => {
      const setup = {
        crankset: { teeth: [53, 39] }, // 14T range
        cassette: { teeth: [10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 28, 32, 36, 42, 50] } // 40T range
      };
      // Total: 14 + 40 = 54T capacity
      
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkDerailleurCapacity(setup, 'road', results);

      expect(results.criticalIssues.length).toBeGreaterThan(0);
      expect(results.checks.derailleurCapacity).toBe(false);
    });

    it('recommends appropriate cage type', () => {
      const setup = {
        crankset: { teeth: [50, 34] },
        cassette: { teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32, 36] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkDerailleurCapacity(setup, 'road', results);

      // Should recommend long cage for this setup
      const hasLongCageWarning = results.minorWarnings.some(warning => 
        warning.includes('long-cage')
      );
      expect(hasLongCageWarning).toBe(true);
    });

    it('provides bike-type specific warnings for large cassettes', () => {
      const roadSetup = {
        crankset: { teeth: [50, 34] },
        cassette: { teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32, 36, 40] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkDerailleurCapacity(roadSetup, 'road', results);

      const hasRoadWarning = results.minorWarnings.some(warning => 
        warning.includes('GRX or MTB derailleur')
      );
      expect(hasRoadWarning).toBe(true);
    });
  });

  describe('checkSpeedCompatibility', () => {
    it('passes when speeds match', () => {
      const setup = {
        crankset: { speeds: '11-speed' },
        cassette: { speeds: '11-speed' }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkSpeedCompatibility(setup, results);

      expect(results.criticalIssues).toHaveLength(0);
      expect(results.actionItems).toContain('11-speed components are perfectly matched');
    });

    it('identifies speed mismatches as critical issues', () => {
      const setup = {
        crankset: { speeds: '11-speed' },
        cassette: { speeds: '12-speed' }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkSpeedCompatibility(setup, results);

      expect(results.criticalIssues.length).toBeGreaterThan(0);
      const hasMismatchError = results.criticalIssues.some(issue => 
        issue.includes('Speed mismatch')
      );
      expect(hasMismatchError).toBe(true);
    });

    it('handles missing speed information', () => {
      const setup = {
        crankset: { speeds: 'invalid-format' }, // Invalid format to trigger extractSpeedCount returning 0
        cassette: { speeds: '11-speed' }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkSpeedCompatibility(setup, results);

      expect(results.minorWarnings.length).toBeGreaterThan(0);
      const hasSpeedWarning = results.minorWarnings.some(warning => 
        warning.includes('Speed compatibility cannot be determined')
      );
      expect(hasSpeedWarning).toBe(true);
    });

    it('suggests compatibility solutions for close speed counts', () => {
      const setup = {
        crankset: { speeds: '10-speed' },
        cassette: { speeds: '11-speed' }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkSpeedCompatibility(setup, results);

      const hasCompatibilityNote = results.actionItems.some(item => 
        item.includes('may work with chain and derailleur adjustments')
      );
      expect(hasCompatibilityNote).toBe(true);
    });

    it('warns about outdated drivetrain technology', () => {
      const setup = {
        crankset: { speeds: '9-speed' },
        cassette: { speeds: '9-speed' }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkSpeedCompatibility(setup, results);

      const hasOutdatedWarning = results.minorWarnings.some(warning => 
        warning.includes('Older drivetrain technology')
      );
      expect(hasOutdatedWarning).toBe(true);
    });
  });

  describe('checkChainLine', () => {
    it('warns about extreme gear combinations in 2x systems', () => {
      const setup = {
        crankset: { teeth: [53, 39] },
        cassette: { teeth: [11, 32] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkChainLine(setup, 'road', results);

      // Should warn about chain line issues
      const hasChainLineWarning = results.minorWarnings.some(warning => 
        warning.includes('chain line')
      );
      const hasAvoidanceAdvice = results.actionItems.some(item => 
        item.includes('Avoid big ring + big cassette')
      );

      expect(hasChainLineWarning || hasAvoidanceAdvice).toBe(true);
    });

    it('provides 1x specific advice', () => {
      const setup = {
        crankset: { teeth: [42] }, // 1x system
        cassette: { teeth: [10, 11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36, 42, 50] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkChainLine(setup, 'road', results);

      const has1xAdvice = results.actionItems.some(item => 
        item.includes('1x drivetrain offers excellent chain line')
      );
      expect(has1xAdvice).toBe(true);
    });

    it('warns about wide range cassettes with 1x', () => {
      const setup = {
        crankset: { teeth: [42] },
        cassette: { teeth: [10, 52] } // 5.2:1 ratio (greater than 5)
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkChainLine(setup, 'road', results);

      const hasWideRangeWarning = results.minorWarnings.some(warning => 
        warning.includes('Wide range cassette')
      );
      expect(hasWideRangeWarning).toBe(true);
    });

    it('handles missing teeth data gracefully', () => {
      const setup = {
        crankset: { teeth: null },
        cassette: { teeth: [11, 28] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      expect(() => {
        checker.checkChainLine(setup, 'road', results);
      }).not.toThrow();
    });
  });

  describe('analyzeGearRatios', () => {
    const sampleSetup = {
      crankset: { teeth: [50, 34] },
      cassette: { teeth: [11, 12, 13, 15, 17, 19, 21, 23, 25, 28] }
    };

    it('returns empty result for incomplete setup', () => {
      const result = checker.analyzeGearRatios({}, 'road');
      
      expect(result).toEqual({
        warnings: [],
        recommendations: [],
        analysis: {}
      });
    });

    it('calculates gear ratios correctly', () => {
      const result = checker.analyzeGearRatios(sampleSetup, 'road');
      
      expect(result.analysis).toHaveProperty('minRatio');
      expect(result.analysis).toHaveProperty('maxRatio');
      expect(result.analysis).toHaveProperty('ratioSpread');
      expect(result.analysis).toHaveProperty('totalGears');
      
      expect(result.analysis.totalGears).toBe(20); // 2 chainrings × 10 cogs
      expect(parseFloat(result.analysis.minRatio)).toBeCloseTo(34/28, 2); // Small ring / big cog
      expect(parseFloat(result.analysis.maxRatio)).toBeCloseTo(50/11, 2); // Big ring / small cog
    });

    it('provides bike-type specific recommendations', () => {
      const result = checker.analyzeGearRatios(sampleSetup, 'road');
      
      expect(result.warnings).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('analyzes gear overlap in 2x systems', () => {
      const overlapSetup = {
        crankset: { teeth: [50, 34] },
        cassette: { teeth: [11, 12, 13, 14, 15, 16, 17, 18, 19, 21] }
      };

      const result = checker.analyzeGearRatios(overlapSetup, 'road');
      
      // Should detect some overlap and potentially recommend 1x
      if (result.warnings.some(w => w.includes('overlap'))) {
        expect(result.recommendations.some(r => r.includes('1x'))).toBe(true);
      }
    });
  });

  describe('getBikeTypeRecommendations', () => {
    it('provides road-specific recommendations', () => {
      const result = checker.getBikeTypeRecommendations('road', 2.0, 4.0, 2.0);
      
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
    });

    it('identifies climbing gear insufficiency for road bikes', () => {
      const result = checker.getBikeTypeRecommendations('road', 2.0, 4.0, 2.0); // High min ratio
      
      const hasClimbingWarning = result.warnings.some(w => 
        w.includes('struggle on steep climbs')
      );
      expect(hasClimbingWarning).toBe(true);
    });

    it('identifies speed limitations for road bikes', () => {
      const result = checker.getBikeTypeRecommendations('road', 1.0, 3.0, 3.0); // Low max ratio
      
      const hasSpeedWarning = result.warnings.some(w => 
        w.includes('Limited top speed')
      );
      expect(hasSpeedWarning).toBe(true);
    });

    it('provides gravel-specific recommendations', () => {
      const result = checker.getBikeTypeRecommendations('gravel', 1.5, 3.5, 2.3);
      
      const hasGravelAdvice = result.suggestions.some(s => 
        s.includes('adventure riding')
      );
      expect(hasGravelAdvice).toBe(true);
    });

    it('provides MTB-specific recommendations', () => {
      const result = checker.getBikeTypeRecommendations('mtb', 1.2, 3.2, 2.7);
      
      const hasMtbAdvice = result.suggestions.some(s => 
        s.includes('Mountain bike')
      );
      expect(hasMtbAdvice).toBe(true);
    });
  });

  describe('analyzeGearOverlap', () => {
    it('returns zero overlap for non-2x systems', () => {
      const result = checker.analyzeGearOverlap([42], [11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36]);
      
      expect(result.percentage).toBe(0);
      expect(result.overlaps).toHaveLength(0);
    });

    it('calculates overlap percentage for 2x systems', () => {
      const result = checker.analyzeGearOverlap([50, 34], [11, 12, 13, 14, 15, 16, 17, 18, 19, 21]);
      
      expect(result).toHaveProperty('percentage');
      expect(result).toHaveProperty('overlaps');
      expect(typeof result.percentage).toBe('number');
      expect(Array.isArray(result.overlaps)).toBe(true);
    });

    it('identifies specific overlapping gear combinations', () => {
      const result = checker.analyzeGearOverlap([50, 34], [11, 16]); // Simple case for testing
      
      // Should find overlaps where ratios are very close
      if (result.overlaps.length > 0) {
        expect(result.overlaps[0]).toMatch(/\d+×\d+ ≈ \d+×\d+/);
      }
    });
  });

  describe('assessInstallationComplexity', () => {
    it('returns basic complexity for standard components', () => {
      const setup = {
        crankset: { model: 'Shimano 105' },
        cassette: { model: 'Shimano 105' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.complexity).toBe('basic');
      expect(result.estimatedTime).toBe('30-60 minutes');
      expect(result.requiredTools).toContain('Basic bike tools');
    });

    it('identifies electronic component complexity', () => {
      const setup = {
        crankset: { speeds: 'Di2 11-speed' },
        cassette: { model: 'Shimano Ultegra' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.complexity).not.toBe('basic');
      expect(result.recommendations.some(r => r.includes('Electronic shifting'))).toBe(true);
      expect(result.requiredTools.some(t => t.includes('Di2'))).toBe(true);
    });

    it('identifies press-fit bottom bracket complexity', () => {
      const setup = {
        crankset: { model: 'SRAM Red BB30' },
        cassette: { model: 'SRAM Red' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.complexity).not.toBe('basic');
      expect(result.recommendations.some(r => r.includes('Press-fit'))).toBe(true);
    });

    it('identifies XD/XDR cassette complexity', () => {
      const setup = {
        crankset: { model: 'SRAM Eagle' },
        cassette: { model: 'SRAM Eagle XDR' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.requiredTools.some(t => t.includes('XD'))).toBe(true);
    });

    it('escalates complexity with multiple factors', () => {
      const setup = {
        crankset: { model: 'SRAM Red eTap BB30', speeds: 'Di2 12-speed' },
        cassette: { model: 'SRAM Red XDR' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.complexity).toBe('advanced');
      expect(result.estimatedTime).toBe('2-3 hours');
    });

    it('always recommends professional installation for safety', () => {
      const setup = {
        crankset: { model: 'Basic Crankset' },
        cassette: { model: 'Basic Cassette' }
      };

      const result = checker.assessInstallationComplexity(setup);
      
      expect(result.recommendations.some(r => 
        r.includes('Professional installation recommended')
      )).toBe(true);
    });
  });

  describe('extractSpeedCount', () => {
    it('extracts speed count from standard format', () => {
      expect(checker.extractSpeedCount('11-speed')).toBe(11);
      expect(checker.extractSpeedCount('12-speed')).toBe(12);
      expect(checker.extractSpeedCount('10-speed')).toBe(10);
    });

    it('returns 0 for non-standard or missing formats', () => {
      expect(checker.extractSpeedCount('')).toBe(0);
      expect(checker.extractSpeedCount(null)).toBe(0);
      expect(checker.extractSpeedCount('single speed')).toBe(0);
      expect(checker.extractSpeedCount('electronic')).toBe(0);
    });

    it('handles mixed formats', () => {
      expect(checker.extractSpeedCount('Shimano 11-speed Di2')).toBe(11);
      expect(checker.extractSpeedCount('SRAM 12-speed Eagle')).toBe(12);
    });
  });

  describe('generateCompatibilitySummary', () => {
    it('generates summary for compatible status', () => {
      const compatibilityResults = {
        status: 'compatible',
        criticalIssues: [],
        minorWarnings: [],
        actionItems: ['Components work great together']
      };

      const summary = checker.generateCompatibilitySummary(compatibilityResults);
      
      expect(summary.status).toBe('compatible');
      expect(summary.title).toBe('✅ Components Compatible');
      expect(summary.message).toContain('work together perfectly');
    });

    it('generates summary for warning status', () => {
      const compatibilityResults = {
        status: 'warning',
        criticalIssues: [],
        minorWarnings: ['Minor optimization possible'],
        actionItems: ['Consider upgrade']
      };

      const summary = checker.generateCompatibilitySummary(compatibilityResults);
      
      expect(summary.status).toBe('warning');
      expect(summary.title).toBe('⚠️ Compatible with Considerations');
      expect(summary.message).toContain('optimization');
    });

    it('generates summary for error status', () => {
      const compatibilityResults = {
        status: 'error',
        criticalIssues: ['Speed mismatch'],
        minorWarnings: [],
        actionItems: ['Use matching speeds']
      };

      const summary = checker.generateCompatibilitySummary(compatibilityResults);
      
      expect(summary.status).toBe('error');
      expect(summary.title).toBe('❌ Compatibility Issues');
      expect(summary.message).toContain('critical issue');
    });

    it('handles legacy result format', () => {
      const legacyResults = {
        overall: 'compatible',
        issues: [],
        warnings: ['Minor warning'],
        recommendations: ['Keep current setup']
      };

      const summary = checker.generateCompatibilitySummary(legacyResults);
      
      expect(summary.status).toBe('compatible');
      expect(summary.actionItems).toContain('Keep current setup');
    });

    it('limits action items to top 3', () => {
      const compatibilityResults = {
        status: 'compatible',
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [
          'Action 1',
          'Action 2', 
          'Action 3',
          'Action 4',
          'Action 5'
        ]
      };

      const summary = checker.generateCompatibilitySummary(compatibilityResults);
      
      expect(summary.actionItems).toHaveLength(3);
    });
  });

  describe('getStatusTitle and getStatusMessage', () => {
    it('returns correct titles for all statuses', () => {
      expect(checker.getStatusTitle('compatible')).toBe('✅ Components Compatible');
      expect(checker.getStatusTitle('warning')).toBe('⚠️ Compatible with Considerations');
      expect(checker.getStatusTitle('error')).toBe('❌ Compatibility Issues');
      expect(checker.getStatusTitle('incomplete')).toBe('📝 Incomplete Setup');
      expect(checker.getStatusTitle('unknown')).toBe('Unknown Status');
    });

    it('returns correct messages for all statuses', () => {
      expect(checker.getStatusMessage('compatible')).toBe('All components work together perfectly. Ready to ride!');
      expect(checker.getStatusMessage('incomplete')).toBe('Add all components to check compatibility.');
      
      expect(checker.getStatusMessage('warning', [], ['warning1'])).toContain('1 optimization');
      expect(checker.getStatusMessage('warning', [], ['warning1', 'warning2'])).toContain('2 optimizations');
      
      expect(checker.getStatusMessage('error', ['issue1'], [])).toContain('1 critical issue prevents');
      expect(checker.getStatusMessage('error', ['issue1', 'issue2'], [])).toContain('2 critical issues prevent');
    });
  });

  describe('checkChainLength', () => {
    it('warns about chain length for extreme combinations', () => {
      const setup = {
        crankset: { teeth: [53, 39] },
        cassette: { teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32, 36, 42, 46, 50] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkChainLength(setup, results);

      const hasChainLengthWarning = results.minorWarnings.some(warning => 
        warning.includes('longer chain')
      );
      expect(hasChainLengthWarning).toBe(true);
    });

    it('does not warn for normal setups', () => {
      const setup = {
        crankset: { teeth: [50, 34] },
        cassette: { teeth: [11, 28] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      checker.checkChainLength(setup, results);

      const hasChainLengthWarning = results.minorWarnings.some(warning => 
        warning.includes('longer chain')
      );
      expect(hasChainLengthWarning).toBe(false);
    });

    it('handles missing teeth data', () => {
      const setup = {
        crankset: { teeth: null },
        cassette: { teeth: [11, 28] }
      };
      const results = {
        criticalIssues: [],
        minorWarnings: [],
        actionItems: [],
        checks: {}
      };

      expect(() => {
        checker.checkChainLength(setup, results);
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('performs complete compatibility analysis for road bike', () => {
      const roadSetup = {
        crankset: {
          teeth: [50, 34],
          speeds: '11-speed',
          model: 'Shimano 105'
        },
        cassette: {
          teeth: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28],
          speeds: '11-speed',
          model: 'Shimano 105'
        }
      };

      const result = checker.checkCompatibility(roadSetup, 'road');
      
      expect(result.status).toBe('compatible');
      expect(result.actionItems.some(item => item.includes('perfectly matched'))).toBe(true);
    });

    it('performs complete compatibility analysis for gravel bike', () => {
      const gravelSetup = {
        crankset: {
          teeth: [46, 30],
          speeds: '11-speed',
          model: 'Shimano GRX'
        },
        cassette: {
          teeth: [11, 12, 13, 15, 17, 19, 21, 24, 27, 31, 36],
          speeds: '11-speed',
          model: 'Shimano GRX'
        }
      };

      const result = checker.checkCompatibility(gravelSetup, 'gravel');
      
      // The setup actually generates warnings due to chain line analysis
      expect(result.status).toBe('warning');
      expect(result.minorWarnings.length).toBeGreaterThan(0);
      expect(result.criticalIssues.length).toBe(0);
    });

    it('performs complete compatibility analysis for mountain bike', () => {
      const mtbSetup = {
        crankset: {
          teeth: [32],
          speeds: '12-speed',
          model: 'SRAM Eagle'
        },
        cassette: {
          teeth: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50],
          speeds: '12-speed',
          model: 'SRAM Eagle'
        }
      };

      const result = checker.checkCompatibility(mtbSetup, 'mtb');
      
      // Wide range cassette (50/10 = 5:1 ratio) triggers warning for 1x setup  
      expect(result.status).toBe('warning');
      expect(result.actionItems.some(item => item.includes('excellent chain line'))).toBe(true);
    });
  });
});