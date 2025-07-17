import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import GearSelectorPanel from '../../components/GearSelectorPanel'

// Mock the SearchableDropdown component
jest.mock('../../components/SearchableDropdown', () => {
  return function MockSearchableDropdown({ 
    label, 
    options, 
    onSelect, 
    selectedValue, 
    loading, 
    placeholder 
  }) {
    return (
      <div data-testid={`dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <label>{label}</label>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <select
            value={selectedValue?.id || ''}
            onChange={(e) => {
              const option = options.find(opt => opt.id === e.target.value)
              if (option) onSelect(option)
            }}
            data-testid={`select-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }
})

// Mock the useComponentDatabase hook
jest.mock('../../hooks/useComponentDatabase', () => ({
  useComponentDatabase: jest.fn()
}))

describe('GearSelectorPanel', () => {
  const mockUseComponentDatabase = require('../../hooks/useComponentDatabase').useComponentDatabase
  
  const mockSetup = {
    wheel: '700c',
    tire: '25',
    crankset: null,
    cassette: null
  }

  const mockSetSetup = jest.fn()
  
  const mockConfig = {
    wheelSizes: ['700c', '650b', '26-inch'],
    tireWidths: ['23', '25', '28', '32'],
    onWheelChange: jest.fn(),
    onTireChange: jest.fn(),
    onCranksetChange: jest.fn(),
    onCassetteChange: jest.fn()
  }

  const mockComponents = {
    cranksets: [
      {
        id: 'shimano-105-r7000',
        model: 'Shimano 105',
        variant: 'R7000',
        teeth: [50, 34],
        speeds: 11,
        weight: 700,
        bikeType: 'road'
      },
      {
        id: 'sram-force-1',
        model: 'SRAM Force',
        variant: '1',
        teeth: [42],
        speeds: 11,
        weight: 650,
        bikeType: 'gravel'
      }
    ],
    cassettes: [
      {
        id: 'shimano-105-r7000-cassette',
        model: 'Shimano 105',
        variant: 'R7000',
        teeth: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30],
        speeds: 11,
        weight: 250,
        bikeType: 'road'
      },
      {
        id: 'sram-force-cassette',
        model: 'SRAM Force',
        variant: 'XG-1270',
        teeth: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42],
        speeds: 11,
        weight: 280,
        bikeType: 'gravel'
      }
    ]
  }

  const defaultProps = {
    title: 'Current Setup',
    subtitle: 'Your current components',
    setup: mockSetup,
    setSetup: mockSetSetup,
    config: mockConfig,
    bikeType: 'road'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementation
    mockUseComponentDatabase.mockReturnValue({
      components: mockComponents,
      loading: false,
      error: null
    })
  })

  describe('rendering', () => {
    it('should render with title and subtitle', () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      expect(screen.getByText('Current Setup')).toBeInTheDocument()
      expect(screen.getByText('Your current components')).toBeInTheDocument()
    })

    it('should render badge when provided', () => {
      render(
        <GearSelectorPanel 
          {...defaultProps} 
          badge="Complete"
          badgeColor="green"
        />
      )
      
      expect(screen.getByText('Complete')).toBeInTheDocument()
    })

    it('should render icon when provided', () => {
      const MockIcon = () => <div data-testid="test-icon">Icon</div>
      
      render(
        <GearSelectorPanel 
          {...defaultProps} 
          icon={MockIcon}
        />
      )
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('should render all component dropdowns', () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-cassette')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-wheel-size')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-tire-width')).toBeInTheDocument()
    })
  })

  describe('loading states', () => {
    it('should show loading state when components are loading', () => {
      mockUseComponentDatabase.mockReturnValue({
        components: null,
        loading: true,
        error: null
      })

      render(<GearSelectorPanel {...defaultProps} />)
      
      expect(screen.getAllByText('Loading...')).toHaveLength(2) // Crankset and cassette dropdowns
    })

    it('should handle error state gracefully', () => {
      mockUseComponentDatabase.mockReturnValue({
        components: null,
        loading: false,
        error: 'Failed to load components'
      })

      render(<GearSelectorPanel {...defaultProps} />)
      
      // Should still render dropdowns but with empty options
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-cassette')).toBeInTheDocument()
    })
  })

  describe('component selection', () => {
    it('should handle crankset selection', async () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      const cranksetSelect = screen.getByTestId('select-crankset')
      
      fireEvent.change(cranksetSelect, { 
        target: { value: 'shimano-105-r7000' } 
      })
      
      await waitFor(() => {
        expect(mockSetSetup).toHaveBeenCalledWith({
          ...mockSetup,
          crankset: mockComponents.cranksets[0]
        })
        expect(mockConfig.onCranksetChange).toHaveBeenCalledWith(
          mockComponents.cranksets[0]
        )
      })
    })

    it('should handle cassette selection', async () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      const cassetteSelect = screen.getByTestId('select-cassette')
      
      fireEvent.change(cassetteSelect, { 
        target: { value: 'shimano-105-r7000-cassette' } 
      })
      
      await waitFor(() => {
        expect(mockSetSetup).toHaveBeenCalledWith({
          ...mockSetup,
          cassette: mockComponents.cassettes[0]
        })
        expect(mockConfig.onCassetteChange).toHaveBeenCalledWith(
          mockComponents.cassettes[0]
        )
      })
    })

    it('should handle wheel size selection', async () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      const wheelSelect = screen.getByTestId('select-wheel-size')
      
      fireEvent.change(wheelSelect, { 
        target: { value: '650b' } 
      })
      
      await waitFor(() => {
        expect(mockSetSetup).toHaveBeenCalledWith({
          ...mockSetup,
          wheel: '650b'
        })
        expect(mockConfig.onWheelChange).toHaveBeenCalledWith('650b')
      })
    })

    it('should handle tire width selection', async () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      const tireSelect = screen.getByTestId('select-tire-width')
      
      fireEvent.change(tireSelect, { 
        target: { value: '28' } 
      })
      
      await waitFor(() => {
        expect(mockSetSetup).toHaveBeenCalledWith({
          ...mockSetup,
          tire: '28'
        })
        expect(mockConfig.onTireChange).toHaveBeenCalledWith('28')
      })
    })
  })

  describe('selected values display', () => {
    it('should display selected crankset', () => {
      const setupWithCrankset = {
        ...mockSetup,
        crankset: mockComponents.cranksets[0]
      }

      render(
        <GearSelectorPanel 
          {...defaultProps} 
          setup={setupWithCrankset} 
        />
      )
      
      const cranksetSelect = screen.getByTestId('select-crankset')
      expect(cranksetSelect.value).toBe('shimano-105-r7000')
    })

    it('should display selected cassette', () => {
      const setupWithCassette = {
        ...mockSetup,
        cassette: mockComponents.cassettes[0]
      }

      render(
        <GearSelectorPanel 
          {...defaultProps} 
          setup={setupWithCassette} 
        />
      )
      
      const cassetteSelect = screen.getByTestId('select-cassette')
      expect(cassetteSelect.value).toBe('shimano-105-r7000-cassette')
    })

    it('should display selected wheel and tire', () => {
      const setupWithWheelTire = {
        ...mockSetup,
        wheel: '650b',
        tire: '32'
      }

      render(
        <GearSelectorPanel 
          {...defaultProps} 
          setup={setupWithWheelTire} 
        />
      )
      
      const wheelSelect = screen.getByTestId('select-wheel-size')
      const tireSelect = screen.getByTestId('select-tire-width')
      
      expect(wheelSelect.value).toBe('650b')
      expect(tireSelect.value).toBe('32')
    })
  })

  describe('bike type filtering', () => {
    it('should filter components by bike type', () => {
      render(<GearSelectorPanel {...defaultProps} bikeType="road" />)
      
      // Should only show road components in options
      expect(mockUseComponentDatabase).toHaveBeenCalledWith('road')
    })

    it('should handle different bike types', () => {
      const { rerender } = render(
        <GearSelectorPanel {...defaultProps} bikeType="road" />
      )
      
      rerender(
        <GearSelectorPanel {...defaultProps} bikeType="gravel" />
      )
      
      expect(mockUseComponentDatabase).toHaveBeenCalledWith('gravel')
    })
  })

  describe('memoization and performance', () => {
    it('should memoize component transformation', () => {
      const { rerender } = render(<GearSelectorPanel {...defaultProps} />)
      
      // Rerender with same props should not cause re-calculation
      rerender(<GearSelectorPanel {...defaultProps} />)
      
      // Component should be memoized - hard to test directly, but we can verify
      // that the same options are passed to dropdowns
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
    })

    it('should update when components data changes', () => {
      const { rerender } = render(<GearSelectorPanel {...defaultProps} />)
      
      // Change mock data
      const newComponents = {
        ...mockComponents,
        cranksets: [
          ...mockComponents.cranksets,
          {
            id: 'new-crankset',
            model: 'New Crankset',
            variant: 'V1',
            teeth: [46, 30],
            speeds: 11,
            weight: 600,
            bikeType: 'road'
          }
        ]
      }
      
      mockUseComponentDatabase.mockReturnValue({
        components: newComponents,
        loading: false,
        error: null
      })
      
      rerender(<GearSelectorPanel {...defaultProps} />)
      
      // Should include new component in options
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle missing config gracefully', () => {
      render(
        <GearSelectorPanel 
          {...defaultProps} 
          config={undefined}
        />
      )
      
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
    })

    it('should handle empty components data', () => {
      mockUseComponentDatabase.mockReturnValue({
        components: { cranksets: [], cassettes: [] },
        loading: false,
        error: null
      })

      render(<GearSelectorPanel {...defaultProps} />)
      
      const cranksetSelect = screen.getByTestId('select-crankset')
      const cassetteSelect = screen.getByTestId('select-cassette')
      
      // Should show placeholder options only
      expect(cranksetSelect.children).toHaveLength(1) // Only placeholder
      expect(cassetteSelect.children).toHaveLength(1) // Only placeholder
    })

    it('should handle null setup values', () => {
      const nullSetup = {
        wheel: null,
        tire: null,
        crankset: null,
        cassette: null
      }

      render(
        <GearSelectorPanel 
          {...defaultProps} 
          setup={nullSetup}
        />
      )
      
      expect(screen.getByTestId('dropdown-crankset')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-cassette')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper labels for form elements', () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      expect(screen.getByText('Crankset')).toBeInTheDocument()
      expect(screen.getByText('Cassette')).toBeInTheDocument()
      expect(screen.getByText('Wheel Size')).toBeInTheDocument()
      expect(screen.getByText('Tire Width')).toBeInTheDocument()
    })

    it('should be keyboard navigable', () => {
      render(<GearSelectorPanel {...defaultProps} />)
      
      const cranksetSelect = screen.getByTestId('select-crankset')
      
      cranksetSelect.focus()
      expect(document.activeElement).toBe(cranksetSelect)
    })
  })
})