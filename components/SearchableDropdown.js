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

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option?.label?.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      >
        {value?.label || placeholder}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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