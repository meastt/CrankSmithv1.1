import { CompatibilityChecker } from '../../lib/compatibilityChecker'

describe('CompatibilityChecker', () => {
  let checker

  beforeEach(() => {
    checker = new CompatibilityChecker()
  })

  describe('constructor', () => {
    it('should initialize with correct derailleur limits', () => {
      expect(checker.derailleurLimits.road.shortCage.maxCapacity).toBe(29)
      expect(checker.derailleurLimits.gravel.mediumCage.maxCog).toBe(42)
      expect(checker.derailleurLimits.mtb.longCage.maxCapacity).toBe(41)
    })

    it('should initialize with correct chain line standards', () => {
      expect(checker.chainLineStandards.road.ideal).toBe(43.5)
      expect(checker.chainLineStandards.gravel.tolerance).toBe(3)
      expect(checker.chainLineStandards.mtb.ideal).toBe(52)
    })
  })

  describe('checkCompatibility', () => {
    const mockSetup = {
      crankset: {
        model: 'Shimano 105 R7000',
        chainrings: [50, 34],
        speeds: 11,
        brand: 'Shimano'
      },
      cassette: {
        model: 'Shimano 105 R7000',
        cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30],
        speeds: 11,
        brand: 'Shimano'
      }
    }

    it('should return compatible status for valid road setup', () => {
      const result = checker.checkCompatibility(mockSetup, 'road')
      
      expect(result.status).toBe('compatible')
      expect(result.criticalIssues).toHaveLength(0)
      expect(result.checks.speedCompatibility).toBe(true)
    })

    it('should detect speed incompatibility', () => {
      const incompatibleSetup = {
        ...mockSetup,
        crankset: { ...mockSetup.crankset, speeds: 10 },
        cassette: { ...mockSetup.cassette, speeds: 11 }
      }

      const result = checker.checkCompatibility(incompatibleSetup, 'road')
      
      expect(result.status).toBe('error')
      expect(result.criticalIssues).toContain(
        expect.stringContaining('Speed mismatch')
      )
      expect(result.checks.speedCompatibility).toBe(false)
    })

    it('should detect derailleur capacity issues', () => {
      const largeSetup = {
        crankset: {
          model: 'Test Crankset',
          chainrings: [53, 39], // 14 tooth difference
          speeds: 11
        },
        cassette: {
          model: 'Test Cassette',
          cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 32], // 21 tooth difference
          speeds: 11
        }
      }

      const result = checker.checkCompatibility(largeSetup, 'road')
      
      // Total capacity needed: 14 + 21 = 35, exceeds short cage limit of 29
      expect(result.status).toBe('warning')
      expect(result.minorWarnings).toContain(
        expect.stringContaining('derailleur capacity')
      )
    })

    it('should handle missing components gracefully', () => {
      const incompleteSetup = {
        crankset: mockSetup.crankset
        // Missing cassette
      }

      const result = checker.checkCompatibility(incompleteSetup, 'road')
      
      expect(result.status).toBe('error')
      expect(result.criticalIssues).toContain(
        expect.stringContaining('Missing required components')
      )
    })

    it('should validate different bike types', () => {
      const mtbSetup = {
        crankset: {
          model: 'SRAM NX Eagle',
          chainrings: [32],
          speeds: 12
        },
        cassette: {
          model: 'SRAM NX Eagle',
          cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50],
          speeds: 12
        }
      }

      const result = checker.checkCompatibility(mtbSetup, 'mtb')
      expect(result.status).toBe('compatible')
    })
  })

  describe('generateCompatibilitySummary', () => {
    it('should generate summary for compatible setup', () => {
      const mockAnalysis = {
        status: 'compatible',
        criticalIssues: [],
        minorWarnings: [],
        actionItems: ['Consider upgrading chain for optimal performance']
      }

      const summary = checker.generateCompatibilitySummary(mockAnalysis)
      
      expect(summary.status).toBe('compatible')
      expect(summary.title).toContain('Compatible')
      expect(summary.message).toContain('compatible')
      expect(summary.actionItems).toHaveLength(1)
    })

    it('should generate summary for incompatible setup', () => {
      const mockAnalysis = {
        status: 'error',
        criticalIssues: ['Speed mismatch detected'],
        minorWarnings: [],
        actionItems: ['Use matching 11-speed components']
      }

      const summary = checker.generateCompatibilitySummary(mockAnalysis)
      
      expect(summary.status).toBe('error')
      expect(summary.title).toContain('Issues')
      expect(summary.criticalIssues).toHaveLength(1)
    })

    it('should generate summary for setup with warnings', () => {
      const mockAnalysis = {
        status: 'warning',
        criticalIssues: [],
        minorWarnings: ['Consider longer cage derailleur'],
        actionItems: ['Upgrade to medium or long cage']
      }

      const summary = checker.generateCompatibilitySummary(mockAnalysis)
      
      expect(summary.status).toBe('warning')
      expect(summary.title).toContain('Review')
      expect(summary.minorWarnings).toHaveLength(1)
    })
  })

  describe('calculateDerailleurCapacity', () => {
    it('should calculate capacity correctly', () => {
      const crankset = { chainrings: [50, 34] }
      const cassette = { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30] }
      
      const capacity = checker.calculateDerailleurCapacity(crankset, cassette)
      
      // (50-34) + (30-11) = 16 + 19 = 35
      expect(capacity).toBe(35)
    })

    it('should handle single chainring', () => {
      const crankset = { chainrings: [32] }
      const cassette = { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50] }
      
      const capacity = checker.calculateDerailleurCapacity(crankset, cassette)
      
      // 0 + (50-10) = 40
      expect(capacity).toBe(40)
    })

    it('should handle invalid inputs', () => {
      expect(() => {
        checker.calculateDerailleurCapacity({}, { cogs: [11, 30] })
      }).toThrow()

      expect(() => {
        checker.calculateDerailleurCapacity({ chainrings: [50, 34] }, {})
      }).toThrow()
    })
  })

  describe('checkBrandCompatibility', () => {
    it('should approve same brand components', () => {
      const setup = {
        crankset: { brand: 'Shimano' },
        cassette: { brand: 'Shimano' }
      }
      
      const result = checker.checkBrandCompatibility(setup)
      expect(result.compatible).toBe(true)
    })

    it('should warn about mixed brands with potential issues', () => {
      const setup = {
        crankset: { brand: 'Shimano' },
        cassette: { brand: 'SRAM' }
      }
      
      const result = checker.checkBrandCompatibility(setup)
      expect(result.compatible).toBe(true) // Usually works but with warnings
      expect(result.warnings).toContain(
        expect.stringContaining('Mixed brands')
      )
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle undefined inputs', () => {
      const result = checker.checkCompatibility(undefined, 'road')
      expect(result.status).toBe('error')
    })

    it('should handle invalid bike type', () => {
      const result = checker.checkCompatibility({}, 'invalid')
      expect(result.status).toBe('error')
    })

    it('should handle malformed component data', () => {
      const badSetup = {
        crankset: { chainrings: 'not-an-array' },
        cassette: { cogs: null }
      }
      
      const result = checker.checkCompatibility(badSetup, 'road')
      expect(result.status).toBe('error')
    })
  })
})