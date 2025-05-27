import { useState, useRef, useEffect } from 'react';

interface UsePaginationReturnType<T> {
  visibleItems: T[];
  currentPage: number;
  lastPage: number;
  visiblePageRange: [number, number];
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

interface PaginatedListState {
  currentPage: number;
  visiblePageRange: [number, number];
}

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  pagesPerView: number
): UsePaginationReturnType<T> {
  validateArgs(itemsPerPage, pagesPerView);

  const [state, setState] = useState<PaginatedListState>(
    initializeState(items.length, itemsPerPage, pagesPerView)
  );

  const previousItemCount = useRef(items.length);

  useEffect(() => {
    if (items.length < previousItemCount.current) {
      setState((prev) => {
        return handleItemRemoval(
          prev,
          items.length,
          itemsPerPage,
          pagesPerView
        );
      });
    } else if (items.length > previousItemCount.current) {
      setState((prev) => {
        return handleItemAddition(
          prev,
          items.length,
          itemsPerPage,
          pagesPerView
        );
      });
    }

    previousItemCount.current = items.length;
  }, [items.length, itemsPerPage, pagesPerView]);

  const visibleItems = items.slice(
    ...calculateVisibleItemsRange(state.currentPage, itemsPerPage)
  );

  const lastPage = calculateLastPage(items.length, itemsPerPage);

  function goToNextPage() {
    goToPage(state.currentPage + 1);
  }

  function goToPreviousPage() {
    goToPage(state.currentPage - 1);
  }

  function goToPage(page: number) {
    if (page === state.currentPage || page < 1 || page > lastPage) return;

    let visiblePageRange = state.visiblePageRange;

    if (page < state.visiblePageRange[0]) {
      const rangeEnd = page + pagesPerView;
      visiblePageRange = [page, rangeEnd];
    } else if (page >= state.visiblePageRange[1]) {
      const rangeEnd = page + 1;
      const rangeStart = rangeEnd - pagesPerView;
      visiblePageRange = [rangeStart, rangeEnd];
    }

    setState({
      currentPage: page,
      visiblePageRange
    });
  }

  return {
    ...state,
    visibleItems,
    lastPage,
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
}

function validateArgs(itemsPerPage: number, pagesPerView: number) {
  if (itemsPerPage <= 0 || !Number.isInteger(itemsPerPage)) {
    throw new Error('itemsPerPage must be a positive integer.');
  }

  if (pagesPerView <= 0 || !Number.isInteger(pagesPerView)) {
    throw new Error('pagesPerView must be a positive integer.');
  }
}

function initializeState(
  totalItems: number,
  itemsPerPage: number,
  pagesPerView: number
): PaginatedListState {
  return {
    currentPage: 1,
    visiblePageRange: [
      1,
      Math.min(
        calculateNextWindow(1, pagesPerView),
        calculateLastPage(totalItems, itemsPerPage) + 1
      )
    ]
  };
}

function handleItemRemoval(
  state: PaginatedListState,
  totalItems: number,
  itemsPerPage: number,
  pagesPerView: number
): PaginatedListState {
  const newLastPage = calculateLastPage(totalItems, itemsPerPage);
  const newCurrentPage = Math.min(state.currentPage, newLastPage);
  const newRangeEnd = Math.min(state.visiblePageRange[1], newLastPage + 1);
  const newRangeStart = Math.max(newRangeEnd - pagesPerView, 1);
  return {
    currentPage: newCurrentPage,
    visiblePageRange: [newRangeStart, newRangeEnd]
  };
}

function handleItemAddition(
  state: PaginatedListState,
  totalItems: number,
  itemsPerPage: number,
  pagesPerView: number
): PaginatedListState {
  const newLastPage = calculateLastPage(totalItems, itemsPerPage);
  const newRangeEnd = Math.min(
    state.visiblePageRange[0] + pagesPerView,
    newLastPage + 1
  );
  return {
    ...state,
    visiblePageRange: [state.visiblePageRange[0], newRangeEnd]
  };
}

function calculateLastPage(totalItems: number, itemsPerPage: number) {
  return Math.max(Math.ceil(totalItems / itemsPerPage), 1);
}

function calculateNextWindow(currentPage: number, pagesPerView: number) {
  return currentPage + pagesPerView;
}

function calculateVisibleItemsRange(currentPage: number, itemsPerPage: number) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return [start, end];
}
