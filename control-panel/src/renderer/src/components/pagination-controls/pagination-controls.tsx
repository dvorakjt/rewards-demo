import backArrowEnabled from '/src/assets/icons/back-arrow-enabled.png';
import backArrowDisabled from '/src/assets/icons/back-arrow-disabled.png';
import forwardArrowEnabled from '/src/assets/icons/forward-arrow-enabled.png';
import forwardArrowDisabled from '/src/assets/icons/forward-arrow-disabled.png';
import styles from './styles.module.scss';

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  visiblePageRange: [number, number];
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

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
        />
      </button>
    </div>
  );
}
