import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { SearchBar } from '@renderer/components/searchbar';
import { PartnersList } from '@renderer/components/partners-list';
import type { Partner } from '@renderer/model/partner';
import styles from './styles.module.scss';

export function Partners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState(() => {
    const partners: Partner[] = [];
    for (let i = 1; i <= 10; i++) {
      partners.push({
        id: uuid(),
        name: `Partner ${i}`
      });
    }
    return partners;
  });

  const filteredPartners = partners.filter((p) => {
    return p.name.includes(searchTerm);
  });

  const deletePartners = (partnerIds: string[]) => {
    const updatedPartners = partners.filter((p) => !partnerIds.includes(p.id));
    setPartners(updatedPartners);
  };

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className="heading">Partners</h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </header>
      <section>
        <PartnersList
          partners={filteredPartners}
          deletePartners={deletePartners}
        />
      </section>
    </div>
  );
}
