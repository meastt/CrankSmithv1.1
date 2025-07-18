import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className = ''
}) => {
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
        className="w-full px-3 py-2 text-left border border-[var(--border-primary)] rounded-md shadow-sm bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : placeholder}
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-[999999] w-full mt-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-[var(--surface-elevated)] focus:outline-none focus:bg-[var(--surface-elevated)] text-[var(--text-primary)]"
              >
                <div className="font-medium">{option.model}</div>
                <div className="text-sm text-[var(--text-secondary)]">{option.variant}</div>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-[var(--text-secondary)]">No options found</div>
            )}
          </div>
                  </div>
        )}
    </div>
  );
};

export default SearchableDropdown; 