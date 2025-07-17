import {
  CADENCE_RPM,
  MM_TO_KM,
  KMH_TO_MPH,
  WHEEL_SIZES,
  calculateWheelCircumference,
  calculateGearRatio,
  calculateSpeed,
  calculateGearInches,
  checkDerailleurCompatibility
} from '../../lib/calculations'

describe('calculations', () => {
  describe('constants', () => {
    it('should have correct constant values', () => {
      expect(CADENCE_RPM).toBe(90)
      expect(MM_TO_KM).toBe(1e-6)
      expect(KMH_TO_MPH).toBeCloseTo(0.621371)
    })

    it('should have wheel sizes defined', () => {
      expect(WHEEL_SIZES['700c']).toBe(622)
      expect(WHEEL_SIZES['650b']).toBe(584)
      expect(WHEEL_SIZES['26-inch']).toBe(559)
      expect(WHEEL_SIZES['27.5-inch']).toBe(584)
      expect(WHEEL_SIZES['29-inch']).toBe(622)
    })
  })

  describe('calculateWheelCircumference', () => {
    it('should calculate circumference for 700c wheel with 25mm tire', () => {
      const circumference = calculateWheelCircumference('700c', '25')
      // (622 + 2*25) * π = 672 * π ≈ 2110.18
      expect(circumference).toBeCloseTo(2110.18, 1)
    })

    it('should calculate circumference for 650b wheel with 40mm tire', () => {
      const circumference = calculateWheelCircumference('650b', '40')
      // (584 + 2*40) * π = 664 * π ≈ 2086.06
      expect(circumference).toBeCloseTo(2086.06, 1)
    })

    it('should handle tire width as string', () => {
      const circumference = calculateWheelCircumference('700c', '28')
      expect(circumference).toBeCloseTo(2128.55, 1)
    })

    it('should throw error for invalid wheel size', () => {
      expect(() => {
        calculateWheelCircumference('invalid', '25')
      }).toThrow('Invalid wheel size: invalid')
    })

    it('should handle edge cases', () => {
      // Very thin tire
      const thin = calculateWheelCircumference('700c', '20')
      expect(thin).toBeGreaterThan(2000)

      // Very thick tire
      const thick = calculateWheelCircumference('700c', '50')
      expect(thick).toBeGreaterThan(2200)
    })
  })

  describe('calculateGearRatio', () => {
    it('should calculate basic gear ratios', () => {
      expect(calculateGearRatio(50, 10)).toBe(5.0)
      expect(calculateGearRatio(50, 25)).toBe(2.0)
      expect(calculateGearRatio(34, 28)).toBeCloseTo(1.214, 3)
    })

    it('should handle fractional results', () => {
      const ratio = calculateGearRatio(39, 21)
      expect(ratio).toBeCloseTo(1.857, 3)
    })

    it('should handle various chainring/cog combinations', () => {
      // High gear (big chainring, small cog)
      expect(calculateGearRatio(53, 11)).toBeCloseTo(4.818, 3)
      
      // Low gear (small chainring, big cog)
      expect(calculateGearRatio(34, 32)).toBeCloseTo(1.063, 3)
      
      // 1:1 ratio
      expect(calculateGearRatio(42, 42)).toBe(1.0)
    })
  })

  describe('calculateSpeed', () => {
    const testWheelCircumference = 2100 // approximately 700c x 25mm

    it('should calculate speed in KMH', () => {
      const gearRatio = 2.0
      const speed = calculateSpeed(gearRatio, testWheelCircumference, 'KMH')
      
      // 2.0 * 2100 * 90 * 1e-6 * 60 = 22.68 KMH
      expect(parseFloat(speed)).toBeCloseTo(22.7, 1)
    })

    it('should calculate speed in MPH', () => {
      const gearRatio = 2.0
      const speed = calculateSpeed(gearRatio, testWheelCircumference, 'MPH')
      
      // Convert 22.68 KMH to MPH: 22.68 * 0.621371 ≈ 14.1 MPH
      expect(parseFloat(speed)).toBeCloseTo(14.1, 1)
    })

    it('should default to KMH when unit not specified', () => {
      const gearRatio = 3.0
      const speed = calculateSpeed(gearRatio, testWheelCircumference)
      
      expect(parseFloat(speed)).toBeCloseTo(34.0, 1)
    })

    it('should handle extreme gear ratios', () => {
      // Very low gear
      const lowSpeed = calculateSpeed(1.0, testWheelCircumference)
      expect(parseFloat(lowSpeed)).toBeCloseTo(11.3, 1)
      
      // Very high gear
      const highSpeed = calculateSpeed(5.0, testWheelCircumference)
      expect(parseFloat(highSpeed)).toBeCloseTo(56.7, 1)
    })

    it('should return string with one decimal place', () => {
      const speed = calculateSpeed(2.0, testWheelCircumference)
      expect(speed).toMatch(/^\d+\.\d$/)
    })
  })

  describe('calculateGearInches', () => {
    it('should calculate gear inches for road setup', () => {
      const gearRatio = 2.0
      const gearInches = calculateGearInches(gearRatio, '700c', '25')
      
      // (622 + 2*25) / 25.4 * 2.0 ≈ 52.9 inches
      expect(gearInches).toBeCloseTo(52.9, 1)
    })

    it('should calculate gear inches for mountain bike', () => {
      const gearRatio = 1.5
      const gearInches = calculateGearInches(gearRatio, '29-inch', '2.25')
      
      expect(gearInches).toBeGreaterThan(35)
      expect(gearInches).toBeLessThan(45)
    })

    it('should handle different wheel sizes', () => {
      const gearRatio = 2.0
      
      const road = calculateGearInches(gearRatio, '700c', '25')
      const gravel = calculateGearInches(gearRatio, '650b', '40')
      
      expect(road).toBeGreaterThan(gravel) // 700c is larger than 650b
    })

    it('should be proportional to gear ratio', () => {
      const baseGearInches = calculateGearInches(1.0, '700c', '25')
      const doubleGearInches = calculateGearInches(2.0, '700c', '25')
      
      expect(doubleGearInches).toBeCloseTo(baseGearInches * 2, 1)
    })
  })

  describe('checkDerailleurCompatibility', () => {
    it('should check capacity requirements', () => {
      const crankset = { chainrings: [50, 34] }
      const cassette = { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 32] }
      
      const result = checkDerailleurCompatibility(crankset, cassette)
      
      expect(result).toHaveProperty('capacity')
      expect(result.capacity).toBe(35) // (50-34) + (32-11) = 16 + 21 = 35
    })

    it('should identify warnings for large capacity', () => {
      const crankset = { chainrings: [53, 39] }
      const cassette = { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 34] }
      
      const result = checkDerailleurCompatibility(crankset, cassette)
      
      expect(result.capacity).toBe(37) // (53-39) + (34-11) = 14 + 23 = 37
      expect(result.warnings).toContain(
        expect.stringContaining('Long cage')
      )
    })

    it('should handle single chainring setups', () => {
      const crankset = { chainrings: [32] }
      const cassette = { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50] }
      
      const result = checkDerailleurCompatibility(crankset, cassette)
      
      expect(result.capacity).toBe(40) // 0 + (50-10) = 40
    })

    it('should handle empty or invalid inputs', () => {
      expect(() => {
        checkDerailleurCompatibility({}, { cogs: [11, 32] })
      }).toThrow()

      expect(() => {
        checkDerailleurCompatibility({ chainrings: [50, 34] }, {})
      }).toThrow()
    })
  })

  describe('integration tests', () => {
    it('should work together for complete gear calculation', () => {
      // Complete calculation for a typical road bike setup
      const wheelSize = '700c'
      const tireWidth = '25'
      const chainring = 50
      const cog = 12
      
      const circumference = calculateWheelCircumference(wheelSize, tireWidth)
      const gearRatio = calculateGearRatio(chainring, cog)
      const speed = calculateSpeed(gearRatio, circumference)
      const gearInches = calculateGearInches(gearRatio, wheelSize, tireWidth)
      
      expect(parseFloat(speed)).toBeGreaterThan(40) // Should be fast gear
      expect(gearInches).toBeGreaterThan(100) // Should be high gear inches
      expect(gearRatio).toBeCloseTo(4.167, 3)
    })

    it('should handle gravel bike calculations', () => {
      // Gravel bike with 650b wheels
      const wheelSize = '650b'
      const tireWidth = '40'
      const chainring = 40
      const cog = 20
      
      const circumference = calculateWheelCircumference(wheelSize, tireWidth)
      const gearRatio = calculateGearRatio(chainring, cog)
      const speed = calculateSpeed(gearRatio, circumference)
      
      expect(parseFloat(speed)).toBeGreaterThan(15)
      expect(parseFloat(speed)).toBeLessThan(30)
      expect(gearRatio).toBe(2.0)
    })
  })
})