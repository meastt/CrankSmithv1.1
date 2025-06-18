// components/NativeSelectFallback.js - Native select for very large datasets
import React from 'react';

export default function NativeSelectFallback({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = ''
}) {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      onChange(selectedId);
    }
  };

  return (
    <div className={className}>
      <select
        value={value || ''}
        onChange={handleChange}
        className="input-field w-full"
        style={{ 
          fontSize: '16px',
          minHeight: '48px',
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.model} {option.variant} ({option.weight}g)
          </option>
        ))}
      </select>
    </div>
  );
}