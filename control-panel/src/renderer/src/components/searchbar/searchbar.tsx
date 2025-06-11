import type { CSSProperties } from 'react';
import magnifyingGlass from '/src/assets/icons/magnifying-glass.png';
import styles from './styles.module.scss';

/**
 * Props accepted by the {@link SearchBar} component.
 */
interface SearchBarProps {
  /**
   * The current value to be displayed in the searchbar.
   */
  searchTerm: string;
  /**
   * A function for updating the value of the searchbar.
   */
  setSearchTerm: (searchTerm: string) => void;
  /**
   * A CSS class to be applied to the searchbar. Optional.
   */
  className?: string;
  /**
   * CSS styles to be applied to the searchbar. Optional.
   */
  style?: CSSProperties;
}

/**
 * Renders a styled searchbar.
 *
 * @param props {@link SearchBarProps}
 */
export function SearchBar({
  searchTerm,
  setSearchTerm,
  ...props
}: SearchBarProps) {
  let className = styles.searchbar;

  if (props.className) {
    className += ' ' + props.className;
  }

  return (
    <div className={className} style={props.style}>
      <img src={magnifyingGlass} alt="" className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        value={searchTerm}
        onChange={({ target: { value } }) => setSearchTerm(value)}
      />
    </div>
  );
}
