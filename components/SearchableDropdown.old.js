// components/SearchableDropdown.js - OPTIMIZED VERSION
// Addresses mobile performance issues with pagination and simpler UI

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { isMobileDevice } from '../lib/pwa-utils';

const ITEMS_PER_PAGE = 20; // Pagination for better performance

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
  const isMobile = isMobileDevice();

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

  // Filter and paginate options for better performance
  const { filteredOptions, totalPages } = useMemo(() => {
    const filtered = options.filter(option => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        option.model?.toLowerCase().includes(searchLower) ||
        option.variant?.toLowerCase().includes(searchLower) ||
        option.weight?.toString().includes(searchTerm)
      );
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedOptions = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { filteredOptions: paginatedOptions, totalPages };
  }, [options, searchTerm, currentPage]);

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

  // Handle selection
  const handleSelect = useCallback((option) => {
    onChange(option); // Pass the full component object instead of just the ID
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
    setCurrentPage(0);
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev + 1;
          if (newIndex >= filteredOptions.length) {
            // Move to next page if available
            if (currentPage < totalPages - 1) {
              setCurrentPage(prev => prev + 1);
              return 0;
            }
            return prev;
          }
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev - 1;
          if (newIndex < 0) {
            // Move to previous page if available
            if (currentPage > 0) {
              setCurrentPage(prev => prev - 1);
              return ITEMS_PER_PAGE - 1;
            }
            return 0;
          }
          return newIndex;
        });
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
  }, [filteredOptions, highlightedIndex, currentPage, totalPages, handleSelect]);

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

  // Reset states when search changes
  useEffect(() => {
    setHighlightedIndex(0);
    setCurrentPage(0);
  }, [searchTerm]);

  const displayValue = selectedOption ? 
    `${selectedOption.model} ${selectedOption.variant}`.trim() : '';

  // Mobile-optimized render
  if (isMobile) {
    return (
      <MobileOptimizedDropdown
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        selectedOption={selectedOption}
        displayValue={displayValue}
        className={className}
      />
    );
  }

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
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="px-4 py-3 text-base" style={{ color: 'var(--text-tertiary)' }}>
                No components found
              </div>
            ) : (
              <>
                {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
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
                      const globalIndex = index + (currentPage * ITEMS_PER_PAGE);
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
                          {option.variant && (
                            <div 
                              className="text-sm mt-1" 
                              style={{ 
                                color: globalIndex === highlightedIndex 
                                  ? 'rgba(255,255,255,0.7)' 
                                  : 'var(--text-secondary)'
                              }}
                            >
                              {option.variant}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t flex items-center justify-between" 
                       style={{ borderColor: 'var(--border-subtle)' }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="px-3 py-1 rounded text-sm disabled:opacity-50"
                      style={{ 
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Previous
                    </button>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="px-3 py-1 rounded text-sm disabled:opacity-50"
                      style={{ 
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile-optimized dropdown component
function MobileOptimizedDropdown({ options, value, onChange, placeholder, selectedOption, displayValue, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const ITEMS_PER_PAGE_MOBILE = 15; // Smaller for mobile

  // Filter and paginate options
  const { filteredOptions, totalPages } = useMemo(() => {
    const filtered = options.filter(option => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        option.model?.toLowerCase().includes(searchLower) ||
        option.variant?.toLowerCase().includes(searchLower) ||
        option.weight?.toString().includes(searchTerm)
      );
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE_MOBILE);
    const startIndex = currentPage * ITEMS_PER_PAGE_MOBILE;
    const paginatedOptions = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE_MOBILE);

    return { filteredOptions: paginatedOptions, totalPages };
  }, [options, searchTerm, currentPage]);

  const handleSelect = useCallback((option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setCurrentPage(0);
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('mousedown', handleClickOutside);
      
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
      
      // Focus search input
      if (searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  return (
    <div className={`mobile-dropdown ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="input-field cursor-pointer flex items-center justify-between w-full"
        style={{ 
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border-subtle)',
          minHeight: '48px'
        }}
      >
        <span className={displayValue ? '' : 'opacity-60'} style={{ fontSize: '16px' }}>
          {displayValue || placeholder}
        </span>
        <svg 
          className="w-4 h-4 transition-transform"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Modal */}
      {isOpen && (
        <div 
          className="mobile-dropdown-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div className="mobile-dropdown-header" style={{
            padding: '16px 20px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {placeholder}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: 'var(--text-primary)'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="mobile-search-container" style={{ padding: '16px 20px', background: 'var(--bg-secondary)' }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search components..."
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Options List */}
          <div 
            className="mobile-options-container"
            style={{
              flex: 1,
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: 'var(--bg-secondary)'
            }}
          >
            {filteredOptions.length > 0 ? (
              <div className="mobile-options-list" style={{ padding: '0 20px 20px 20px' }}>
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="mobile-option-item"
                    style={{
                      width: '100%',
                      background: selectedOption?.id === option.id ? 
                        'var(--accent-blue-light)' : 
                        'var(--bg-tertiary)',
                      border: `1px solid ${selectedOption?.id === option.id ? 
                        'var(--accent-blue)' : 
                        'var(--border-subtle)'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-base">{option.model}</div>
                      {option.variant && (
                        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {option.variant}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {option.weight}g
                      </span>
                      {selectedOption?.id === option.id && (
                        <svg className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
                
                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="mobile-pagination" style={{
                    padding: '20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                  }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="mobile-pagination-btn"
                      style={{
                        padding: '12px 20px',
                        background: currentPage === 0 ? 'var(--bg-tertiary)' : 'var(--accent-blue)',
                        color: currentPage === 0 ? 'var(--text-tertiary)' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Previous
                    </button>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="mobile-pagination-btn"
                      style={{
                        padding: '12px 20px',
                        background: currentPage === totalPages - 1 ? 'var(--bg-tertiary)' : 'var(--accent-blue)',
                        color: currentPage === totalPages - 1 ? 'var(--text-tertiary)' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mobile-no-options" style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-tertiary)'
              }}>
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5-1.691c-.9-.69-1.628-1.565-2.13-2.548L3 12l1.87-4.161C5.372 6.296 6.6 4.785 8.5 3.734A7.96 7.96 0 0112 3c1.441 0 2.783.302 4.013.834 1.9 1.051 3.128 2.562 3.63 4.105L21 12l-1.357 3.839A7.967 7.967 0 0112 20.4z" />
                </svg>
                <p>No options found</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Try adjusting your search</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export groupBy function for use in other components
export const groupBySeries = (option) => {
  const model = option.model?.toLowerCase() || '';
  if (model.includes('dura-ace') || model.includes('dura ace')) return 'Dura-Ace';
  if (model.includes('ultegra')) return 'Ultegra';
  if (model.includes('105')) return '105';
  if (model.includes('tiagra')) return 'Tiagra';
  if (model.includes('sora')) return 'Sora';
  if (model.includes('claris')) return 'Claris';
  if (model.includes('grx')) return 'GRX';
  if (model.includes('eagle')) return 'Eagle';
  if (model.includes('gx')) return 'GX';
  if (model.includes('nx')) return 'NX';
  if (model.includes('sx')) return 'SX';
  if (model.includes('deore')) return 'Deore';
  if (model.includes('slx')) return 'SLX';
  if (model.includes('xt')) return 'XT';
  if (model.includes('xtr')) return 'XTR';
  return 'Other';
};