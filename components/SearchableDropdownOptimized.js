  // Handle selection
  const handleSelect = useCallback((option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
    setCurrentPage(0);
  }, [onChange]);