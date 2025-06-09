import React, { useState, useRef, useEffect } from 'react';
import DropdownTrigger from './DropdownTrigger';
import DropdownPortal from './DropdownPortal';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  groupBy,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.model.toLowerCase().includes(searchLower) ||
      option.variant.toLowerCase().includes(searchLower) ||
      option.weight.toString().includes(searchTerm)
    );
  });

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = groupBy ? option[groupBy] : 'All';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {});

  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
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
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        !e.target.closest('.dropdown-portal')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <DropdownTrigger
        isOpen={isOpen}
        displayValue={selectedOption?.model}
        placeholder={placeholder}
        onClick={() => setIsOpen(true)}
        triggerRef={triggerRef}
      />
      <DropdownPortal
        isOpen={isOpen}
        triggerRef={triggerRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setHighlightedIndex={setHighlightedIndex}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
        groupedOptions={groupedOptions}
        groupBy={groupBy}
        filteredOptions={filteredOptions}
        highlightedIndex={highlightedIndex}
        selectedOption={selectedOption}
        handleSelect={handleSelect}
        setHighlightedIndex={setHighlightedIndex}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default SearchableDropdown; 