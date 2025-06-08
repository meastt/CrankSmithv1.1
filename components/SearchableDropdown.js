// components/SearchableDropdown.js - FIXED VERSION
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SearchableDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Search components...", 
  label,
  groupBy = null
}) => {
  // DEBUG LINES - TEMPORARY
  console.log('🔍 SearchableDropdown rendered with:', {
    optionsLength: options?.length,
    placeholder,
    hasOptions: Array.isArray(options),
    firstOption: options?.[0]
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  // DEBUG - TEMPORARY
  console.log('🔍 Dropdown state:', { isOpen });

  // Filter and group options
  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.model?.toLowerCase().includes(searchLower) ||
      option.variant?.toLowerCase().includes(searchLower) ||
      `${option.model} ${option.variant}`.toLowerCase().includes(searchLower)
    );
  });

  // Group options if groupBy function provided
  const groupedOptions = groupBy 
    ? filteredOptions.reduce((groups, option) => {
        const group = groupBy(option);
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      }, {})
    : { 'All': filteredOptions };

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const selectedOption = options.find(opt => opt.id === value?.id);
  const displayValue = selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : '';

  // Dropdown content to be portaled
  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className="searchable-dropdown-portal"
      style={{ 
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 9999,
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-medium)',
        border: '1px solid var(--border-elevated)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        maxHeight: '300px',
        overflow: 'hidden'
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ 
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
          autoFocus
        />
      </div>

      {/* Options List */}
      <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
        {Object.keys(groupedOptions).length === 0 ? (
          <div className="px-3 py-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
                    className={`px-3 py-2 cursor-pointer text-sm transition-colors`}
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
                    <div className="font-medium">
                      {option.model}
                    </div>
                    <div 
                      className="text-xs" 
                      style={{ 
                        color: globalIndex === highlightedIndex 
                          ? 'rgba(255,255,255,0.8)' 
                          : 'var(--text-tertiary)' 
                      }}
                    >
                      {option.variant} • {option.weight}g
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {filteredOptions.length > 0 && (
        <div 
          className="px-3 py-2 text-xs border-t"
          style={{ 
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-quaternary)',
            background: 'var(--bg-secondary)'
          }}
        >
          {filteredOptions.length} components found
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {label && (
        <label className="form-label">{label}</label>
      )}
      
      {/* Main Input/Trigger */}
      <div 
        ref={triggerRef}
        className="input-field cursor-pointer flex items-center justify-between"
        onClick={() => {
          console.log('🔍 Dropdown clicked! Current isOpen:', isOpen);
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        style={{ 
          background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
          borderColor: isOpen ? 'var(--border-focus)' : 'var(--border-subtle)'
        }}
      >
        <span className={displayValue ? 'text-white' : 'text-gray-400'}>
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
      </div>

      {/* Portal the dropdown to body */}
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

// Export grouping functions
export const groupByBrand = (component) => {
  if (component.model.includes('Shimano')) return 'Shimano';
  if (component.model.includes('SRAM')) return 'SRAM';
  if (component.model.includes('Campagnolo')) return 'Campagnolo';
  return 'Other';
};

export const groupBySeries = (component) => {
  const model = component.model.toLowerCase();
  
  // Shimano series
  if (model.includes('dura-ace')) return 'Dura-Ace';
  if (model.includes('ultegra')) return 'Ultegra';
  if (model.includes('105')) return '105';
  if (model.includes('tiagra')) return 'Tiagra';
  if (model.includes('sora')) return 'Sora';
  if (model.includes('claris')) return 'Claris';
  if (model.includes('xtr')) return 'XTR';
  if (model.includes('xt ')) return 'XT';
  if (model.includes('slx')) return 'SLX';
  if (model.includes('deore')) return 'Deore';
  if (model.includes('grx')) return 'GRX';
  if (model.includes('cues')) return 'CUES';
  
  // SRAM series
  if (model.includes('red')) return 'Red';
  if (model.includes('force')) return 'Force';
  if (model.includes('rival')) return 'Rival';
  if (model.includes('apex')) return 'Apex';
  if (model.includes('xx1')) return 'XX1';
  if (model.includes('x01')) return 'X01';
  if (model.includes('gx')) return 'GX';
  if (model.includes('nx')) return 'NX';
  if (model.includes('sx')) return 'SX';
  
  // Other brands
  if (model.includes('campagnolo')) return 'Campagnolo';
  if (model.includes('fsa')) return 'FSA';
  if (model.includes('praxis')) return 'Praxis';
  if (model.includes('race face')) return 'Race Face';
  if (model.includes('rotor')) return 'Rotor';
  
  return 'Other';
};

export default SearchableDropdown;