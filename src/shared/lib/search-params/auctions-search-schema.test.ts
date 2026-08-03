import { describe, expect, it } from "vitest";
import {
  DEFAULT_AUCTIONS_SEARCH,
  parseAuctionsSearch,
  searchToListRequest,
} from "./auctions-search-schema";

describe("parseAuctionsSearch", () => {
  it("falls back to defaults for an empty/undefined input", () => {
    expect(parseAuctionsSearch(undefined)).toEqual(DEFAULT_AUCTIONS_SEARCH);
  });

  it("coerces string page/per_page from raw URLSearchParams-like input", () => {
    const result = parseAuctionsSearch({ page: "3", per_page: "50" });
    expect(result.page).toBe(3);
    expect(result.per_page).toBe(50);
  });

  it("drops an invalid trading-status enum value instead of throwing", () => {
    const result = parseAuctionsSearch({ status: "not-a-real-status" });
    expect(result.status).toBeUndefined();
    expect(result.page).toBe(1);
  });

  it("falls back to page 1 for a negative or zero page", () => {
    expect(parseAuctionsSearch({ page: "0" }).page).toBe(1);
    expect(parseAuctionsSearch({ page: "-5" }).page).toBe(1);
  });

  it("caps per_page at the schema maximum default fallback", () => {
    expect(parseAuctionsSearch({ per_page: "999" }).per_page).toBe(20);
  });

  it("rejects an auction_status code outside the 1-8 range", () => {
    expect(
      parseAuctionsSearch({ auction_status: "99" }).auction_status,
    ).toBeUndefined();
    expect(parseAuctionsSearch({ auction_status: "6" }).auction_status).toBe(6);
  });

  it('coerces boolean-like strings for is_available/is_bidder, including the "false" string', () => {
    const result = parseAuctionsSearch({
      is_available: "true",
      is_bidder: "false",
    });
    expect(result.is_available).toBe(true);
    expect(result.is_bidder).toBe(false);
  });

  it("rejects a malformed date and falls back to undefined", () => {
    const result = parseAuctionsSearch({ load_date_from: "not-a-date" });
    expect(result.load_date_from).toBeUndefined();
  });
});

describe("searchToListRequest", () => {
  it("wraps single-choice status/statuses/auc_type filters into the arrays the API expects", () => {
    const request = searchToListRequest({
      page: 2,
      per_page: 20,
      cargo_num: "CN-001",
      status: "Leading",
      auction_status: 2,
      auc_type: "Up",
    });
    expect(request.page).toBe(2);
    expect(request.per_page).toBe(20);
    expect(request.status).toEqual(["Leading"]);
    expect(request.statuses).toEqual([2]);
    expect(request.auc_type).toEqual(["Up"]);
  });

  it("converts a date-only load_date_from/to into ISO datetimes with offset", () => {
    const request = searchToListRequest({
      page: 1,
      per_page: 20,
      load_date_from: "2026-08-01",
      load_date_to: "2026-08-05",
    });
    expect(request.load_date_from).toBe("2026-08-01T00:00:00+03:00");
    expect(request.load_date_to).toBe("2026-08-05T23:59:59+03:00");
  });

  it("leaves unset filters as undefined rather than null", () => {
    const request = searchToListRequest({ page: 1, per_page: 20 });
    expect(request.status).toBeUndefined();
    expect(request.statuses).toBeUndefined();
    expect(request.auc_type).toBeUndefined();
  });
});
