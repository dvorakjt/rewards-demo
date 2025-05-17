import { Outlet } from 'react-router';
import { NavigationMenu } from './components/navigation-menu';

export function RootLayout() {
  return (
    <main>
      <NavigationMenu />
      <Outlet></Outlet>
    </main>
  );
}
