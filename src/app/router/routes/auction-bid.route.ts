import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import { auctionsSearchSchema } from "../../../shared/lib/search-params/auctions-search-schema";
import { AuctionBidPage } from "../../../pages/auction-bid-page/ui/AuctionBidPage.component";

export const auctionBidRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auctions/$auctionId/bid",
  validateSearch: auctionsSearchSchema,
  component: AuctionBidPage,
});
