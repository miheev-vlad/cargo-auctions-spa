import { Link, useSearch } from '@tanstack/react-router';
import type { AuctionListItem } from '../../../entities/auction/model/types';
import { AUC_TYPE_LABELS, AUCTION_STATUS_LABELS, TRADING_STATUS_LABELS, toAuctionCardViewModel } from '../../../entities/auction/model/mappers';
import { Badge } from '../../../shared/ui/Badge.component';
import { Button } from '../../../shared/ui/Button.component';
import { formatDate, formatMoney } from '../../../shared/lib/format/format';
import { usePrefetchAuctionDetail } from '../../../features/prefetch-auction-detail/model/use-prefetch-auction';


interface AuctionCardProps {
  auction: AuctionListItem;
}

const STATUS_TONE: Record<AuctionListItem['trading']['status'], 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  Planning: 'neutral',
  Auction: 'success',
  DeterminateWinner: 'info',
  WaitDeal: 'info',
  InProgress: 'info',
  Finished: 'neutral',
  Stopped: 'danger',
  Canceled: 'danger',
  Unknown: 'neutral',
};

export function AuctionCard({ auction }: AuctionCardProps) {
  const vm = toAuctionCardViewModel(auction);
  const prefetch = usePrefetchAuctionDetail();
  const search = useSearch({ from: '/auctions' });
  const goesToBid = vm.primaryAction.kind === 'place-bid' || vm.primaryAction.kind === 'edit-bid';

  return (
    <article
      className="auction-card"
      onMouseEnter={() => prefetch(vm.auctionId)}
      onFocus={() => prefetch(vm.auctionId)}
    >
      <header className="auction-card__header">
        <span className="auction-card__cargo-num">{vm.cargoNum}</span>
        <Badge tone={STATUS_TONE[vm.status]}>{AUCTION_STATUS_LABELS[vm.status]}</Badge>
        <Badge tone="neutral">{AUC_TYPE_LABELS[vm.aucType]}</Badge>
        {vm.myTradingStatus !== 'NotParticipating' && (
          <Badge tone={vm.myTradingStatus === 'Winner' || vm.myTradingStatus === 'Leading' ? 'success' : 'warning'}>
            {TRADING_STATUS_LABELS[vm.myTradingStatus]}
          </Badge>
        )}
      </header>

      <p className="auction-card__route">
        {vm.loadCityLabel} → {vm.unloadCityLabel}
      </p>
      <p className="auction-card__dates">
        {formatDate(vm.loadDate)}
        {vm.unloadDate && <> — {formatDate(vm.unloadDate)}</>}
      </p>
      <p className="auction-card__cargo">{vm.cargoSummary}</p>

      <footer className="auction-card__footer">
        <div className="auction-card__price">
          {vm.currentPrice != null ? <strong>{formatMoney(vm.currentPrice)}</strong> : <span>Цена скрыта</span>}
          {vm.pricePerKm != null && <span className="auction-card__price-per-km"> · {formatMoney(vm.pricePerKm)}/км</span>}
        </div>
        {vm.hasMyBet && <Badge tone="info">Моя ставка есть</Badge>}

        {vm.primaryAction.kind === 'disabled' ? (
          <Button variant="secondary" disabled>
            {vm.primaryAction.label}
          </Button>
        ) : goesToBid ? (
          <Link
            to="/auctions/$auctionId/bid"
            params={{ auctionId: String(vm.auctionId) }}
            search={search}
            className="btn btn--primary"
          >
            {vm.primaryAction.label}
          </Link>
        ) : (
          <Link
            to="/auctions/$auctionId"
            params={{ auctionId: String(vm.auctionId) }}
            search={search}
            className="btn btn--primary"
          >
            {vm.primaryAction.label}
          </Link>
        )}
      </footer>
    </article>
  );
}
