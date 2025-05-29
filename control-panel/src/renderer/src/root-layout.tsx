import { Outlet } from 'react-router';
import { PartnersContextProvider } from './contexts/partners-context/partners-context-provider';
import { NavigationMenu } from './components/navigation-menu';
import styles from './root-layout.module.scss';

export function RootLayout() {
  return (
    <main>
      <PartnersContextProvider>
        <NavigationMenu />
        <div className={styles.app}>
          <Outlet></Outlet>
        </div>
      </PartnersContextProvider>
    </main>
  );
}
