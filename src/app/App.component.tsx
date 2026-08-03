import { RouterProvider } from '@tanstack/react-router';
import { QueryProvider } from './providers/QueryProvider.component';
import { router } from './router/router';

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
