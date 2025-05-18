import { useState, useId, useEffect } from 'react';
import { PartnersListItem } from '../partners-list-item';
import type { Partner } from '../../model/partner';
import deleteIcon from '/src/assets/icons/delete.png';
import styles from './styles.module.scss';

interface PartnersListProps {
  partners: Partner[];
  deletePartners: (partnerIds: string[]) => void;
}

export function PartnersList({ partners, deletePartners }: PartnersListProps) {
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
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

  function deleteSelectedPartners() {
    deletePartners(selectedPartnerIds);
  }

  useEffect(() => {
    /*
      Unselect partnerIds when the corresponding partners are removed from the 
      partners array.
    */
    let shouldUpdateSelectedIds = false;

    for (const partnerId of selectedPartnerIds) {
      if (!partners.find((p) => p.id === partnerId)) {
        shouldUpdateSelectedIds = true;
        break;
      }
    }

    if (shouldUpdateSelectedIds) {
      setSelectedPartnerIds(
        selectedPartnerIds.filter((id) => {
          return !!partners.find((p) => p.id === id);
        })
      );
    }
  }, [partners, selectedPartnerIds]);

  return (
    <ul className={styles.partners_list}>
      <li className={styles.controls_list_item}>
        <div>
          <div>
            <input
              type="checkbox"
              id={selectAllInputId}
              name="selectAllPartners"
              checked={allPartnersSelected}
              onClick={handleSelectAllInput}
              aria-label={selectAllAriaLabel}
            />
            <label htmlFor={selectAllInputId}>Select All</label>
          </div>
          <div>
            <button
              type="button"
              onClick={deleteSelectedPartners}
              className={styles.delete_button}
            >
              <img src={deleteIcon} alt="Delete selected partners" />
            </button>
          </div>
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
