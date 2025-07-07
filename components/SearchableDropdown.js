// components/SearchableDropdown.js - FIXED VERSION
// Replaces the unstable version with proper event handling and mobile support

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  groupBy,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find selected option
  const selectedOption = useMemo(() => {
    if (!value) return null;
    
    // Handle both cases: value could be an ID or a full component object
    if (typeof value === 'object' && value.id) {
      // Value is a full component object
      return options.find(opt => opt.id === value.id);
    } else {
      // Value is just an ID
      return options.find(opt => opt.id === value);
    }
  }, [options, value]);

  // Filter options based on search - Fixed: Use useMemo to prevent unnecessary recalculations
  const filteredOptions = useMemo(() => {
    return options.filter(option => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        option.model?.toLowerCase().includes(searchLower) ||
        option.variant?.toLowerCase().includes(searchLower) ||
        option.weight?.toString().includes(searchTerm)
      );
    });
  }, [options, searchTerm]);

  // Group options if groupBy function provided
  const groupedOptions = groupBy ? 
    filteredOptions.reduce((acc, option) => {
      const group = groupBy(option);
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {}) : 
    { 'All': filteredOptions };

  // Handle selection
  const handleSelect = useCallback((option) => {
    onChange(option); // Pass the full component object instead of just the ID
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
    setCurrentPage(0);
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      // Focus search input
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const displayValue = selectedOption ? 
    `${selectedOption.model} ${selectedOption.variant}`.trim() : '';

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field cursor-pointer flex items-center justify-between w-full"
        style={{ 
          background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
          borderColor: isOpen ? 'var(--border-focus)' : 'var(--border-subtle)',
          minHeight: '48px'
        }}
      >
        <span className={displayValue ? '' : 'opacity-60'} style={{ fontSize: '16px' }}>
          {displayValue || placeholder}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Portal */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 rounded-lg text-base"
              style={{ 
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {/* Options List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="px-4 py-3 text-base" style={{ color: 'var(--text-tertiary)' }}>
                No components found
              </div>
            ) : (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  {groupBy && Object.keys(groupedOptions).length > 1 && (
                    <div 
                      className="px-3 py-2 text-xs font-semibold border-b sticky top-0"
                      style={{ 
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-subtle)',
                        zIndex: 1
                      }}
                    >
                      {groupName}
                    </div>
                  )}
                  {groupOptions.map((option, index) => {
                    const globalIndex = filteredOptions.indexOf(option);
                    return (
                      <div
                        key={option.id}
                        className="px-4 py-3 cursor-pointer transition-colors"
                        style={{
                          background: globalIndex === highlightedIndex 
                            ? 'var(--accent-blue)' 
                            : selectedOption?.id === option.id 
                              ? 'var(--surface-elevated)' 
                              : 'transparent',
                          color: globalIndex === highlightedIndex 
                            ? 'white' 
                            : 'var(--text-primary)'
                        }}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="font-medium text-base">
                            {option.model}
                          </div>
                          <div 
                            className="text-sm font-normal flex-shrink-0" 
                            style={{ 
                              color: globalIndex === highlightedIndex 
                                ? 'rgba(255,255,255,0.85)' 
                                : 'var(--text-tertiary)'
                            }}
                          >
                            {option.weight}g
                          </div>
                        </div>
                        <div 
                          className="text-sm mt-1" 
                          style={{ 
                            color: globalIndex === highlightedIndex 
                              ? 'rgba(255,255,255,0.75)' 
                              : 'var(--text-tertiary)'
                          }}
                        >
                          {option.variant}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export grouping functions for backward compatibility
export const groupByBrand = (component) => {
  if (component.model.includes('Shimano')) return 'Shimano';
  if (component.model.includes('SRAM')) return 'SRAM';
  if (component.model.includes('Campagnolo')) return 'Campagnolo';
  return 'Other';
};

export const groupBySeries = (component) => {
  const model = component.model.toLowerCase();
  
  // Shimano series
  if (model.includes('xtr') && model.includes('di2')) return 'XTR Di2';
  if (model.includes('dura-ace')) return 'Dura-Ace';
  if (model.includes('ultegra')) return 'Ultegra';
  if (model.includes('105')) return '105';
  if (model.includes('xtr')) return 'XTR';
  if (model.includes('xt ')) return 'XT';
  if (model.includes('slx')) return 'SLX';
  if (model.includes('deore')) return 'Deore';
  if (model.includes('grx')) return 'GRX';
  
  // SRAM series
  if (model.includes('red')) return 'Red';
  if (model.includes('force')) return 'Force';
  if (model.includes('rival')) return 'Rival';
  if (model.includes('gx')) return 'GX';
  if (model.includes('nx')) return 'NX';
  
  return 'Other';
};