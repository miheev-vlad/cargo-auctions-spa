import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "../../config/constants";

const TRADING_STATUSES = [
  "NotParticipating",
  "Leading",
  "Losing",
  "OnPending",
  "Confirmed",
  "ChoosingWinner",
  "Winner",
  "Accepted",
  "Unknown",
] as const;
const AUC_TYPES = ["Request", "Up", "Down", "FixPrice"] as const;

export const AUCTION_STATUS_CODES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const auctionsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  per_page: z.coerce.number().int().min(1).max(100).catch(DEFAULT_PAGE_SIZE),
  cargo_num: z.string().trim().min(1).optional().catch(undefined),
  status: z.enum(TRADING_STATUSES).optional().catch(undefined),
  auction_status: z.coerce
    .number()
    .int()
    .min(1)
    .max(8)
    .optional()
    .catch(undefined),
  auc_type: z.enum(AUC_TYPES).optional().catch(undefined),
  load_city: z.string().optional().catch(undefined),
  unload_city: z.string().optional().catch(undefined),
  load_date_from: z.string().date().optional().catch(undefined),
  load_date_to: z.string().date().optional().catch(undefined),
  is_available: z
    .preprocess(
      (v) => (v === "true" ? true : v === "false" ? false : v),
      z.boolean().optional(),
    )
    .catch(undefined),
  is_bidder: z
    .preprocess(
      (v) => (v === "true" ? true : v === "false" ? false : v),
      z.boolean().optional(),
    )
    .catch(undefined),
  current_price_from: z.coerce
    .number()
    .nonnegative()
    .optional()
    .catch(undefined),
  current_price_to: z.coerce.number().nonnegative().optional().catch(undefined),
});

export type AuctionsSearch = z.infer<typeof auctionsSearchSchema>;

export const DEFAULT_AUCTIONS_SEARCH: AuctionsSearch = {
  page: 1,
  per_page: DEFAULT_PAGE_SIZE,
};

export function parseAuctionsSearch(raw: unknown): AuctionsSearch {
  const result = auctionsSearchSchema.safeParse(raw ?? {});
  return result.success ? result.data : DEFAULT_AUCTIONS_SEARCH;
}

function toIsoWithOffset(dateOnly: string, endOfDay: boolean): string {
  return `${dateOnly}T${endOfDay ? "23:59:59" : "00:00:00"}+03:00`;
}

export function searchToListRequest(search: AuctionsSearch) {
  return {
    page: search.page,
    per_page: search.per_page,
    cargo_num: search.cargo_num,
    status: search.status ? [search.status] : undefined,
    statuses: search.auction_status ? [search.auction_status] : undefined,
    auc_type: search.auc_type ? [search.auc_type] : undefined,
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: search.load_date_from
      ? toIsoWithOffset(search.load_date_from, false)
      : undefined,
    load_date_to: search.load_date_to
      ? toIsoWithOffset(search.load_date_to, true)
      : undefined,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.current_price_from,
    current_price_to: search.current_price_to,
  };
}
