import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root.route';
import { auctionsSearchSchema } from '../../../shared/lib/search-params/auctions-search-schema';
import { AuctionsListPage } from '../../../pages/auctions-list-page/ui/AuctionsListPage.component';

export const auctionsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions',
  validateSearch: auctionsSearchSchema,
  component: AuctionsListPage,
});
