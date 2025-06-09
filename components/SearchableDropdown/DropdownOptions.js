import React from 'react';

const DropdownOptions = ({ 
  groupedOptions, 
  groupBy, 
  filteredOptions, 
  highlightedIndex, 
  selectedOption, 
  handleSelect, 
  setHighlightedIndex 
}) => {
  return (
    <div style={{ 
      maxHeight: '240px', 
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      {Object.keys(groupedOptions).length === 0 ? (
        <div className="px-4 py-3 text-base" style={{ color: 'var(--text-tertiary)' }}>
          No components found
        </div>
      ) : (
        Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
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
              const globalIndex = filteredOptions.indexOf(option);
              return (
                <div
                  key={option.id}
                  className={`px-4 py-3 cursor-pointer transition-colors`}
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
                  onTouchStart={(e) => e.stopPropagation()}
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
                  <div 
                    className="text-sm mt-1" 
                    style={{ 
                      color: globalIndex === highlightedIndex 
                        ? 'rgba(255,255,255,0.75)' 
                        : 'var(--text-tertiary)'
                    }}
                  >
                    {option.variant}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default DropdownOptions; 