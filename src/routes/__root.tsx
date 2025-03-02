import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import Navbar from '../components/header/navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <header className="flex gap-2 p-2 text-lg">
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
