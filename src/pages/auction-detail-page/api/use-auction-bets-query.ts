import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../shared/api/http-client';
import { queryKeys } from '../../../shared/api/query-keys';
import type { BetListResponse } from '../../../entities/bet/model/types';

export function useAuctionBetsQuery(auctionId: number) {
  return useQuery({
    queryKey: queryKeys.auctions.bets(auctionId),
    queryFn: () => httpClient.get<BetListResponse>(`/auctions/${auctionId}/bets?all=true`),
  });
}
