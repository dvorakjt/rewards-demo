import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { PartnersContext } from '@renderer/contexts/partners-context';
import { SearchBar } from '@renderer/components/searchbar';
import { Select } from '@renderer/components/select';
import { PartnersList } from '@renderer/components/partners-list';
import { PaginationControls } from '@renderer/components/pagination-controls';
import { ToolTip } from '@renderer/components/tooltip';
import { SortOrder } from '@renderer/model/sort-order';
import { usePagination } from '@renderer/hooks/use-pagination';
import { alphabetize } from '@renderer/util/alphabetize';
import newPartnerIcon from '/src/assets/icons/new-partner.png';
import styles from './styles.module.scss';

export function Partners() {
  const { partners, deletePartnersById } = useContext(PartnersContext)!;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredAndSortedPartners = alphabetize(
    partners.filter((p) => {
      return p.name.includes(searchTerm);
    }),
    sortOrder,
    'name'
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

  const visiblePartnerIdsRef = useRef(
    new Set(visiblePartners.map((p) => p.id))
  );

  useEffect(() => {
    let visiblePartnersHaveChanged =
      visiblePartners.length !== visiblePartnerIdsRef.current.size;
    if (!visiblePartnersHaveChanged) {
      visiblePartnersHaveChanged = !visiblePartners.every((p) =>
        visiblePartnerIdsRef.current.has(p.id)
      );
    }
    if (visiblePartnersHaveChanged) {
      setSelectedPartnerIds([]);
    }

    visiblePartnerIdsRef.current = new Set(visiblePartners.map((p) => p.id));
  }, [visiblePartners]);

  useEffect(() => {
    goToPage(1);
  }, [searchTerm]);

  const visitNewPartnerPage = () => navigate('/partners/new');

  const deleteSelectedPartners = () => {
    deletePartnersById(selectedPartnerIds);
  };

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
                  value: SortOrder.Ascending
                },
                {
                  text: 'Z to A',
                  value: SortOrder.Descending
                }
              ]}
              className={styles.header_control}
            />
            <ToolTip tip="Add partner" placement="below">
              <button
                type="button"
                className={styles.new_partner_button}
                onClick={visitNewPartnerPage}
              >
                <img src={newPartnerIcon} className={styles.new_partner_icon} />
              </button>
            </ToolTip>
          </div>
        </div>
      </header>
      <section>
        <PartnersList
          partners={visiblePartners}
          selectedPartnerIds={selectedPartnerIds}
          setSelectedPartnerIds={setSelectedPartnerIds}
          deleteSelectedPartners={deleteSelectedPartners}
        />
        <div className={styles.pagination_controls_container}>
          <PaginationControls
            currentPage={currentPage}
            lastPage={lastPage}
            visiblePageRange={visiblePageRange}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            goToPage={goToPage}
          />
        </div>
      </section>
    </div>
  );
}
