import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../shared/api/http-client';
import { queryKeys } from '../../../shared/api/query-keys';
import { QUERY_STALE_TIME_MS } from '../../../shared/config/constants';
import { searchToListRequest } from '../../../shared/lib/search-params/auctions-search-schema';
import type { AuctionsSearch } from '../../../shared/lib/search-params/auctions-search-schema';
import type { AuctionListRequest, AuctionListResponseBase } from '../../../entities/auction/model/types';

export function useAuctionsListQuery(search: AuctionsSearch) {
  const request: AuctionListRequest = searchToListRequest(search);

  return useQuery({
    queryKey: queryKeys.auctions.list(request),
    queryFn: () => httpClient.post<AuctionListResponseBase, AuctionListRequest>('/auctions/list', request),
    staleTime: QUERY_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
