import spinner from '/src/assets/icons/spinner.png';
import styles from './styles.module.scss';

export function LoadingWheel() {
  return (
    <>
      <div className={styles.transparent_overlay}></div>
      <div className={styles.spinner_container}>
        <img src={spinner} alt="loading" className={styles.spinner} />
      </div>
    </>
  );
}
