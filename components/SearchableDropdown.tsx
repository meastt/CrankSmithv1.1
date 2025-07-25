// components/SearchableDropdown.tsx - Enhanced with TypeScript and performance optimizations
import React, { useState, useRef, useEffect, useMemo, useCallback, ReactElement } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DropdownOption, GroupedOptions } from '../types';

interface SearchableDropdownProps {
  options: DropdownOption[];
  value?: DropdownOption | string | null;
  onChange: (value: DropdownOption | null) => void;
  placeholder?: string;
  groupBy?: (option: DropdownOption) => string;
  className?: string;
  searchable?: boolean;
  debounceMs?: number;
}

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  groupBy,
  className = '',
  searchable = true,
  debounceMs = 150
}: SearchableDropdownProps): ReactElement {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const focusTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced search implementation
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Find selected option with improved type safety
  const selectedOption = useMemo((): DropdownOption | null => {
    if (!value) return null;
    
    if (typeof value === 'object' && value.id) {
      return options.find(opt => opt.id === value.id) || null;
    } else {
      return options.find(opt => opt.id === value) || null;
    }
  }, [options, value]);

  // Enhanced filtering with debounced search and better performance
  const filteredOptions = useMemo((): DropdownOption[] => {
    if (!debouncedSearchTerm || !searchable) return options;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    const searchTerms = searchLower.split(' ').filter(Boolean);
    
    return options.filter(option => {
      if (!option) return false;
      
      const searchableText = [
        option.model || '',
        option.variant || '',
        option.label || '',
        option.speeds || '',
        option.weight?.toString() || '',
        option.teeth?.join(',') || ''
      ].join(' ').toLowerCase();
      
      // All search terms must match
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [options, debouncedSearchTerm, searchable]);

  // Group options if groupBy function provided with better typing
  const groupedOptions = useMemo((): GroupedOptions => {
    if (!groupBy) return { 'All': filteredOptions };
    
    return filteredOptions.reduce((acc: GroupedOptions, option) => {
      const group = groupBy(option);
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {});
  }, [filteredOptions, groupBy]);

  // Flatten grouped options for virtualization with proper typing
  interface FlattenedItem {
    type: 'group' | 'option';
    name?: string;
    data?: DropdownOption;
  }

  const flattenedOptions = useMemo((): FlattenedItem[] => {
    const flattened: FlattenedItem[] = [];
    Object.entries(groupedOptions).forEach(([groupName, groupOptions]) => {
      if (groupBy && Object.keys(groupedOptions).length > 1) {
        flattened.push({ type: 'group', name: groupName });
      }
      flattened.push(...groupOptions.map(opt => ({ type: 'option' as const, data: opt })));
    });
    
    return flattened;
  }, [groupedOptions, groupBy]);

  // Handle selection with proper typing
  const handleSelect = useCallback((option: DropdownOption | null): void => {
    if (option) {
      onChange(option);
      setIsOpen(false);
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setHighlightedIndex(0);
    }
  }, [onChange]);

  // Handle keyboard navigation with proper typing
  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
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
        if (highlighted?.type === 'option' && highlighted.data) {
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

  // Click outside to close with proper typing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      // Focus search input with cleanup
      if (inputRef.current && searchable) {
        focusTimeout.current = setTimeout(() => inputRef.current?.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      
      // Clear focus timeout to prevent memory leaks
      if (focusTimeout.current) {
        clearTimeout(focusTimeout.current);
        focusTimeout.current = null;
      }
    };
  }, [isOpen, searchable]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [debouncedSearchTerm]);

  const displayValue = selectedOption ? 
    `${selectedOption.model} ${selectedOption.variant}`.trim() : '';

  // Row renderer for react-window with proper typing
  interface RowProps {
    index: number;
    style: React.CSSProperties;
  }

  const Row = ({ index, style }: RowProps): ReactElement => {
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
    if (!option) return <div style={style}></div>;
    
    const isHighlighted = index === highlightedIndex;
    const isSelected = selectedOption?.id === option.id;

    return (
      <div
        style={{
          ...style,
          padding: '12px 16px',
          cursor: 'pointer',
          background: isHighlighted 
            ? 'rgb(var(--brand-blue))' 
            : isSelected 
              ? 'rgb(var(--bg-tertiary))' 
              : 'transparent',
          color: isHighlighted ? 'white' : 'rgb(var(--text-primary))',
          transition: 'background-color 0.1s ease'
        }}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontWeight: '500', fontSize: '16px' }}>
            {option.model}
            {option.recommended && (
              <span style={{
                background: '#2563eb', color: 'white', fontSize: '11px', borderRadius: '6px', padding: '2px 6px', marginLeft: '8px', fontWeight: 600
              }}>Recommended</span>
            )}
            {option.popular && !option.recommended && (
              <span style={{
                background: '#f59e42', color: 'white', fontSize: '11px', borderRadius: '6px', padding: '2px 6px', marginLeft: '8px', fontWeight: 600
              }}>Popular</span>
            )}
          </div>
          <div 
            style={{ 
              fontSize: '14px',
              fontWeight: '400',
              flexShrink: 0,
              color: isHighlighted 
                ? 'rgba(255,255,255,0.85)' 
                : 'rgb(var(--text-tertiary))'
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
              : 'rgb(var(--text-tertiary))'
          }}
        >
          {option.variant}
        </div>
      </div>
    );
  };



  return (
    <div className={`relative searchable-dropdown ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={options.length === 0}
        onClick={() => {
          if (options.length === 0) {
            // console.log('🖱️ Dropdown trigger clicked but no options available');
            return;
          }
          // console.log('🖱️ Dropdown trigger clicked:', {
          //   placeholder,
          //   currentIsOpen: isOpen,
          //   willBeOpen: !isOpen,
          //   optionsLength: options?.length || 0,
          //   flattenedOptionsLength: flattenedOptions?.length || 0
          // });
          setIsOpen(!isOpen);
        }}
        className={`input-field flex items-center justify-between w-full ${
          options.length === 0 ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        style={{ 
          background: isOpen ? 'rgb(var(--bg-elevated))' : 'rgb(var(--bg-secondary))',
          borderColor: isOpen ? 'rgb(var(--border-focus))' : 'rgb(var(--border-primary))',
          color: 'rgb(var(--text-primary))',
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
          className="absolute z-[9999] w-full mt-1"
          style={{
            background: 'rgb(var(--bg-elevated))',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '12px',
            border: '1px solid rgb(var(--border-primary))',
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-premium"
              style={{ 
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
              <div className="px-4 py-6 text-center">
                <div className="text-base mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {searchTerm ? 'No matching components found' : 'No components available'}
                </div>
                {!searchTerm && (
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {options.length === 0 ? 'Please select a bike type first' : 'Try adjusting your search'}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* console.log('📋 About to render List:', {
                  placeholder,
                  flattenedOptionsLength: flattenedOptions.length,
                  listHeight: Math.min(300, flattenedOptions.length * 64),
                  itemCount: flattenedOptions.length
                }) */}
                <List
                  ref={listRef}
                  height={Math.min(300, flattenedOptions.length * 64)}
                  itemCount={flattenedOptions.length}
                  itemSize={64}
                  width="100%"
                  overscanCount={5}
                >
                  {Row}
                </List>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export grouping functions for backward compatibility
export const groupByBrand = (component: DropdownOption): string => {
  if (component.model?.includes('Shimano')) return 'Shimano';
  if (component.model?.includes('SRAM')) return 'SRAM';
  if (component.model?.includes('Campagnolo')) return 'Campagnolo';
  return 'Other';
};

export const groupBySeries = (component: DropdownOption): string => {
  const model = component.model?.toLowerCase() || '';
  
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
