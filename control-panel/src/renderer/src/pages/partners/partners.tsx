import { useState } from 'react';
import { SearchBar } from '@renderer/components/searchbar';
import styles from './styles.module.scss';

export function Partners() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <section>
        <h1 className="heading">Partners</h1>
        <SearchBar
          value={searchTerm}
          onChange={({ target: { value } }) => setSearchTerm(value)}
        />
      </section>
      <section></section>
    </div>
  );
}
