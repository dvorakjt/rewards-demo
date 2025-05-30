import { useId, type Dispatch, type SetStateAction } from 'react';
import { Checkbox } from '../checkbox';
import { PartnersListItem } from '../partners-list-item';
import type { Partner } from '../../model/partner';
import deleteIcon from '/src/assets/icons/delete.png';
import styles from './styles.module.scss';

interface PartnersListProps {
  /**
   * An array of partners to render.
   */
  partners: Partner[];
  /**
   * An array of ids representing the partners the user has currently selected.
   */
  selectedPartnerIds: string[];
  /**
   * A function for setting the currently selected ids.
   */
  setSelectedPartnerIds: Dispatch<SetStateAction<string[]>>;
  /**
   * A function that should move all currently selected partners to the
   * recycle bin.
   */
  deleteSelectedPartners: () => void;
}

/**
 * Renders a list that displays information about existing partners and allows
 * the user to view, edit, and delete them.
 *
 * @param props {@link PartnersListProps}
 */
export function PartnersList({
  partners,
  selectedPartnerIds,
  setSelectedPartnerIds,
  deleteSelectedPartners
}: PartnersListProps) {
  const allPartnersSelected = selectedPartnerIds.length === partners.length;
  const selectAllInputId = useId();
  const selectAllAriaLabel = 'Select all partners';

  function handleSelectAllInput() {
    if (allPartnersSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }

  function selectAll() {
    setSelectedPartnerIds(partners.map((p) => p.id));
  }

  function deselectAll() {
    setSelectedPartnerIds([]);
  }

  return (
    <ul className={styles.partners_list}>
      <li className={styles.controls_list_item}>
        <div className={styles.controls_list_item_content}>
          <div className={styles.select_all_group}>
            <Checkbox
              id={selectAllInputId}
              name="selectAllPartners"
              checked={allPartnersSelected}
              onClick={handleSelectAllInput}
              aria-label={selectAllAriaLabel}
            />
            <label htmlFor={selectAllInputId}>Select All</label>
          </div>
          <button
            type="button"
            onClick={deleteSelectedPartners}
            className={styles.delete_button}
          >
            <img src={deleteIcon} alt="Delete selected partners" />
          </button>
        </div>
      </li>
      {partners.map((p) => {
        const isSelected = selectedPartnerIds.includes(p.id);

        const setIsSelected = (shouldBeSelected: boolean) => {
          if (shouldBeSelected && !isSelected) {
            const updatedPartnerIds = [...selectedPartnerIds, p.id];
            setSelectedPartnerIds(updatedPartnerIds);
          } else if (!shouldBeSelected && isSelected) {
            const updatedPartnerIds = selectedPartnerIds.filter(
              (id) => id !== p.id
            );
            setSelectedPartnerIds(updatedPartnerIds);
          }
        };

        return (
          <PartnersListItem
            partner={p}
            key={p.id}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
          />
        );
      })}
    </ul>
  );
}
