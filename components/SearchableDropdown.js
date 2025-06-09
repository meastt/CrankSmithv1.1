/**
 * STABLE VERSION - DO NOT MODIFY WITHOUT TESTING
 * Last stable commit: 4c61aed
 * Date: 2024-03-19
 * 
 * This version has working dropdowns without disappearing issues.
 * Key features:
 * - Stable dropdown behavior
 * - Proper event handling
 * - Working mobile support
 * 
 * If modifying this component:
 * 1. Test dropdown behavior thoroughly
 * 2. Verify mobile functionality
 * 3. Check event handling
 * 4. Test with different screen sizes
 */

// components/SearchableDropdown.js - STABLE VERSION
// Last updated: 2024-03-19 - Fixed dropdown stability
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [usePortal, setUsePortal] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter and group options
  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    const modelLower = option.model?.toLowerCase() || '';
    const variantLower = option.variant?.toLowerCase() || '';
    
    // Special handling for XTR Di2 components
    if (modelLower.includes('xtr m9200')) {
      // Show XTR M9200 components when searching for partial matches
      if (searchLower === '' || 
          searchLower.includes('xtr') || 
          searchLower.includes('di') || 
          searchLower.includes('di2') ||
          modelLower.includes(searchLower) ||
          variantLower.includes(searchLower)) {
        return true;
      }
    }
    
    // Normal search logic for other components
    return (
      modelLower.includes(searchLower) ||
      variantLower.includes(searchLower) ||
      `${modelLower} ${variantLower}`.includes(searchLower)
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

  // Calculate position more reliably
  const updatePosition = () => {
    if (!isOpen || !triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 300; // Max height of dropdown
    
    // Check if we're on mobile (basic detection)
    const isMobile = window.innerWidth <= 768;
    
    // For mobile, use fixed positioning with viewport constraints
    if (isMobile) {
      const top = Math.min(
        rect.bottom + 2,
        viewportHeight - dropdownHeight - 20 // Leave some padding at bottom
      );
      
      setDropdownPosition({
        top,
        left: 0, // Full width on mobile
        width: '100%', // Full width on mobile
        maxWidth: '100vw' // Ensure it doesn't overflow viewport
      });
      setUsePortal(true);
    } else {
      // Desktop positioning with overflow detection
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      let top = rect.bottom + 2;
      
      // If not enough space below and more space above, position above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 2;
      }
      
      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width
      });
      setUsePortal(true);
    }
  };

  // Update position when opened (single call, no continuous updates)
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(updatePosition, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    const handleScroll = (event) => {
      // Only close if scrolling the main page, not the dropdown itself
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return; // Don't close if scrolling inside the dropdown
      }
      
      // Add a small delay and distance check to make it less sensitive
      clearTimeout(window.dropdownScrollTimeout);
      window.dropdownScrollTimeout = setTimeout(() => {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }, 200); // 200ms delay instead of immediate
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Only listen for scroll on the main window, with more delay
      setTimeout(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }, 300); // Increased from 100ms to 300ms
      
      // Prevent body scroll on mobile when dropdown is open
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(window.dropdownScrollTimeout);
      document.body.style.overflow = 'unset';
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

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const selectedOption = options.find(opt => opt.id === value?.id);
  const displayValue = selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : '';

  // Dropdown content - simplified for better performance
  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className="searchable-dropdown-portal"
      style={{ 
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: typeof dropdownPosition.left === 'number' ? `${dropdownPosition.left}px` : dropdownPosition.left,
        width: typeof dropdownPosition.width === 'number' ? `${dropdownPosition.width}px` : dropdownPosition.width,
        maxWidth: dropdownPosition.maxWidth,
        zIndex: 10000,
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-medium)',
        border: '1px solid var(--border-elevated)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        maxHeight: '300px',
        overflow: 'hidden',
        // Prevent scrolling issues on mobile
        touchAction: 'manipulation',
        // Hardware acceleration for smoother animations
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Search Input */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
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
          className="w-full px-4 py-2.5 rounded-lg text-base"
          style={{ 
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '16px',
            // Prevent zoom on iOS
            WebkitTextSizeAdjust: '100%'
          }}
          autoFocus
          // Prevent mobile keyboard from affecting layout
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Options List */}
      <div style={{ 
        maxHeight: '240px', 
        overflowY: 'auto',
        // Improve scrolling on mobile
        WebkitOverflowScrolling: 'touch',
        // Prevent overscroll bounce
        overscrollBehavior: 'contain'
      }}>
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
                    className={`px-4 py-3 cursor-pointer transition-colors`}
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
                    // Prevent touch scrolling issues
                    onTouchStart={(e) => e.stopPropagation()}
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
        onClick={handleOpen}
        style={{ 
          background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
          borderColor: isOpen ? 'var(--border-focus)' : 'var(--border-subtle)',
          // Prevent layout shifts on mobile
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
      </div>

      {/* Portal the dropdown to body only when necessary */}
      {usePortal && typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
      
      {/* Fallback for non-portal rendering */}
      {!usePortal && dropdownContent}
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
  if (model.includes('xtr') && model.includes('di2')) return 'XTR Di2';
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