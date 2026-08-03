import { createRoute } from '@tanstack/react-router';
import { auctionsListRoute } from './auctions-list.route';
import { AuctionDetailPage } from '../../../pages/auction-detail-page/ui/AuctionDetailPage.component';

export const auctionDetailRoute = createRoute({
  getParentRoute: () => auctionsListRoute,
  path: '/$auctionId',
  component: AuctionDetailPage,
});
