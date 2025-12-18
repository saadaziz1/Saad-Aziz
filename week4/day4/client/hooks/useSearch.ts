import { useState, useMemo } from 'react';

export const useSearch = <T>(items: T[], searchKey: (item: T) => string) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      searchKey(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, searchKey]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};