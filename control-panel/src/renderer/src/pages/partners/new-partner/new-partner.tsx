import { NewPartnerForm } from '../../../components/new-partner-form';
import styles from './styles.module.scss';

export function NewPartner() {
  return (
    <div className={styles.page}>
      <NewPartnerForm />
    </div>
  );
}
