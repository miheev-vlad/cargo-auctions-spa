import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import { auctionsSearchSchema } from "../../../shared/lib/search-params/auctions-search-schema";
import { AuctionDetailPage } from "../../../pages/auction-detail-page/ui/AuctionDetailPage.component";

export const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auctions/$auctionId",
  validateSearch: auctionsSearchSchema,
  component: AuctionDetailPage,
});
