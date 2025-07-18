import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  // Debug CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    console.log('🔍 CSS Variables Debug:', {
      '--bg-elevated': computedStyle.getPropertyValue('--bg-elevated'),
      '--text-primary': computedStyle.getPropertyValue('--text-primary'),
      '--border-primary': computedStyle.getPropertyValue('--border-primary'),
      '--bg-secondary': computedStyle.getPropertyValue('--bg-secondary'),
      '--text-secondary': computedStyle.getPropertyValue('--text-secondary')
    });
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.model.toLowerCase().includes(searchLower) ||
      option.variant.toLowerCase().includes(searchLower) ||
      option.weight.toString().includes(searchTerm)
    );
  });

  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative searchable-dropdown ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        style={{
          background: 'rgb(23 23 23) !important',
          borderColor: 'rgb(38 38 38) !important',
          color: 'rgb(255 255 255) !important'
        }}
      >
        {selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : placeholder}
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-[999999] w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto"
          style={{
            background: 'rgb(23 23 23) !important',
            borderColor: 'rgb(38 38 38) !important'
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: 'rgb(23 23 23) !important',
              borderColor: 'rgb(38 38 38) !important',
              color: 'rgb(255 255 255) !important'
            }}
            autoFocus
          />
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left focus:outline-none"
                style={{
                  color: 'rgb(255 255 255)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgb(var(--bg-secondary))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                <div className="font-medium">{option.model}</div>
                <div className="text-sm" style={{ color: 'rgb(229 229 229)' }}>{option.variant}</div>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2" style={{ color: 'rgb(229 229 229)' }}>No options found</div>
            )}
          </div>
                  </div>
        )}
    </div>
  );
};

export default SearchableDropdown; 