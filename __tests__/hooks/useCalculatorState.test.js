import { renderHook, act } from '@testing-library/react'
import { useCalculatorState } from '../../hooks/useCalculatorState'

// Mock the calculateRealPerformance module
jest.mock('../../lib/calculateRealPerformance', () => ({
  calculateRealPerformance: jest.fn(),
  validateSetupComplete: jest.fn()
}))

// Mock the Toast component
jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))

describe('useCalculatorState', () => {
  let mockCalculateRealPerformance
  let mockValidateSetupComplete

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    mockCalculateRealPerformance = require('../../lib/calculateRealPerformance').calculateRealPerformance
    mockValidateSetupComplete = require('../../lib/calculateRealPerformance').validateSetupComplete
    
    // Default mock implementations
    mockValidateSetupComplete.mockReturnValue({
      isComplete: false,
      completion: 0,
      missing: ['crankset', 'cassette', 'wheel', 'tire']
    })
    
    mockCalculateRealPerformance.mockResolvedValue({
      current: { speed: 25, gearRange: 400 },
      proposed: { speed: 30, gearRange: 450 }
    })
  })

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      expect(result.current.bikeType).toBe('')
      expect(result.current.currentSetup).toEqual({
        wheel: '',
        tire: '',
        crankset: null,
        cassette: null
      })
      expect(result.current.proposedSetup).toEqual({
        wheel: '',
        tire: '',
        crankset: null,
        cassette: null
      })
      expect(result.current.results).toBe(null)
      expect(result.current.loading).toBe(false)
      expect(result.current.speedUnit).toBe('mph')
      expect(result.current.compatibilityResults).toBe(null)
    })

    it('should initialize validation state correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      expect(result.current.validation.canAnalyze).toBe(false)
      expect(result.current.validation.totalCompletion).toBe(0)
      expect(mockValidateSetupComplete).toHaveBeenCalledTimes(2)
    })
  })

  describe('bike type management', () => {
    it('should set bike type correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      act(() => {
        result.current.setBikeType('road')
      })
      
      expect(result.current.bikeType).toBe('road')
    })

    it('should handle different bike types', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const bikeTypes = ['road', 'gravel', 'mtb']
      
      bikeTypes.forEach(type => {
        act(() => {
          result.current.setBikeType(type)
        })
        expect(result.current.bikeType).toBe(type)
      })
    })
  })

  describe('setup updates', () => {
    it('should update current setup correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const testCrankset = { model: 'Shimano 105', chainrings: [50, 34] }
      
      act(() => {
        result.current.updateCurrentSetup({ crankset: testCrankset })
      })
      
      expect(result.current.currentSetup.crankset).toEqual(testCrankset)
      expect(result.current.currentSetup.wheel).toBe('') // Other properties unchanged
    })

    it('should update proposed setup correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const testCassette = { model: 'Shimano Ultegra', cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30] }
      
      act(() => {
        result.current.updateProposedSetup({ cassette: testCassette })
      })
      
      expect(result.current.proposedSetup.cassette).toEqual(testCassette)
      expect(result.current.proposedSetup.wheel).toBe('') // Other properties unchanged
    })

    it('should handle multiple updates to setup', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      act(() => {
        result.current.updateCurrentSetup({ 
          wheel: '700c',
          tire: '25'
        })
      })
      
      expect(result.current.currentSetup.wheel).toBe('700c')
      expect(result.current.currentSetup.tire).toBe('25')
    })

    it('should merge updates correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const crankset = { model: 'Test Crankset' }
      const cassette = { model: 'Test Cassette' }
      
      act(() => {
        result.current.updateProposedSetup({ crankset })
      })
      
      act(() => {
        result.current.updateProposedSetup({ cassette })
      })
      
      expect(result.current.proposedSetup.crankset).toEqual(crankset)
      expect(result.current.proposedSetup.cassette).toEqual(cassette)
    })
  })

  describe('validation logic', () => {
    it('should update validation when setups change', () => {
      mockValidateSetupComplete.mockReturnValueOnce({
        isComplete: true,
        completion: 100,
        missing: []
      }).mockReturnValueOnce({
        isComplete: true,
        completion: 100,
        missing: []
      })

      const { result } = renderHook(() => useCalculatorState())
      
      act(() => {
        result.current.updateCurrentSetup({ 
          crankset: { model: 'Test' },
          cassette: { model: 'Test' },
          wheel: '700c',
          tire: '25'
        })
      })
      
      expect(result.current.validation.canAnalyze).toBe(true)
      expect(result.current.validation.totalCompletion).toBe(100)
    })

    it('should calculate partial completion correctly', () => {
      mockValidateSetupComplete.mockReturnValueOnce({
        isComplete: false,
        completion: 50,
        missing: ['cassette', 'tire']
      }).mockReturnValueOnce({
        isComplete: false,
        completion: 75,
        missing: ['tire']
      })

      const { result } = renderHook(() => useCalculatorState())
      
      act(() => {
        result.current.updateCurrentSetup({ crankset: { model: 'Test' } })
      })
      
      expect(result.current.validation.totalCompletion).toBe(62.5) // (50 + 75) / 2
    })

    it('should handle NaN completion values', () => {
      mockValidateSetupComplete.mockReturnValue({
        isComplete: false,
        completion: NaN,
        missing: []
      })

      const { result } = renderHook(() => useCalculatorState())
      
      expect(result.current.validation.totalCompletion).toBe(0)
    })
  })

  describe('calculations', () => {
    it('should perform calculations when valid setups exist', async () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const mockResults = {
        current: { speed: 25, gearRange: 400 },
        proposed: { speed: 30, gearRange: 450 }
      }
      
      mockCalculateRealPerformance.mockResolvedValue(mockResults)
      
      await act(async () => {
        await result.current.calculateResults()
      })
      
      expect(result.current.results).toEqual(mockResults)
      expect(mockCalculateRealPerformance).toHaveBeenCalledWith(
        result.current.currentSetup,
        result.current.proposedSetup,
        result.current.bikeType,
        result.current.speedUnit
      )
    })

    it('should handle loading state during calculations', async () => {
      const { result } = renderHook(() => useCalculatorState())
      
      // Make calculation take time
      mockCalculateRealPerformance.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )
      
      let loadingDuringCalculation = false
      
      act(() => {
        result.current.calculateResults().then(() => {
          // Loading should be false after completion
        })
        // Check loading state immediately after starting
        loadingDuringCalculation = result.current.loading
      })
      
      expect(loadingDuringCalculation).toBe(true)
      
      // Wait for calculation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
      })
      
      expect(result.current.loading).toBe(false)
    })

    it('should handle calculation errors gracefully', async () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockCalculateRealPerformance.mockRejectedValue(new Error('Calculation failed'))
      
      await act(async () => {
        try {
          await result.current.calculateResults()
        } catch (error) {
          // Expected to throw
        }
      })
      
      expect(result.current.loading).toBe(false)
      expect(consoleError).toHaveBeenCalled()
      
      consoleError.mockRestore()
    })
  })

  describe('reset functionality', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      // Set some state first
      act(() => {
        result.current.setBikeType('road')
        result.current.updateCurrentSetup({ wheel: '700c' })
        result.current.updateProposedSetup({ tire: '25' })
        result.current.setResults({ test: 'data' })
        result.current.setCompatibilityResults({ status: 'compatible' })
      })
      
      // Reset
      act(() => {
        result.current.resetCalculator()
      })
      
      expect(result.current.bikeType).toBe('')
      expect(result.current.currentSetup).toEqual({
        wheel: '',
        tire: '',
        crankset: null,
        cassette: null
      })
      expect(result.current.proposedSetup).toEqual({
        wheel: '',
        tire: '',
        crankset: null,
        cassette: null
      })
      expect(result.current.results).toBe(null)
      expect(result.current.compatibilityResults).toBe(null)
    })
  })

  describe('speed unit management', () => {
    it('should switch speed units correctly', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      expect(result.current.speedUnit).toBe('mph')
      
      act(() => {
        result.current.setSpeedUnit('kmh')
      })
      
      expect(result.current.speedUnit).toBe('kmh')
    })
  })

  describe('compatibility results', () => {
    it('should set and clear compatibility results', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const compatibilityData = {
        status: 'compatible',
        issues: []
      }
      
      act(() => {
        result.current.setCompatibilityResults(compatibilityData)
      })
      
      expect(result.current.compatibilityResults).toEqual(compatibilityData)
      
      act(() => {
        result.current.setCompatibilityResults(null)
      })
      
      expect(result.current.compatibilityResults).toBe(null)
    })
  })

  describe('memoization and performance', () => {
    it('should memoize validation results', () => {
      const { result, rerender } = renderHook(() => useCalculatorState())
      
      const validation1 = result.current.validation
      
      // Rerender without changing dependencies
      rerender()
      
      const validation2 = result.current.validation
      
      expect(validation1).toBe(validation2) // Same object reference
    })

    it('should update memoized validation when dependencies change', () => {
      const { result } = renderHook(() => useCalculatorState())
      
      const validation1 = result.current.validation
      
      act(() => {
        result.current.updateCurrentSetup({ wheel: '700c' })
      })
      
      const validation2 = result.current.validation
      
      expect(validation1).not.toBe(validation2) // Different object reference
    })

    it('should have stable update functions', () => {
      const { result, rerender } = renderHook(() => useCalculatorState())
      
      const updateCurrent1 = result.current.updateCurrentSetup
      const updateProposed1 = result.current.updateProposedSetup
      const reset1 = result.current.resetCalculator
      
      rerender()
      
      const updateCurrent2 = result.current.updateCurrentSetup
      const updateProposed2 = result.current.updateProposedSetup
      const reset2 = result.current.resetCalculator
      
      expect(updateCurrent1).toBe(updateCurrent2)
      expect(updateProposed1).toBe(updateProposed2)
      expect(reset1).toBe(reset2)
    })
  })
})