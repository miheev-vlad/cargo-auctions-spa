import { delay, http, HttpResponse } from "msw";
import { getAuctionBets, getAuctionDetail, listAuctions, placeBet } from "./db";
import type { AuctionListRequest } from "../entities/auction/model/types";
import type { SetBetRequest } from "../entities/bet/model/types";

const LATENCY_MS = 350;

export const handlers = [
  http.post("/api/v1/auctions/list", async ({ request }) => {
    await delay(LATENCY_MS);
    const body = (await request.json()) as AuctionListRequest;
    const result = listAuctions(body);
    return HttpResponse.json(result);
  }),

  http.get("/api/v1/auctions/:auctionId", async ({ params }) => {
    await delay(LATENCY_MS);
    const auctionId = Number(params.auctionId);
    const detail = getAuctionDetail(auctionId);
    if (!detail) {
      return HttpResponse.json(
        { code: "not_found", title: "Not Found", message: "Аукцион не найден" },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }
    return HttpResponse.json(detail);
  }),

  http.get("/api/v1/auctions/:auctionId/bets", async ({ params, request }) => {
    await delay(LATENCY_MS);
    const auctionId = Number(params.auctionId);
    const url = new URL(request.url);
    const includeAll = url.searchParams.get("all") === "true";
    const bets = getAuctionBets(auctionId, includeAll);
    if (!bets) {
      return HttpResponse.json(
        { code: "not_found", title: "Not Found", message: "Аукцион не найден" },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }
    return HttpResponse.json(bets);
  }),

  http.post("/api/v1/auctions/:auctionId/bets", async ({ params, request }) => {
    await delay(LATENCY_MS);
    const auctionId = Number(params.auctionId);
    const body = (await request.json()) as SetBetRequest;

    const result = placeBet(auctionId, Number(body.price));
    if (!result) {
      return HttpResponse.json(
        { code: "not_found", title: "Not Found", message: "Аукцион не найден" },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }
    if (!result.ok) {
      return HttpResponse.json(
        {
          code: "validation_failed",
          title: "Validation Failed",
          message: "Ставка не прошла проверку",
          errors: result.errors,
        },
        {
          status: 422,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }
    return HttpResponse.json(result.bet);
  }),
];
