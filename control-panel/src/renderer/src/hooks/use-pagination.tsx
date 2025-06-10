import { useState, useRef, useEffect } from 'react';

/**
 * An object returned by the usePagination hook that consists of React state
 * variables representing the state of the paginated list, and functions for
 * navigating to specific pages within the list.
 */
interface UsePaginationReturnType<T> {
  /**
   * An array of the items visible on the current page of the list.
   */
  visibleItems: T[];
  /**
   * The current page of the list. Pages are numbered beginning with 1.
   */
  currentPage: number;
  /**
   * The last page of the list, which depends on how many items there are in
   * total in the list and how many items are visible on each page.
   */
  lastPage: number;
  /**
   * A tuple containing the start and end of a range of pages to be displayed to
   * the user at a given time.
   *
   * @remarks
   * The end of the range should not be included in the pages displayed to the
   * user. For example, if the value is `[1, 6]`, the user should see pages 1
   * through 5 displayed to the UI.
   */
  visiblePageRange: [number, number];
  /**
   * A function that takes the user to the next page and may update the
   * `visiblePagesRange`.
   *
   * @throws A {@link RangeError} if called while the current page is the last
   * page.
   */
  goToNextPage: () => void;
  /**
   * A function that takes the user to the previous page and may update the
   * `visiblePagesRange`.
   *
   * @throws A {@link RangeError} if called while the current page is the first
   * page.
   */
  goToPreviousPage: () => void;
  /**
   * A function that takes the user to the specified page and may update
   * the `visiblePagesRange`.
   *
   * @throws A {@link RangeError} if called with a page that does not exist.
   */
  goToPage: (page: number) => void;
}

/**
 * An object representing the current state of a paginated list.
 */
interface PaginatedListState {
  /**
   * The current page of the list. Pages are numbered beginning with 1.
   */
  currentPage: number;
  /**
   * A tuple containing the start and end of a range of pages to be displayed to
   * the user at a given time.
   *
   * @remarks
   * The end of the range should not be included in the pages displayed to the
   * user. For example, if the value is `[1, 6]`, the user should see pages 1
   * through 5 displayed to the UI.
   */
  visiblePageRange: [number, number];
}

/**
 * Accepts a list of items, the number of items to display per page, and the
 * number of pages for which navigation buttons or links should be displayed,
 * and returns a paginated list of those items, as well as other variables
 * related to the state of the list, and functions for navigating to certain
 * pages within the list.
 *
 * @param items - An array of items to paginate.
 * @param itemsPerPage - The number of items to display on each page.
 * @param pagesPerView - The number of pages for which navigation buttons or
 * links should be displayed.
 *
 * @returns An object of type {@link UsePaginationReturnType}.
 */
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
    if (page < 1 || page > lastPage) {
      throw new RangeError(
        'Page cannot be less than 1 or greater than ' + lastPage
      );
    }

    if (page === state.currentPage) return;

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
