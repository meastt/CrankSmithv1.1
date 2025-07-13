// components/SearchableDropdown.js - COMPLETE FILE with virtualization
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  groupBy,
  className = ''
}) {

  // Debug logging
  console.log('🔍 SearchableDropdown render:', {
    optionsLength: options?.length || 0,
    placeholder,
    value,
    options: options,
    firstOption: options[0],
    optionsType: typeof options,
    isArray: Array.isArray(options)
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  // Find selected option
  const selectedOption = useMemo(() => {
    if (!value) return null;
    
    if (typeof value === 'object' && value.id) {
      return options.find(opt => opt.id === value.id);
    } else {
      return options.find(opt => opt.id === value);
    }
  }, [options, value]);

  // Filter options based on search with memoization
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    const searchLower = searchTerm.toLowerCase();
    return options.filter(option => {
      if (!option) return false;
      
      const modelMatch = option.model?.toLowerCase().includes(searchLower);
      const variantMatch = option.variant?.toLowerCase().includes(searchLower);
      const weightMatch = option.weight?.toString().includes(searchTerm);
      
      return modelMatch || variantMatch || weightMatch;
    });
  }, [options, searchTerm]);

  // Group options if groupBy function provided
  const groupedOptions = useMemo(() => {
    if (!groupBy) return { 'All': filteredOptions };
    
    return filteredOptions.reduce((acc, option) => {
      const group = groupBy(option);
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {});
  }, [filteredOptions, groupBy]);

  // Flatten grouped options for virtualization
  const flattenedOptions = useMemo(() => {
    const flattened = [];
    Object.entries(groupedOptions).forEach(([groupName, groupOptions]) => {
      if (groupBy && Object.keys(groupedOptions).length > 1) {
        flattened.push({ type: 'group', name: groupName });
      }
      flattened.push(...groupOptions.map(opt => ({ type: 'option', data: opt })));
    });
    return flattened;
  }, [groupedOptions, groupBy]);

  // Handle selection
  const handleSelect = useCallback((option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = Math.min(prev + 1, flattenedOptions.length - 1);
          // Skip group headers
          if (flattenedOptions[newIndex]?.type === 'group' && newIndex < flattenedOptions.length - 1) {
            return newIndex + 1;
          }
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          // Skip group headers
          if (flattenedOptions[newIndex]?.type === 'group' && newIndex > 0) {
            return newIndex - 1;
          }
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        const highlighted = flattenedOptions[highlightedIndex];
        if (highlighted?.type === 'option') {
          handleSelect(highlighted.data);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [flattenedOptions, highlightedIndex, handleSelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      listRef.current.scrollToItem(highlightedIndex, 'smart');
    }
  }, [highlightedIndex]);

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

  // Row renderer for react-window
  const Row = ({ index, style }) => {
    const item = flattenedOptions[index];
    
    if (item.type === 'group') {
      return (
        <div
          style={{
            ...style,
            padding: '8px 12px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: '600',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          {item.name}
        </div>
      );
    }

    const option = item.data;
    const isHighlighted = index === highlightedIndex;
    const isSelected = selectedOption?.id === option.id;

    return (
      <div
        style={{
          ...style,
          padding: '12px 16px',
          cursor: 'pointer',
          background: isHighlighted 
            ? 'var(--accent-blue)' 
            : isSelected 
              ? 'var(--surface-elevated)' 
              : 'transparent',
          color: isHighlighted ? 'white' : 'var(--text-primary)',
          transition: 'background-color 0.1s ease'
        }}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontWeight: '500', fontSize: '16px' }}>
            {option.model}
          </div>
          <div 
            style={{ 
              fontSize: '14px',
              fontWeight: '400',
              flexShrink: 0,
              color: isHighlighted 
                ? 'rgba(255,255,255,0.85)' 
                : 'var(--text-tertiary)'
            }}
          >
            {option.weight}g
          </div>
        </div>
        <div 
          style={{ 
            fontSize: '14px',
            marginTop: '4px',
            color: isHighlighted 
              ? 'rgba(255,255,255,0.75)' 
              : 'var(--text-tertiary)'
          }}
        >
          {option.variant}
        </div>
      </div>
    );
  };

  const getItemSize = (index) => {
    return flattenedOptions[index]?.type === 'group' ? 32 : 64;
  };

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
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
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

          {/* Options List with Virtualization */}
          <div style={{ flex: 1, minHeight: 0 }}>
            {flattenedOptions.length === 0 ? (
              <div className="px-4 py-3 text-base" style={{ color: 'var(--text-tertiary)' }}>
                No components found
              </div>
            ) : (
              <List
                ref={listRef}
                height={Math.min(300, flattenedOptions.length * 64)}
                itemCount={flattenedOptions.length}
                itemSize={getItemSize}
                width="100%"
                overscanCount={5}
              >
                {Row}
              </List>
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
