// components/mobile/MobileDropdown.js - Touch-optimized dropdown for mobile
import { useState, useRef, useEffect } from 'react';

export default function MobileDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  searchable = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search
  useEffect(() => {
    if (!searchable || !searchTerm) {
      setFilteredOptions(options);
      return;
    }

    const filtered = options.filter(option => {
      // Safety check for option and option.label
      if (!option || !option.label) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const labelMatch = option.label.toLowerCase().includes(searchLower);
      const subtitleMatch = option.subtitle ? 
        option.subtitle.toLowerCase().includes(searchLower) : 
        false;
      
      return labelMatch || subtitleMatch;
    });
    setFilteredOptions(filtered);
  }, [options, searchTerm, searchable]);

  // Handle click outside to close
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
      
      // Focus search input if searchable
      if (searchable && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current.focus();
        }, 100);
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, searchable]);

  const handleSelect = (option) => {
    if (option && option.value !== undefined) {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  // Get display value with safety checks
  const displayValue = value ? 
    (typeof value === 'object' ? 
      `${value.model || ''} ${value.variant || ''}`.trim() : 
      options.find(opt => opt && opt.value === value)?.label || String(value)
    ) : '';

  return (
    <div className="mobile-dropdown" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="dropdown-trigger"
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          fontSize: '16px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '56px', // Better touch target
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div className="flex-1">
          {displayValue ? (
            <div>
              <div className="font-medium">{displayValue}</div>
              {typeof value === 'object' && value && value.weight && (
                <div className="text-sm text-gray-400">{value.weight}g • {value.speeds || ''}</div>
              )}
            </div>
          ) : (
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {placeholder}
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="dropdown-panel"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div className="dropdown-header" style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 className="text-lg font-semibold" style={{ color: 'white' }}>
              {placeholder}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: 'white'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          {searchable && (
            <div className="search-container" style={{ padding: '16px 20px' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search components..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          {/* Options List */}
          <div 
            className="options-container"
            style={{
              flex: 1,
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '0 20px 20px 20px'
            }}
          >
            {filteredOptions.length > 0 ? (
              <div className="options-list space-y-2">
                {filteredOptions.map((option) => {
                  // Safety check for each option
                  if (!option || !option.id) return null;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className="option-item"
                      style={{
                        width: '100%',
                        background: value === option.value ? 
                          'rgba(59, 130, 246, 0.2)' : 
                          'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${value === option.value ? 
                          '#3B82F6' : 
                          'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'white',
                        textAlign: 'left',
                        minHeight: '60px', // Good touch target
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-base">{option.label || ''}</div>
                        {option.subtitle && (
                          <div className="text-sm text-gray-400 mt-1">{option.subtitle}</div>
                        )}
                      </div>
                      {value === option.value && (
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="no-options" style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5-1.691c-.9-.69-1.628-1.565-2.13-2.548L3 12l1.87-4.161C5.372 6.296 6.6 4.785 8.5 3.734A7.96 7.96 0 0112 3c1.441 0 2.783.302 4.013.834 1.9 1.051 3.128 2.562 3.63 4.105L21 12l-1.357 3.839A7.967 7.967 0 0112 20.4z" />
                </svg>
                <p>No options found</p>
                {searchable && searchTerm && (
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
