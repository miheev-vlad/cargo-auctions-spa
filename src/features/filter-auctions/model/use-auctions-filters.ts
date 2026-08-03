import { useNavigate, useSearch } from "@tanstack/react-router";
import type { AuctionsSearch } from "../../../shared/lib/search-params/auctions-search-schema";

export function useAuctionsFilters() {
  const search = useSearch({ from: "/auctions" });
  const navigate = useNavigate({ from: "/auctions" });

  const setFilters = (patch: Partial<AuctionsSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...patch, page: 1 }),
    });
  };

  const setPage = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  const resetFilters = () => {
    navigate({ search: { page: 1, per_page: search.per_page } });
  };

  return { search, setFilters, setPage, resetFilters };
}
