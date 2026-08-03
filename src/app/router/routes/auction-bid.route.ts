import { createRoute } from '@tanstack/react-router';
import { auctionDetailRoute } from './auction-detail.route';
import { AuctionBidPage } from '../../../pages/auction-bid-page/ui/AuctionBidPage.component';

export const auctionBidRoute = createRoute({
  getParentRoute: () => auctionDetailRoute,
  path: '/bid',
  component: AuctionBidPage,
});
