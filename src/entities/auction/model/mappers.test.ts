import { describe, expect, it } from "vitest";
import { resolvePrimaryAction, toAuctionCardViewModel } from "./mappers";
import type { AuctionListItem } from "./types";

function buildItem(
  overrides: Partial<AuctionListItem["trading"]> = {},
): AuctionListItem {
  return {
    main: {
      id: 1,
      cargo_num: "CN-001",
      cargo_date: "2026-08-01T08:00:00",
      auc_type: "Up",
      order_uid: "uuid-1",
      created_at: "2026-07-01T08:00:00",
      priority_sort: 0,
      is_assembly: false,
      price_per_km: 55,
    },
    organizer: {
      subscriber_id: 1,
      organization_id: 1,
      organization_name: "ООО Организатор",
      organization_inn: "7700000000",
      organization_kpp: "770001001",
      is_hide_organization: false,
    },
    route: {
      load: {
        city: "Москва",
        address: "ул. Промышленная, 1",
        date: "2026-08-01T08:00:00",
        city_gc_id: 100,
        points_count: 1,
      },
      unload: {
        city: "Санкт-Петербург",
        address: "ул. Складская, 1",
        date: "2026-08-02T08:00:00",
        city_gc_id: 101,
        points_count: 1,
      },
    },
    cargo: {
      name: "Стройматериалы",
      weight: 12,
      volume: 40,
      body_type: "тентованный",
      truck_count: 1,
      is_cargo: true,
      is_international: false,
      containered: false,
      incoterms: null,
      conics: null,
      belts: null,
      adr: null,
      coupling: null,
      air_pass: null,
      low_loader: null,
      additional_load: null,
      temp_from: null,
      temp_to: null,
      loading_types: { side: false, top: false, rear: false, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: null,
    },
    trading: {
      status: "Auction",
      status_mobile: "Leading",
      start_time: "2026-08-01T00:00:00",
      stop_time: "2026-08-01T12:00:00",
      bid_measurement_type: "PerRoute",
      can_set_bet: true,
      allow_counter_bets: true,
      hide_points_address_and_contacts: false,
      direction: null,
      comment: null,
      is_bidder: false,
      is_available: true,
      is_accredited: true,
      is_favorite: false,
      price: { start: 45000, current: 45000, current_no_vat: 37500 },
      your: { bet: false, last_bet: null },
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: null,
      ...overrides,
    },
    payment: {
      form: "Безналичная с НДС",
      currency_code: "643",
      consignor: null,
      consignee: null,
    },
  };
}

describe("resolvePrimaryAction", () => {
  it("offers to place a bet when available, biddable, and no own bet yet", () => {
    expect(
      resolvePrimaryAction({
        status: "Auction",
        is_available: true,
        can_set_bet: true,
        has_my_bet: false,
      }),
    ).toEqual({ kind: "place-bid", label: "Сделать ставку" });
  });

  it("offers to edit the bid when the user already has one", () => {
    expect(
      resolvePrimaryAction({
        status: "Auction",
        is_available: true,
        can_set_bet: true,
        has_my_bet: true,
      }),
    ).toEqual({ kind: "edit-bid", label: "Изменить ставку" });
  });

  it("falls back to view-only when bidding is closed for this auction", () => {
    expect(
      resolvePrimaryAction({
        status: "Auction",
        is_available: true,
        can_set_bet: false,
        has_my_bet: false,
      }),
    ).toEqual({ kind: "view-bets", label: "Смотреть ставки" });
  });

  it("disables the action when the auction is unavailable", () => {
    expect(
      resolvePrimaryAction({
        status: "Auction",
        is_available: false,
        can_set_bet: true,
        has_my_bet: false,
      }).kind,
    ).toBe("disabled");
  });

  it("disables the action for a finished auction even if flags say otherwise", () => {
    const action = resolvePrimaryAction({
      status: "Finished",
      is_available: true,
      can_set_bet: true,
      has_my_bet: false,
    });
    expect(action).toEqual({ kind: "disabled", label: "Завершён" });
  });

  it("disables the action for a canceled auction", () => {
    expect(
      resolvePrimaryAction({
        status: "Canceled",
        is_available: true,
        can_set_bet: true,
        has_my_bet: false,
      }).kind,
    ).toBe("disabled");
  });
});

describe("toAuctionCardViewModel", () => {
  it("maps the nested API shape into flat display-ready fields", () => {
    const vm = toAuctionCardViewModel(buildItem());
    expect(vm.loadCityLabel).toBe("Москва");
    expect(vm.unloadCityLabel).toBe("Санкт-Петербург");
    expect(vm.cargoSummary).toBe("Стройматериалы, 12 т, 40 м³");
    expect(vm.currentPrice).toBe(45000);
    expect(vm.primaryAction.kind).toBe("place-bid");
  });

  it("omits volume from the cargo summary when it is zero/falsy", () => {
    const item = buildItem();
    item.cargo.volume = 0;
    const vm = toAuctionCardViewModel(item);
    expect(vm.cargoSummary).toBe("Стройматериалы, 12 т");
  });

  it("treats a null trading.price as an unknown current price rather than throwing", () => {
    const vm = toAuctionCardViewModel(buildItem({ price: null }));
    expect(vm.currentPrice).toBeNull();
  });

  it("reads has_my_bet from trading.your.bet, defaulting to false when your is null", () => {
    const vm = toAuctionCardViewModel(buildItem({ your: null }));
    expect(vm.hasMyBet).toBe(false);
  });
});
