import React from 'react';

const DropdownTrigger = ({ 
  isOpen, 
  displayValue, 
  placeholder, 
  onClick, 
  triggerRef 
}) => {
  return (
    <div 
      ref={triggerRef}
      className="input-field cursor-pointer flex items-center justify-between"
      onClick={onClick}
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
    </div>
  );
};

export default DropdownTrigger; 