import { useState, useMemo } from 'react';

export const usePagination = (items, initialItemsPerPage = 3) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);


  const totalPages = Math.ceil(items.length / itemsPerPage);


  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); 
  };

 
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    totalItems: items.length,
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination
  };
};