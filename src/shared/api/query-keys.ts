import type { AuctionListRequest } from "../../entities/auction/model/types";

export const queryKeys = {
  auctions: {
    all: ["auctions"] as const,
    list: (request: AuctionListRequest) =>
      ["auctions", "list", request] as const,
    detail: (auctionId: number) => ["auctions", "detail", auctionId] as const,
    bets: (auctionId: number) => ["auctions", "bets", auctionId] as const,
  },
};
