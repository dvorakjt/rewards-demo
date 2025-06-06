import backArrowEnabled from '/src/assets/icons/back-arrow-enabled.png';
import backArrowDisabled from '/src/assets/icons/back-arrow-disabled.png';
import forwardArrowEnabled from '/src/assets/icons/forward-arrow-enabled.png';
import forwardArrowDisabled from '/src/assets/icons/forward-arrow-disabled.png';
import styles from './styles.module.scss';

interface PaginationControlsProps {
  /**
   * The currently visible page.
   */
  currentPage: number;
  /**
   * The last page in the paginated list.
   */
  lastPage: number;
  /**
   * The range of page numbers that the controls should display.
   *
   * @remarks
   * The range is inclusive of the starting value and exlusive of the ending
   * value.
   */
  visiblePageRange: [number, number];
  /**
   * A function that navigates to the next page in the paginated list and may
   * alter the visiblePageRange.
   */
  goToNextPage: () => void;
  /**
   * A function that navigates to the previous page in the paginated list and
   * may alter the visiblePageRange.
   */
  goToPreviousPage: () => void;
}

/**
 * Renders controls (numbered buttons, arrows, etc.) for paging through a
 * paginated list.
 *
 * @param props {@link PaginationControlsProps}
 */
export function PaginationControls({
  currentPage,
  lastPage,
  visiblePageRange,
  goToNextPage,
  goToPreviousPage
}: PaginationControlsProps) {
  const hasNextPage = currentPage < lastPage;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className={styles.controls}>
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={!hasPreviousPage}
        className={styles.control_button}
        style={{ marginRight: '15px' }}
      >
        <img
          src={hasPreviousPage ? backArrowEnabled : backArrowDisabled}
          alt="Go to previous page"
          className={styles.arrow}
        />
      </button>
      {(function* () {
        for (let i = visiblePageRange[0]; i < visiblePageRange[1]; i++) {
          yield (
            <span
              className={
                currentPage === i
                  ? styles.current_page_number
                  : styles.page_number
              }
              style={{ marginRight: '15px' }}
            >
              {i}
            </span>
          );
        }
      })()}
      <button
        type="button"
        onClick={goToNextPage}
        disabled={!hasNextPage}
        className={styles.control_button}
      >
        <img
          src={hasNextPage ? forwardArrowEnabled : forwardArrowDisabled}
          alt="Go to next page"
          className={styles.arrow}
        />
      </button>
    </div>
  );
}
