import { Link } from 'react-router';
import { NewPartnerForm } from '../../../components/new-partner-form';
import styles from './styles.module.scss';

export function NewPartner() {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/partners">Partners</Link> / New Partner
      </div>
      <div className={styles.content}>
        <NewPartnerForm />
      </div>
    </div>
  );
}
