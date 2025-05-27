import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';
import { usePagination } from '@renderer/hooks/use-pagination';
import { SearchBar } from '@renderer/components/searchbar';
import { Select } from '@renderer/components/select';
import { PartnersList } from '@renderer/components/partners-list';
import type { Partner } from '@renderer/model/partner';
import newPartnerIcon from '/src/assets/icons/new-partner.png';
import styles from './styles.module.scss';
import { PaginationControls } from '@renderer/components/pagination-controls';

type SortOrder = 'asc' | 'desc';

// selectedPartnerIds should probably live in this component
// selectedParnerIds should be reset when the seach term is reset or 
// the sort order is changed
export function Partners() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [partners, setPartners] = useState(() => generateDummyPartners(100));

  const filteredAndSortedPartners = alphabetizePartners(
    partners.filter((p) => {
      return p.name.includes(searchTerm);
    }),
    sortOrder
  );

  const {
    visibleItems: visiblePartners,
    currentPage,
    lastPage,
    visiblePageRange,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = usePagination(filteredAndSortedPartners, 10, 5);

  const visitNewPartnerPage = () => navigate('/partners/new');

  const deletePartners = (partnerIds: string[]) => {
    const updatedPartners = partners.filter((p) => !partnerIds.includes(p.id));
    setPartners(updatedPartners);
  };

  useEffect(() => {
    goToPage(1);
    // also clear selected partners
  }, [searchTerm]);

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.header_content}>
          <h1 className={styles.heading}>Partners</h1>
          <div className={styles.header_controls}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className={styles.header_control}
            />
            <Select
              id="sort-order"
              name="sortOrder"
              value={sortOrder}
              setValue={setSortOrder}
              options={[
                {
                  text: 'A to Z',
                  value: 'asc'
                },
                {
                  text: 'Z to A',
                  value: 'desc'
                }
              ]}
              className={styles.header_control}
            />
            <button
              type="button"
              className={styles.new_partner_button}
              onClick={visitNewPartnerPage}
            >
              <img src={newPartnerIcon} className={styles.new_partner_icon} />
            </button>
          </div>
        </div>
      </header>
      <section>
        <PartnersList
          partners={visiblePartners}
          deletePartners={deletePartners}
        />
        <PaginationControls
          currentPage={currentPage}
          lastPage={lastPage}
          visiblePageRange={visiblePageRange}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </section>
    </div>
  );
}

function alphabetizePartners(partners: Partner[], sortOrder: SortOrder) {
  return partners.toSorted(({ name: a }, { name: b }) => {
    let result: number;
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a < b) {
      result = -1;
    } else if (a > b) {
      result = 1;
    } else {
      result = 0;
    }

    if (sortOrder === 'desc') {
      result *= -1;
    }

    return result;
  });
}

function generateDummyPartners(count: number) {
  const partners: Partner[] = [];
  for (let i = 1; i <= count; i++) {
    partners.push({
      id: uuid(),
      name: `Partner ${i.toString().padStart(count.toString().length, '0')}`
    });
  }
  return partners;
}
