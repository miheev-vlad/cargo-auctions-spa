import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root.route';
import { DEFAULT_AUCTIONS_SEARCH } from '../../../shared/lib/search-params/auctions-search-schema';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/auctions', search: DEFAULT_AUCTIONS_SEARCH });
  },
});
