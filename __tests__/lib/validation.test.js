import { 
  validateBikeFitInputs,
  validateComponentSetup,
  validateEmailFormat,
  validateRequired,
  validateNumericRange,
  validatePhoneNumber,
  cleanNumericInput
} from '../../lib/validation'

describe('validation utilities', () => {
  describe('validateRequired', () => {
    it('should validate required fields correctly', () => {
      expect(validateRequired('test')).toBe(true)
      expect(validateRequired('')).toBe(false)
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateRequired('   ')).toBe(false) // whitespace only
    })

    it('should handle numbers correctly', () => {
      expect(validateRequired(0)).toBe(true)
      expect(validateRequired(42)).toBe(true)
      expect(validateRequired(-1)).toBe(true)
    })

    it('should handle booleans correctly', () => {
      expect(validateRequired(true)).toBe(true)
      expect(validateRequired(false)).toBe(true)
    })
  })

  describe('validateEmailFormat', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@example.org',
        'user123@test-domain.co.uk'
      ]

      validEmails.forEach(email => {
        expect(validateEmailFormat(email)).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@@domain.com',
        'user name@domain.com',
        '',
        null,
        undefined
      ]

      invalidEmails.forEach(email => {
        expect(validateEmailFormat(email)).toBe(false)
      })
    })
  })

  describe('validateNumericRange', () => {
    it('should validate numbers within range', () => {
      expect(validateNumericRange(5, 1, 10)).toBe(true)
      expect(validateNumericRange(1, 1, 10)).toBe(true) // min boundary
      expect(validateNumericRange(10, 1, 10)).toBe(true) // max boundary
    })

    it('should reject numbers outside range', () => {
      expect(validateNumericRange(0, 1, 10)).toBe(false)
      expect(validateNumericRange(11, 1, 10)).toBe(false)
      expect(validateNumericRange(-5, 1, 10)).toBe(false)
    })

    it('should handle invalid inputs', () => {
      expect(validateNumericRange('not-a-number', 1, 10)).toBe(false)
      expect(validateNumericRange(null, 1, 10)).toBe(false)
      expect(validateNumericRange(undefined, 1, 10)).toBe(false)
    })

    it('should handle string numbers', () => {
      expect(validateNumericRange('5', 1, 10)).toBe(true)
      expect(validateNumericRange('0', 1, 10)).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    it('should validate common phone number formats', () => {
      const validPhones = [
        '+1234567890',
        '(123) 456-7890',
        '123-456-7890',
        '123.456.7890',
        '1234567890',
        '+1 (234) 567-8900'
      ]

      validPhones.forEach(phone => {
        expect(validatePhoneNumber(phone)).toBe(true)
      })
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        'phone-number',
        '123-45-678',
        '',
        null,
        undefined,
        '12345678901234567890' // too long
      ]

      invalidPhones.forEach(phone => {
        expect(validatePhoneNumber(phone)).toBe(false)
      })
    })
  })

  describe('cleanNumericInput', () => {
    it('should clean and convert numeric inputs', () => {
      expect(cleanNumericInput('123')).toBe(123)
      expect(cleanNumericInput('45.67')).toBe(45.67)
      expect(cleanNumericInput('  89  ')).toBe(89)
      expect(cleanNumericInput('12.34cm')).toBe(12.34)
    })

    it('should handle invalid inputs gracefully', () => {
      expect(cleanNumericInput('not-a-number')).toBe(0)
      expect(cleanNumericInput('')).toBe(0)
      expect(cleanNumericInput(null)).toBe(0)
      expect(cleanNumericInput(undefined)).toBe(0)
    })

    it('should preserve numbers as-is', () => {
      expect(cleanNumericInput(42)).toBe(42)
      expect(cleanNumericInput(3.14159)).toBe(3.14159)
      expect(cleanNumericInput(0)).toBe(0)
    })
  })

  describe('validateBikeFitInputs', () => {
    const validInputs = {
      inseam: 80,
      height: 175,
      armLength: 60,
      shoulderWidth: 40,
      method: 'lemond'
    }

    it('should validate complete and valid inputs', () => {
      const result = validateBikeFitInputs(validInputs)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const incompleteInputs = {
        inseam: 80,
        // missing height, armLength, shoulderWidth
      }

      const result = validateBikeFitInputs(incompleteInputs)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('height')
      )
    })

    it('should validate numeric ranges for body measurements', () => {
      const invalidRanges = {
        ...validInputs,
        inseam: 200, // too high
        height: 50,  // too low
        armLength: -10 // negative
      }

      const result = validateBikeFitInputs(invalidRanges)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should validate bike fit method', () => {
      const invalidMethod = {
        ...validInputs,
        method: 'invalid-method'
      }

      const result = validateBikeFitInputs(invalidMethod)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('method')
      )
    })

    it('should handle edge cases in measurements', () => {
      const edgeCases = [
        { ...validInputs, inseam: 70 }, // minimum valid
        { ...validInputs, height: 150 }, // minimum valid
        { ...validInputs, armLength: 55 }, // minimum valid
      ]

      edgeCases.forEach(inputs => {
        const result = validateBikeFitInputs(inputs)
        expect(result.isValid).toBe(true)
      })
    })
  })

  describe('validateComponentSetup', () => {
    const validSetup = {
      crankset: {
        model: 'Shimano 105',
        chainrings: [50, 34],
        speeds: 11
      },
      cassette: {
        model: 'Shimano 105',
        cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30],
        speeds: 11
      },
      wheel: '700c',
      tire: '25'
    }

    it('should validate complete component setup', () => {
      const result = validateComponentSetup(validSetup)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should detect missing components', () => {
      const incompleteSetup = {
        crankset: validSetup.crankset,
        // missing cassette, wheel, tire
      }

      const result = validateComponentSetup(incompleteSetup)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('cassette')
      )
    })

    it('should detect speed mismatches', () => {
      const mismatchedSetup = {
        ...validSetup,
        crankset: { ...validSetup.crankset, speeds: 10 },
        cassette: { ...validSetup.cassette, speeds: 11 }
      }

      const result = validateComponentSetup(mismatchedSetup)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('speed')
      )
    })

    it('should validate chainring configurations', () => {
      const invalidChainrings = {
        ...validSetup,
        crankset: {
          ...validSetup.crankset,
          chainrings: [] // empty chainrings
        }
      }

      const result = validateComponentSetup(invalidChainrings)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('chainring')
      )
    })

    it('should validate cassette cog configurations', () => {
      const invalidCogs = {
        ...validSetup,
        cassette: {
          ...validSetup.cassette,
          cogs: [11] // too few cogs
        }
      }

      const result = validateComponentSetup(invalidCogs)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        expect.stringContaining('cog')
      )
    })

    it('should generate warnings for unusual configurations', () => {
      const unusualSetup = {
        ...validSetup,
        crankset: {
          ...validSetup.crankset,
          chainrings: [53, 39] // Large chainrings
        },
        cassette: {
          ...validSetup.cassette,
          cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 34] // Large cassette
        }
      }

      const result = validateComponentSetup(unusualSetup)
      
      // May be valid but should generate warnings about derailleur capacity
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complex validation scenarios', () => {
      const complexScenario = {
        userInputs: {
          email: 'user@example.com',
          phone: '123-456-7890',
          inseam: 85,
          height: 180
        },
        bikeSetup: {
          crankset: { model: 'Test', chainrings: [50, 34], speeds: 11 },
          cassette: { model: 'Test', cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], speeds: 11 },
          wheel: '700c',
          tire: '25'
        }
      }

      expect(validateEmailFormat(complexScenario.userInputs.email)).toBe(true)
      expect(validatePhoneNumber(complexScenario.userInputs.phone)).toBe(true)
      expect(validateNumericRange(complexScenario.userInputs.inseam, 70, 100)).toBe(true)
      expect(validateComponentSetup(complexScenario.bikeSetup).isValid).toBe(true)
    })

    it('should handle edge cases gracefully', () => {
      // Test with null/undefined inputs
      expect(validateComponentSetup(null).isValid).toBe(false)
      expect(validateBikeFitInputs(undefined).isValid).toBe(false)
      
      // Test with empty objects
      expect(validateComponentSetup({}).isValid).toBe(false)
      expect(validateBikeFitInputs({}).isValid).toBe(false)
    })
  })
})