import { Outlet } from 'react-router';
import { NavigationMenu } from './components/navigation-menu';
import styles from './root-layout.module.scss';

export function RootLayout() {
  return (
    <main>
      <NavigationMenu />
      <div className={styles.app}>
        <Outlet></Outlet>
      </div>
    </main>
  );
}
