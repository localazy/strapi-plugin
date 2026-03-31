import { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const DEBOUNCE_MS = 300;

const useDebouncedSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSetQuery = useMemo(() => debounce((value: string) => setSearchQuery(value), DEBOUNCE_MS), []);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  return { searchInput, searchQuery, onSearchChange };
};

export default useDebouncedSearch;
