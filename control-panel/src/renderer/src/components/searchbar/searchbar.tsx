import { ChangeEventHandler } from 'react';
import magnifyingGlass from '/src/assets/icons/magnifying-glass.png';
import styles from './styles.module.scss';

interface SearchBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchbar}>
      <img src={magnifyingGlass} alt="" className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
