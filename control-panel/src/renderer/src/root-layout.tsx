import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <main>
      <h1>Hello from Root</h1>
      <Outlet></Outlet>
    </main>
  );
}
