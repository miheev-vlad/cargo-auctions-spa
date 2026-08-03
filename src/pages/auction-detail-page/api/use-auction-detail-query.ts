import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../shared/api/http-client';
import { queryKeys } from '../../../shared/api/query-keys';
import { QUERY_STALE_TIME_MS } from '../../../shared/config/constants';
import type { AuctionShowResponse } from '../../../entities/auction/model/types';

export function useAuctionDetailQuery(auctionId: number) {
  return useQuery({
    queryKey: queryKeys.auctions.detail(auctionId),
    queryFn: () => httpClient.get<AuctionShowResponse>(`/auctions/${auctionId}`),
    staleTime: QUERY_STALE_TIME_MS,
  });
}
