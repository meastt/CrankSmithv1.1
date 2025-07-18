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
        className="input-field w-full text-left"
      >
        {selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : placeholder}
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field searchable-dropdown-input w-full border-b border-gray-200"
            autoFocus
          />
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <div className="font-medium">{option.model}</div>
                <div className="text-sm text-gray-500">{option.variant}</div>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
                  </div>
        )}
    </div>
  );
};

export default SearchableDropdown; 