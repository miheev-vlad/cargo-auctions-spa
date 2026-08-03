import {
  CITIES_DICTIONARY,
  type CityDictItem,
} from "../entities/city/model/cities-dictionary";
import type {
  AuctionListItem,
  AuctionListRequest,
  AuctionShowResponse,
  AuctionStatus,
  AuctionType,
  TradingStatus,
} from "../entities/auction/model/types";
import type { BetItem } from "../entities/bet/model/types";

const OWN_ORG_NAME = "ООО «Мой Транспорт»";
const OWN_ORG_INN = "9600000001";
const OWN_SUBSCRIBER_ID = 999;

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(min + rand() * (max - min + 1));

const AUCTION_STATUS_BY_CODE: Record<number, AuctionStatus> = {
  1: "Planning",
  2: "Auction",
  3: "DeterminateWinner",
  4: "WaitDeal",
  5: "InProgress",
  6: "Finished",
  7: "Stopped",
  8: "Canceled",
};
const AUCTION_STATUSES = Object.values(AUCTION_STATUS_BY_CODE);
const AUC_TYPES: AuctionType[] = ["Request", "Up", "Down", "FixPrice"];
const BODY_TYPES = [
  "тентованный",
  "изотермический",
  "рефрижератор",
  "бортовой",
  "контейнер",
];
const CARGO_NAMES = [
  "Стройматериалы",
  "Металлопрокат",
  "Продукты питания",
  "Оборудование",
  "Мебель",
  "Бытовая химия",
  "Электроника",
];
const CARRIER_ORGS = [
  { name: "ООО «ТрансЛогистик»", inn: "7701111111" },
  { name: "ИП Смирнов А.В.", inn: "590222222233" },
  { name: "ООО «СеверТранс»", inn: "7803333333" },
  { name: "ООО «АвтоЛайн»", inn: "6604444444" },
  { name: "ИП Ковалёв Д.С.", inn: "540555555566" },
];

const toNoVat = (withVat: number) => Math.round((withVat / 1.2) * 100) / 100;

interface AuctionRecord {
  id: number;
  order_uid: string;
  cargo_num: string;
  cargo_date: string;
  auc_type: AuctionType;
  created_at: string;
  status: AuctionStatus;
  statusMobile: TradingStatus;
  loadCity: CityDictItem;
  unloadCity: CityDictItem;
  loadDate: string;
  unloadDate: string;
  cargoName: string;
  weight: number;
  volume: number;
  bodyType: string;
  organizerName: string;
  organizerInn: string;
  hideOrganization: boolean;
  contacts: { name: string; phone: string; email: string } | null;
  hidePointsAddressAndContacts: boolean;
  paymentForm: string;
  currentPriceWithVat: number;
  minPriceWithVat: number | null;
  maxPriceWithVat: number | null;
  stepWithVat: number;
  pricePerKm: number;
  canSetBet: boolean;
  isAvailable: boolean;
  hideBetsHistory: boolean;
  noViewCargoPrice: boolean;
  ownBet: { hasBet: boolean; priceWithVat: number | null; win: boolean };
  bets: BetItem[];
}

function buildAuction(index: number): AuctionRecord {
  const id = index;
  const status = pick(AUCTION_STATUSES);
  const aucType = pick(AUC_TYPES);
  const loadCity = pick(CITIES_DICTIONARY);
  const unloadCity = pick(
    CITIES_DICTIONARY.filter((c) => c.name !== loadCity.name),
  );
  const loadDate = new Date(Date.now() + randInt(-5, 20) * 86_400_000);
  const unloadDate = new Date(loadDate.getTime() + randInt(1, 5) * 86_400_000);
  const basePrice = randInt(20, 150) * 1000;
  const step = pick([500, 1000, 2000]);
  const isAvailable = status === "Auction" || status === "DeterminateWinner";
  const canSetBet = isAvailable && rand() > 0.15;
  const hasMyBet = canSetBet && rand() > 0.6;
  const statusMobile: TradingStatus = !isAvailable
    ? "NotParticipating"
    : hasMyBet
      ? pick(["Leading", "Losing", "Winner"])
      : "NotParticipating";
  const hideContacts = rand() < 0.2;

  const bets = buildBets(id, basePrice, step, hasMyBet, statusMobile);

  return {
    id,
    order_uid: `00000000-0000-0000-0000-${String(id).padStart(12, "0")}`,
    cargo_num: String(1000000000 + id).padStart(11, "0"),
    cargo_date: loadDate.toISOString(),
    auc_type: aucType,
    created_at: new Date(
      Date.now() - randInt(1, 10) * 86_400_000,
    ).toISOString(),
    status,
    statusMobile,
    loadCity,
    unloadCity,
    loadDate: loadDate.toISOString(),
    unloadDate: unloadDate.toISOString(),
    cargoName: pick(CARGO_NAMES),
    weight: randInt(3, 20),
    volume: rand() > 0.3 ? randInt(10, 90) : 0,
    bodyType: pick(BODY_TYPES),
    organizerName: pick([
      "ООО «ГрузЭксперт»",
      "АО «ЛогистикПро»",
      "ООО «КаргоМастер»",
    ]),
    organizerInn: String(randInt(7700000000, 7799999999)),
    hideOrganization: rand() < 0.1,
    contacts: hideContacts
      ? null
      : {
          name: "Иванов Иван Иванович",
          phone: "+7 (900) 123-45-67",
          email: "logist@example.com",
        },
    hidePointsAddressAndContacts: hideContacts,
    paymentForm: pick(["Безналичная с НДС", "Безналичная без НДС"]),
    currentPriceWithVat: basePrice,
    minPriceWithVat: aucType === "Down" ? Math.round(basePrice * 0.6) : null,
    maxPriceWithVat: aucType === "Up" ? Math.round(basePrice * 1.6) : null,
    stepWithVat: step,
    pricePerKm: Math.round(basePrice / randInt(300, 1500)),
    canSetBet,
    isAvailable,
    hideBetsHistory: rand() < 0.15,
    noViewCargoPrice: rand() < 0.1,
    ownBet: {
      hasBet: hasMyBet,
      priceWithVat: hasMyBet
        ? (bets.find((b) => b.organization_inn === OWN_ORG_INN)
            ?.price_with_vat ?? null)
        : null,
      win: statusMobile === "Winner",
    },
    bets,
  };
}

function buildBets(
  auctionId: number,
  basePrice: number,
  step: number,
  hasOwnBet: boolean,
  ownStatus: TradingStatus,
): BetItem[] {
  const count = randInt(0, 6);
  const bets: BetItem[] = [];
  let price = basePrice;

  for (let i = 0; i < count; i += 1) {
    price += step * randInt(1, 3);
    const org = pick(CARRIER_ORGS);
    bets.push({
      id: auctionId * 1000 + i,
      created_at: new Date(
        Date.now() - randInt(1, 60) * 3_600_000,
      ).toISOString(),
      auction_id: auctionId,
      subscriber_id: randInt(1, 500),
      contact_name: "Петров Пётр",
      contact_phone: "+79001112233",
      price_with_vat: Math.round(price),
      price_no_vat: toNoVat(price),
      organization_id: randInt(1, 999),
      organization_inn: org.inn,
      organization_name: org.name,
      transporter_comment: null,
      is_rejected: rand() < 0.1,
      is_counter: false,
      place: null,
      is_win: false,
      run_number: 0,
      cancel_reason: "",
      price_info: {
        price_with_vat: Math.round(price),
        price_no_vat: toNoVat(price),
        payment_type: "Безналичная с НДС",
        vat_rate: "20",
      },
    });
  }

  if (hasOwnBet) {
    bets.push({
      id: auctionId * 1000 + 999,
      created_at: new Date(
        Date.now() - randInt(1, 30) * 3_600_000,
      ).toISOString(),
      auction_id: auctionId,
      subscriber_id: OWN_SUBSCRIBER_ID,
      contact_name: "Моя Организация",
      contact_phone: "+79990001122",
      price_with_vat: Math.round(basePrice),
      price_no_vat: toNoVat(basePrice),
      organization_id: 1,
      organization_inn: OWN_ORG_INN,
      organization_name: OWN_ORG_NAME,
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: null,
      is_win: ownStatus === "Winner",
      run_number: 0,
      cancel_reason: "",
      price_info: {
        price_with_vat: Math.round(basePrice),
        price_no_vat: toNoVat(basePrice),
        payment_type: "Безналичная с НДС",
        vat_rate: "20",
      },
    });
  }

  return rankBets(bets);
}

function rankBets(bets: BetItem[]): BetItem[] {
  const active = bets
    .filter((b) => !b.is_rejected)
    .sort((a, b) => a.price_with_vat - b.price_with_vat);
  const rejected = bets.filter((b) => b.is_rejected);
  active.forEach((b, idx) => {
    b.place = idx + 1;
    b.is_win = idx === 0;
  });
  rejected.forEach((b) => {
    b.place = null;
    b.cancel_reason = b.cancel_reason || "Ставка отклонена организатором";
  });
  return [...active, ...rejected];
}

const AUCTIONS_COUNT = 47;
export const auctionsStore = new Map<number, AuctionRecord>(
  Array.from({ length: AUCTIONS_COUNT }, (_, i) => buildAuction(i + 1)).map(
    (record) => [record.id, record],
  ),
);

export function toListItem(record: AuctionRecord): AuctionListItem {
  return {
    main: {
      id: record.id,
      cargo_num: record.cargo_num,
      cargo_date: record.cargo_date,
      auc_type: record.auc_type,
      order_uid: record.order_uid,
      created_at: record.created_at,
      priority_sort: 0,
      is_assembly: false,
      price_per_km: record.pricePerKm,
    },
    organizer: {
      subscriber_id: 1,
      organization_id: 1,
      organization_name: record.organizerName,
      organization_inn: record.organizerInn,
      organization_kpp: "000000001",
      is_hide_organization: record.hideOrganization,
    },
    route: {
      load: {
        city: record.loadCity.name,
        address: record.hidePointsAddressAndContacts
          ? ""
          : `ул. Промышленная, ${record.id}`,
        date: record.loadDate,
        city_gc_id: record.loadCity.gc_id,
        points_count: 1,
      },
      unload: {
        city: record.unloadCity.name,
        address: record.hidePointsAddressAndContacts
          ? ""
          : `ул. Складская, ${record.id}`,
        date: record.unloadDate,
        city_gc_id: record.unloadCity.gc_id,
        points_count: 1,
      },
    },
    cargo: {
      name: record.cargoName,
      weight: record.weight,
      volume: record.volume,
      body_type: record.bodyType,
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
      loading_types: { side: false, top: false, rear: false, full: true },
      docs: { tir: false, cmr: true, t1: false, med: false },
      car: null,
    },
    trading: {
      status: record.status,
      status_mobile:
        record.statusMobile as AuctionListItem["trading"]["status_mobile"],
      start_time: record.loadDate,
      stop_time: record.unloadDate,
      bid_measurement_type: "PerRoute",
      can_set_bet: record.canSetBet,
      allow_counter_bets: true,
      hide_points_address_and_contacts: record.hidePointsAddressAndContacts,
      direction: null,
      comment: null,
      is_bidder: record.ownBet.hasBet,
      is_available: record.isAvailable,
      is_accredited: true,
      is_favorite: false,
      price: {
        start: record.currentPriceWithVat,
        current: record.currentPriceWithVat,
        current_no_vat: toNoVat(record.currentPriceWithVat),
      },
      your: { bet: record.ownBet.hasBet, last_bet: record.ownBet.priceWithVat },
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: null,
    },
    payment: {
      form: record.paymentForm,
      currency_code: "643",
      consignor: null,
      consignee: null,
    },
  };
}

export function listAuctions(request: AuctionListRequest) {
  let items = Array.from(auctionsStore.values());

  if (request.cargo_num) {
    const needle = request.cargo_num.toLowerCase();
    items = items.filter((r) => r.cargo_num.toLowerCase().includes(needle));
  }
  if (request.status && request.status.length > 0) {
    items = items.filter((r) => request.status!.includes(r.statusMobile));
  }
  if (request.statuses && request.statuses.length > 0) {
    const wanted = request.statuses
      .map((code) => AUCTION_STATUS_BY_CODE[code])
      .filter(Boolean);
    items = items.filter((r) => wanted.includes(r.status));
  }
  if (request.auc_type && request.auc_type.length > 0) {
    items = items.filter((r) => request.auc_type!.includes(r.auc_type));
  }
  if (request.load_city) {
    items = items.filter((r) => r.loadCity.name === request.load_city);
  }
  if (request.unload_city) {
    items = items.filter((r) => r.unloadCity.name === request.unload_city);
  }
  if (request.load_date_from) {
    items = items.filter((r) => r.loadDate >= request.load_date_from!);
  }
  if (request.load_date_to) {
    items = items.filter((r) => r.loadDate <= request.load_date_to!);
  }
  if (request.is_available !== undefined && request.is_available !== null) {
    items = items.filter((r) => r.isAvailable === request.is_available);
  }
  if (request.is_bidder !== undefined && request.is_bidder !== null) {
    items = items.filter((r) => r.ownBet.hasBet === request.is_bidder);
  }
  if (request.current_price_from != null) {
    items = items.filter(
      (r) => r.currentPriceWithVat >= request.current_price_from!,
    );
  }
  if (request.current_price_to != null) {
    items = items.filter(
      (r) => r.currentPriceWithVat <= request.current_price_to!,
    );
  }

  items.sort((a, b) => a.loadDate.localeCompare(b.loadDate));

  const total = items.length;
  const page = request.page ?? 1;
  const perPage = request.per_page ?? 20;
  const start = (page - 1) * perPage;
  const pageItems = items.slice(start, start + perPage).map(toListItem);
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: pageItems,
    meta: {
      current_page: page,
      from: total === 0 ? 0 : start + 1,
      last_page: lastPage,
      per_page: perPage,
      to: Math.min(start + perPage, total),
      total,
    },
  };
}

export function getAuctionDetail(
  auctionId: number,
): AuctionShowResponse | undefined {
  const record = auctionsStore.get(auctionId);
  if (!record) return undefined;

  return {
    main: {
      id: record.id,
      cargo_num: record.cargo_num,
      cargo_date: record.cargo_date,
      order_uid: record.order_uid,
      auc_type: record.auc_type,
      created_at: record.created_at,
    },
    organizer: {
      subscriber_id: 1,
      subscriber_code: "00001",
      infobase_code: "RU_Cargo_01",
      organization_name: record.organizerName,
      organization_inn: record.organizerInn,
      organization_kpp: "000000001",
      organization_id: 1,
    },
    contacts:
      record.hidePointsAddressAndContacts || !record.contacts
        ? []
        : [{ ...record.contacts, work_phone: null, uid: null }],
    cargo: {
      price: "0",
      currency: 643,
      is_international: false,
      distance: randDistance(record.id),
      truck_count: 1,
      body_type: record.bodyType,
      temp_from: null,
      temp_to: null,
      conics: null,
      belts: null,
      adr: null,
      coupling: null,
      air_pass: null,
      low_loader: null,
      additional_load: null,
      containered: false,
      container_type: null,
      container_size: null,
      loading_types: { side: false, top: false, rear: false, full: true },
      docs: { tir: false, cmr: true, t1: false, med: false },
      car: null,
    },
    trading: {
      status: record.status,
      status_mobile: record.statusMobile,
      start_time: record.loadDate,
      stop_time: record.unloadDate,
      bid_measurement_type: "PerRoute",
      can_set_bet: record.canSetBet,
      allow_counter_bets: true,
      hide_bets_history: record.hideBetsHistory,
      hide_places: false,
      no_view_cargo_price: record.noViewCargoPrice,
      hide_points_address_and_contacts: record.hidePointsAddressAndContacts,
      is_bidder: record.ownBet.hasBet,
      is_favorite: false,
      is_last_bet_with_vat: null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start: record.currentPriceWithVat,
        start_no_vat: toNoVat(record.currentPriceWithVat),
        current: record.currentPriceWithVat,
        current_no_vat: toNoVat(record.currentPriceWithVat),
        available: record.isAvailable
          ? record.currentPriceWithVat + record.stepWithVat
          : null,
        available_no_vat: record.isAvailable
          ? toNoVat(record.currentPriceWithVat + record.stepWithVat)
          : null,
        min: record.minPriceWithVat,
        min_no_vat:
          record.minPriceWithVat != null
            ? toNoVat(record.minPriceWithVat)
            : null,
        max: record.maxPriceWithVat,
        max_no_vat:
          record.maxPriceWithVat != null
            ? toNoVat(record.maxPriceWithVat)
            : null,
        step: record.stepWithVat,
        step_no_vat: toNoVat(record.stepWithVat),
        price_per_km: record.pricePerKm,
      },
      your: {
        bet: record.ownBet.hasBet,
        last_bet:
          record.ownBet.priceWithVat != null
            ? toNoVat(record.ownBet.priceWithVat)
            : null,
        last_bet_with_vat: record.ownBet.priceWithVat,
        win: record.ownBet.win,
      },
      settings: {
        prolong_after_bet: 10,
        winner_confirm: 1,
        winner_counter_mode: null,
        transmission_time_in: 24,
        coefficient: 10,
      },
    },
    payment: {
      condition: "По оригиналам накладных (ТН, ТТН, CMR)",
      condition_predefined: "ПоОригиналамНакладных",
      form: record.paymentForm,
      delay: 14,
      delay_type: "CalendarDays",
      currency_code: "643",
      prepay: "0",
    },
    assembly: { num: null, date: null },
    routes: [
      {
        row_num: 1,
        op_type: "Loading",
        start_date: record.loadDate,
        end_date: record.loadDate,
        comment: null,
        contractor: "",
        contractor_inn: "",
        location: {
          city_name: record.loadCity.name,
          city_full_name: `${record.loadCity.name}, Россия`,
          city_gc_id: record.loadCity.gc_id,
          loading_address: record.hidePointsAddressAndContacts
            ? ""
            : `ул. Промышленная, ${record.id}`,
          lon: 0,
          lat: 0,
        },
        cargo: {
          name: record.cargoName,
          package_name: "",
          weight: record.weight.toFixed(3),
          volume: record.volume.toFixed(3),
          length: "0",
          width: "0",
          height: "0",
          oversized: false,
          package_amount: null,
        },
        contact: record.hidePointsAddressAndContacts
          ? { name: "", phone: "" }
          : {
              name: record.contacts?.name ?? "",
              phone: record.contacts?.phone ?? "",
            },
      },
      {
        row_num: 2,
        op_type: "Unloading",
        start_date: record.unloadDate,
        end_date: record.unloadDate,
        comment: null,
        contractor: "",
        contractor_inn: "",
        location: {
          city_name: record.unloadCity.name,
          city_full_name: `${record.unloadCity.name}, Россия`,
          city_gc_id: record.unloadCity.gc_id,
          loading_address: record.hidePointsAddressAndContacts
            ? ""
            : `ул. Складская, ${record.id}`,
          lon: 0,
          lat: 0,
        },
        cargo: {
          name: record.cargoName,
          package_name: "",
          weight: record.weight.toFixed(3),
          volume: record.volume.toFixed(3),
          length: "0",
          width: "0",
          height: "0",
          oversized: false,
          package_amount: null,
        },
        contact: record.hidePointsAddressAndContacts
          ? { name: "", phone: "" }
          : {
              name: record.contacts?.name ?? "",
              phone: record.contacts?.phone ?? "",
            },
      },
    ],
    admitted_organizations: [],
    hide_bets_history: record.hideBetsHistory,
  };
}

function randDistance(seed: number) {
  return 300 + ((seed * 37) % 2000);
}

export function getAuctionBets(auctionId: number, includeAll: boolean) {
  const record = auctionsStore.get(auctionId);
  if (!record) return undefined;
  if (record.hideBetsHistory) {
    return { bets: [] };
  }
  return {
    bets: includeAll ? record.bets : record.bets.filter((b) => !b.is_rejected),
  };
}

export type PlaceBetResult =
  | { ok: true; bet: BetItem }
  | { ok: false; errors: { field: string; message: string; code?: string }[] };

export function placeBet(
  auctionId: number,
  price: number,
): PlaceBetResult | undefined {
  const record = auctionsStore.get(auctionId);
  if (!record) return undefined;

  const errors: { field: string; message: string; code?: string }[] = [];
  if (!record.canSetBet) {
    errors.push({
      field: "price",
      message: "Ставки по этому аукциону закрыты",
      code: "bidding_closed",
    });
  }
  if (!(price > 0)) {
    errors.push({
      field: "price",
      message: "Цена должна быть больше 0",
      code: "min_value",
    });
  }
  if (record.minPriceWithVat != null && price < record.minPriceWithVat) {
    errors.push({
      field: "price",
      message: `Цена не может быть меньше ${record.minPriceWithVat}`,
      code: "min_value",
    });
  }
  if (record.maxPriceWithVat != null && price > record.maxPriceWithVat) {
    errors.push({
      field: "price",
      message: `Цена не может быть больше ${record.maxPriceWithVat}`,
      code: "max_value",
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const nowIso = new Date().toISOString();
  const existingOwnIdx = record.bets.findIndex(
    (b) => b.organization_inn === OWN_ORG_INN,
  );
  const ownBet: BetItem = {
    id:
      existingOwnIdx >= 0
        ? record.bets[existingOwnIdx].id
        : record.id * 1000 + 999,
    created_at: nowIso,
    auction_id: record.id,
    subscriber_id: OWN_SUBSCRIBER_ID,
    contact_name: "Моя Организация",
    contact_phone: "+79990001122",
    price_with_vat: Math.round(price),
    price_no_vat: toNoVat(price),
    organization_id: 1,
    organization_inn: OWN_ORG_INN,
    organization_name: OWN_ORG_NAME,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: "",
    price_info: {
      price_with_vat: Math.round(price),
      price_no_vat: toNoVat(price),
      payment_type: "Безналичная с НДС",
      vat_rate: "20",
    },
  };

  if (existingOwnIdx >= 0) {
    record.bets[existingOwnIdx] = ownBet;
  } else {
    record.bets.push(ownBet);
  }

  record.bets = rankBets(record.bets);
  const finalOwnBet = record.bets.find(
    (b) => b.organization_inn === OWN_ORG_INN,
  )!;

  record.currentPriceWithVat = Math.max(record.currentPriceWithVat, price);
  record.statusMobile = finalOwnBet.is_win
    ? "Winner"
    : finalOwnBet.place === 1
      ? "Leading"
      : "Losing";
  record.ownBet = {
    hasBet: true,
    priceWithVat: price,
    win: finalOwnBet.is_win,
  };

  return { ok: true, bet: finalOwnBet };
}
