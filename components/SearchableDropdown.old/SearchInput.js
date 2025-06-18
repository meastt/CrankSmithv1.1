import React from 'react';

const SearchInput = ({ 
  searchTerm, 
  setSearchTerm, 
  setHighlightedIndex, 
  handleKeyDown, 
  inputRef 
}) => {
  return (
    <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 rounded-lg text-base"
        style={{ 
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          fontSize: '16px',
          WebkitTextSizeAdjust: '100%'
        }}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};

export default SearchInput; 