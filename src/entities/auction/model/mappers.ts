import type {
  AuctionListItem,
  AuctionStatus,
  AuctionType,
  TradingStatus,
} from "./types";

export type PrimaryAction =
  | { kind: "place-bid"; label: "Сделать ставку" }
  | { kind: "edit-bid"; label: "Изменить ставку" }
  | { kind: "view-bets"; label: "Смотреть ставки" }
  | { kind: "disabled"; label: string };

export interface AuctionCardViewModel {
  auctionId: number;
  cargoNum: string;
  aucType: AuctionType;
  status: AuctionStatus;
  myTradingStatus: TradingStatus;
  loadCityLabel: string;
  unloadCityLabel: string;
  loadDate: string;
  unloadDate: string | null;
  cargoSummary: string;
  currentPrice: number | null;
  pricePerKm: number | null;
  hasMyBet: boolean;
  primaryAction: PrimaryAction;
}

export const AUC_TYPE_LABELS: Record<AuctionType, string> = {
  Request: "Заявка",
  Up: "На повышение",
  Down: "На понижение",
  FixPrice: "Фикс. цена",
  Unknown: "Неизвестный тип",
};

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  Planning: "Планирование",
  Auction: "Торги идут",
  DeterminateWinner: "Определение победителя",
  WaitDeal: "Ожидание сделки",
  InProgress: "В работе",
  Finished: "Завершён",
  Stopped: "Остановлен",
  Canceled: "Отменён",
  Unknown: "Неизвестный статус",
};

export const TRADING_STATUS_LABELS: Record<TradingStatus, string> = {
  NotParticipating: "Не участвую",
  Leading: "Лидирую",
  Losing: "Перебит",
  OnPending: "На рассмотрении",
  Confirmed: "Подтверждён",
  ChoosingWinner: "Выбор победителя",
  Winner: "Победитель",
  Accepted: "Принято",
  Unknown: "Неизвестный статус",
};

const CLOSED_AUCTION_STATUSES: AuctionStatus[] = [
  "Finished",
  "Stopped",
  "Canceled",
];

export function resolvePrimaryAction(item: {
  status: AuctionStatus;
  is_available: boolean;
  can_set_bet: boolean;
  has_my_bet: boolean;
}): PrimaryAction {
  if (CLOSED_AUCTION_STATUSES.includes(item.status)) {
    return { kind: "disabled", label: AUCTION_STATUS_LABELS[item.status] };
  }
  if (!item.is_available) {
    return { kind: "disabled", label: "Недоступно" };
  }
  if (!item.can_set_bet) {
    return { kind: "view-bets", label: "Смотреть ставки" };
  }
  return item.has_my_bet
    ? { kind: "edit-bid", label: "Изменить ставку" }
    : { kind: "place-bid", label: "Сделать ставку" };
}

export function toAuctionCardViewModel(
  item: AuctionListItem,
): AuctionCardViewModel {
  const hasMyBet = item.trading.your?.bet ?? false;

  return {
    auctionId: item.main.id,
    cargoNum: item.main.cargo_num,
    aucType: item.main.auc_type,
    status: item.trading.status,
    myTradingStatus: item.trading.status_mobile,
    loadCityLabel: item.route.load.city,
    unloadCityLabel: item.route.unload.city,
    loadDate: item.route.load.date,
    unloadDate: item.route.unload.date ?? null,
    cargoSummary: `${item.cargo.name}, ${item.cargo.weight} т${item.cargo.volume ? `, ${item.cargo.volume} м³` : ""}`,
    currentPrice: item.trading.price?.current ?? null,
    pricePerKm: item.main.price_per_km,
    hasMyBet,
    primaryAction: resolvePrimaryAction({
      status: item.trading.status,
      is_available: item.trading.is_available,
      can_set_bet: item.trading.can_set_bet,
      has_my_bet: hasMyBet,
    }),
  };
}
