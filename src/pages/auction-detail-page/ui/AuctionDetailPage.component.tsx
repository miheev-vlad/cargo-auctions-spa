import { Link, useParams, useSearch } from '@tanstack/react-router';
import { useAuctionDetailQuery } from '../api/use-auction-detail-query';
import { useAuctionBetsQuery } from '../api/use-auction-bets-query';
import { AuctionDetailInfo } from '../../../widgets/auction-detail-info/ui/AuctionDetailInfo.component';
import { BetsList } from '../../../widgets/bets-list/ui/BetsList.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { ErrorState } from '../../../shared/ui/ErrorState.component';
import { Button } from '../../../shared/ui/Button.component';


export function AuctionDetailPage() {
  const { auctionId } = useParams({ from: '/auctions/$auctionId' });
  const search = useSearch({ from: '/auctions/$auctionId' });
  const id = Number(auctionId);
  const detailQuery = useAuctionDetailQuery(id);
  const betsQuery = useAuctionBetsQuery(id);

  if (detailQuery.isError) {
    return <ErrorState onRetry={() => detailQuery.refetch()} description="Не удалось загрузить аукцион" />;
  }

  if (detailQuery.isLoading || !detailQuery.data) {
    return (
      <div className="auction-detail-page">
        <Skeleton height={32} width="50%" />
        <Skeleton height={200} />
        <Skeleton height={200} />
      </div>
    );
  }

  const detail = detailQuery.data;

  return (
    <div className="auction-detail-page">
      <AuctionDetailInfo detail={detail} />

      {detail.trading.can_set_bet && (
        <Link to="/auctions/$auctionId/bid" params={{ auctionId }} search={search} className="btn btn--primary">
          {detail.trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
        </Link>
      )}

      <section className="detail-section">
        <h3>Ставки</h3>
        {betsQuery.isLoading && <Skeleton height={120} />}
        {betsQuery.isError && <ErrorState onRetry={() => betsQuery.refetch()} description="Не удалось загрузить ставки" />}
        {betsQuery.data && <BetsList bets={betsQuery.data.bets} hidden={detail.trading.hide_bets_history} />}
      </section>

      <Button variant="ghost" onClick={() => history.back()}>
        ← Назад к списку
      </Button>
    </div>
  );
}
