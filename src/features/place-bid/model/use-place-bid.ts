import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient, ApiRequestError } from "../../../shared/api/http-client";
import { queryKeys } from "../../../shared/api/query-keys";
import type { BetItem, SetBetRequest } from "../../../entities/bet/model/types";
import type { ValidationProblem } from "../../../entities/auction/model/types";

export function usePlaceBid(auctionId: number) {
  const queryClient = useQueryClient();

  return useMutation<BetItem, ApiRequestError, SetBetRequest>({
    mutationFn: (payload) =>
      httpClient.post<BetItem, SetBetRequest>(
        `/auctions/${auctionId}/bets`,
        payload,
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auctions.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.auctions.detail(auctionId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.auctions.bets(auctionId),
        }),
      ]);
    },
  });
}

export function getValidationFieldErrors(
  error: unknown,
): Record<string, string[]> | undefined {
  if (error instanceof ApiRequestError && error.status === 422) {
    const problem = error.body as ValidationProblem | undefined;
    if (!problem?.errors) return undefined;
    return problem.errors.reduce<Record<string, string[]>>((acc, e) => {
      acc[e.field] = [...(acc[e.field] ?? []), e.message];
      return acc;
    }, {});
  }
  return undefined;
}
