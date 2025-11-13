import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debounced search input
 * @param delay - Delay in milliseconds before triggering the search
 * @returns Object with search value, setter, and debounced value
 */
export const useDebouncedSearch = (delay: number = 500) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);

  const clearSearch = useCallback(() => {
    setSearchValue('');
    setDebouncedValue('');
  }, []);

  return {
    searchValue,
    setSearchValue,
    debouncedValue,
    clearSearch,
  };
};



