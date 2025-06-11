import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type FormEventHandler
} from 'react';
import { Button } from '../button';
import backArrowEnabled from '/src/assets/icons/back-arrow-enabled.png';
import backArrowDisabled from '/src/assets/icons/back-arrow-disabled.png';
import forwardArrowEnabled from '/src/assets/icons/forward-arrow-enabled.png';
import forwardArrowDisabled from '/src/assets/icons/forward-arrow-disabled.png';
import styles from './styles.module.scss';

/**
 * Props accepted by the {@link PaginationControls} component.
 */
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
   * alter the visible page range.
   */
  goToNextPage: () => void;
  /**
   * A function that navigates to the previous page in the paginated list and
   * may alter the visible page range.
   */
  goToPreviousPage: () => void;
  /**
   * A function that navigates to a given page, provided that page exists, and
   * may alter the visible page range.
   */
  goToPage: (page: number) => void;
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
  goToPreviousPage,
  goToPage
}: PaginationControlsProps) {
  const hasNextPage = currentPage < lastPage;
  const hasPreviousPage = currentPage > 1;
  const showLeftEllipsis = visiblePageRange[0] >= 2;
  const showRightEllipsis = visiblePageRange[1] <= lastPage;
  const [showGoToControl, setShowGoToControl] = useState<
    'none' | 'left' | 'right'
  >('none');
  const showLeftGoTo = showGoToControl === 'left';
  const showRightGoTo = showGoToControl === 'right';
  const leftGoToInputRef = useRef<HTMLInputElement>(null);
  const rightGoToInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showGoToControl === 'left') {
      leftGoToInputRef.current?.focus();
    } else if (showGoToControl === 'right') {
      rightGoToInputRef.current?.focus();
    }
  }, [showGoToControl]);

  return (
    <div className={styles.container}>
      <div className={styles.go_to_controls}>
        <GoToPage
          lastPage={lastPage}
          goToPage={goToPage}
          visibility={showLeftGoTo ? 'visible' : 'hidden'}
          ref={leftGoToInputRef}
        />
        <GoToPage
          lastPage={lastPage}
          goToPage={goToPage}
          visibility={showRightGoTo ? 'visible' : 'hidden'}
          ref={rightGoToInputRef}
        />
      </div>
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
        {showLeftEllipsis && (
          <>
            <PageNumberButton page={1} goToPage={goToPage} />
            <button
              type="button"
              className={styles.control_button}
              style={{ marginRight: '15px' }}
              onClick={() =>
                setShowGoToControl(showGoToControl === 'left' ? 'none' : 'left')
              }
            >
              ...
            </button>
          </>
        )}
        {(function* () {
          for (let i = visiblePageRange[0]; i < visiblePageRange[1]; i++) {
            yield (
              <PageNumberButton
                page={i}
                goToPage={goToPage}
                isCurrentPage={currentPage === i}
              />
            );
          }
        })()}
        {showRightEllipsis && (
          <>
            <button
              type="button"
              className={styles.control_button}
              style={{ marginRight: '15px' }}
              onClick={() =>
                setShowGoToControl(
                  showGoToControl === 'right' ? 'none' : 'right'
                )
              }
            >
              ...
            </button>
            <PageNumberButton page={lastPage} goToPage={goToPage} />
          </>
        )}
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
    </div>
  );
}

/**
 * Props accepted by the {@link GoToPage} component.
 */
interface GoToPageProps {
  /**
   * Hides or shows the element while ensuring that the surrounding layout does
   * not change.
   */
  visibility: 'visible' | 'hidden';
  /**
   * The last page in the paginated list.
   */
  lastPage: number;
  /**
   * A function that takes the user to the specified page.
   */
  goToPage: (page: number) => void;
}

/**
 * Renders a form with one input and a submit button that, upon submit, takes
 * the user to the page they entered into the input. Displays an error message
 * if the specified page does not exist.
 */
const GoToPage = forwardRef<HTMLInputElement, GoToPageProps>(function GoToPage(
  { visibility, lastPage, goToPage },
  ref
) {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setHasError(false);

    const page = Number(inputValue);

    if (Number.isNaN(page) || page < 1 || page > lastPage) {
      setHasError(true);
      return;
    }

    goToPage(page);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={styles.go_to_page}
      style={{ visibility }}
    >
      <div className={styles.input_group}>
        <input
          type="number"
          className={styles.go_to_input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-invalid={hasError}
          ref={inputRef}
        />
        <span
          className={styles.error_message}
          style={{
            visibility:
              visibility === 'visible' && hasError ? 'visible' : 'hidden'
          }}
        >
          Error
        </span>
      </div>
      <Button type="submit" variant="solid-yellow">
        Go
      </Button>
    </form>
  );
});

/**
 * Props accepted by the {@link PageNumberButton} component.
 */
interface PageNumberButtonProps {
  /**
   * The page number to link to and display.
   */
  page: number;
  /**
   * A function that navigates to a given page.
   */ /**
   * Whether or not the button displays the page number of the current page.
   */
  isCurrentPage?: boolean;
  goToPage: (page: number) => void;
}

/**
 * Renders a button containing the number of a page within a paginated list that
 * the user will be taken to when the button is clicked.
 */
function PageNumberButton({
  page,
  isCurrentPage,
  goToPage
}: PageNumberButtonProps) {
  return (
    <button
      type="button"
      onClick={() => goToPage(page)}
      className={styles.control_button}
    >
      <span
        className={
          isCurrentPage ? styles.current_page_number : styles.page_number
        }
        style={{ marginRight: '15px' }}
      >
        {page}
      </span>
    </button>
  );
}
