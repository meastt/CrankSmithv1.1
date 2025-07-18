import React, { useState, useRef, useEffect } from 'react';

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
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedOption ? `${selectedOption.model} ${selectedOption.variant}` : placeholder}
      </button>
      
      {isOpen && (
        <div className="fixed w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto" style={{ 
          position: 'fixed',
          top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 5 : 'auto',
          left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 'auto',
          width: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().width : 'auto',
          zIndex: 99999
        }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
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