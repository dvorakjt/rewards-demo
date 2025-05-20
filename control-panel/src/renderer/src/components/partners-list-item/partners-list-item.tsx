import { useId } from 'react';
import { useNavigate } from 'react-router';
import { Checkbox } from '../checkbox';
import type { Partner } from '@renderer/model/partner';
import viewIcon from '/src/assets/icons/view.png';
import editIcon from '/src/assets/icons/edit.png';
import styles from './styles.module.scss';

interface PartnersListItemProps {
  partner: Partner;
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
}

export function PartnersListItem({
  partner,
  isSelected,
  setIsSelected
}: PartnersListItemProps) {
  const navigate = useNavigate();

  const editPartner = () => {
    const path = `/partners/${partner.id}/edit`;
    navigate(path);
  };

  const viewPartner = () => {
    const path = `/partners/${partner.id}`;
    navigate(path);
  };

  const inputId = useId();
  const inputAriaLabel = isSelected
    ? `Deselect ${partner.name}`
    : `Select ${partner.name}`;

  const editIconAltText = `Edit ${partner.name}`;
  const viewIconAltText = `View ${partner.name}`;

  return (
    <li className={styles.partners_list_item}>
      <div className={styles.partners_list_item_content}>
        <div className={styles.checkbox_group}>
          <Checkbox
            id={inputId}
            name={partner.name}
            aria-label={inputAriaLabel}
            checked={isSelected}
            onChange={({ target: { checked } }) => {
              setIsSelected(checked);
            }}
          />
          <label htmlFor={inputId}>{partner.name}</label>
        </div>
        <div>
          <button type="button" onClick={editPartner}>
            <img src={editIcon} alt={editIconAltText} />
          </button>
          <button type="button" onClick={viewPartner}>
            <img src={viewIcon} alt={viewIconAltText} />
          </button>
        </div>
      </div>
    </li>
  );
}
