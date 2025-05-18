import magnifyingGlass from '/src/assets/icons/magnifying-glass.png';
import styles from './styles.module.scss';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className={styles.searchbar}>
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
