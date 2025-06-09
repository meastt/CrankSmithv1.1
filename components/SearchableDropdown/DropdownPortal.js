import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SearchInput from './SearchInput';
import DropdownOptions from './DropdownOptions';

const DropdownPortal = ({
  isOpen,
  triggerRef,
  searchTerm,
  setSearchTerm,
  setHighlightedIndex,
  handleKeyDown,
  inputRef,
  groupedOptions,
  groupBy,
  filteredOptions,
  highlightedIndex,
  selectedOption,
  handleSelect,
  setHighlightedIndex: setHighlightedIndexProp,
  onClose
}) => {
  const portalRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !portalRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const portalRect = portalRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const isMobile = window.innerWidth < 768;

      // Reset any previous positioning
      portalRef.current.style.top = '';
      portalRef.current.style.bottom = '';
      portalRef.current.style.left = '';
      portalRef.current.style.transform = '';
      portalRef.current.style.width = '';

      if (isMobile) {
        // Mobile: Full width, fixed to bottom
        portalRef.current.style.position = 'fixed';
        portalRef.current.style.bottom = '0';
        portalRef.current.style.left = '0';
        portalRef.current.style.width = '100%';
        portalRef.current.style.maxHeight = '80vh';
        portalRef.current.style.borderRadius = '16px 16px 0 0';
        portalRef.current.style.border = '1px solid var(--border-subtle)';
        portalRef.current.style.borderBottom = 'none';
      } else {
        // Desktop: Position relative to trigger
        portalRef.current.style.position = 'absolute';
        portalRef.current.style.left = '0';
        portalRef.current.style.width = `${triggerRect.width}px`;

        // Check if dropdown would go off screen
        if (spaceBelow < portalRect.height && spaceAbove > spaceBelow) {
          // Position above if there's more space above
          portalRef.current.style.bottom = `${triggerRect.height + 4}px`;
        } else {
          // Position below
          portalRef.current.style.top = `${triggerRect.height + 4}px`;
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={portalRef}
      className="z-50"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setHighlightedIndex={setHighlightedIndex}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
      <DropdownOptions
        groupedOptions={groupedOptions}
        groupBy={groupBy}
        filteredOptions={filteredOptions}
        highlightedIndex={highlightedIndex}
        selectedOption={selectedOption}
        handleSelect={handleSelect}
        setHighlightedIndex={setHighlightedIndexProp}
      />
    </div>,
    document.body
  );
};

export default DropdownPortal; 