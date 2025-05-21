import type { CSSProperties } from 'react';
import magnifyingGlass from '/src/assets/icons/magnifying-glass.png';
import styles from './styles.module.scss';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  className?: string;
  style?: CSSProperties;
}

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
