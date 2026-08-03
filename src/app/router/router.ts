import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/root.route";
import { indexRoute } from "./routes/index.route";
import { auctionsListRoute } from "./routes/auctions-list.route";
import { auctionDetailRoute } from "./routes/auction-detail.route";
import { auctionBidRoute } from "./routes/auction-bid.route";

const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionsListRoute,
  auctionDetailRoute,
  auctionBidRoute,
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
