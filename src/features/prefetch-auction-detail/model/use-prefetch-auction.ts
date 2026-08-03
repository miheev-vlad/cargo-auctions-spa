import { useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../../../shared/api/http-client";
import { queryKeys } from "../../../shared/api/query-keys";
import type { AuctionShowResponse } from "../../../entities/auction/model/types";
import { QUERY_STALE_TIME_MS } from "../../../shared/config/constants";

export function usePrefetchAuctionDetail() {
  const queryClient = useQueryClient();

  return (auctionId: number) => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.auctions.detail(auctionId),
      queryFn: () =>
        httpClient.get<AuctionShowResponse>(`/auctions/${auctionId}`),
      staleTime: QUERY_STALE_TIME_MS,
    });
  };
}
