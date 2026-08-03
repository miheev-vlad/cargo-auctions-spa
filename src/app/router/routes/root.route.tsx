import { createRootRoute } from '@tanstack/react-router';
import { AppLayout } from '../../AppLayout.component';

export const rootRoute = createRootRoute({
  component: AppLayout,
});
