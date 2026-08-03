import { useNavigate, useParams, useSearch, Link } from '@tanstack/react-router';
import { useAuctionDetailQuery } from '../../auction-detail-page/api/use-auction-detail-query';
import { PlaceBidForm } from '../../../features/place-bid/ui/PlaceBidForm.component';
import { Skeleton } from '../../../shared/ui/Skeleton.component';
import { ErrorState } from '../../../shared/ui/ErrorState.component';


export function AuctionBidPage() {
  const { auctionId } = useParams({ from: '/auctions/$auctionId/bid' });
  const search = useSearch({ from: '/auctions/$auctionId/bid' });
  const id = Number(auctionId);
  const navigate = useNavigate();
  const detailQuery = useAuctionDetailQuery(id);

  if (detailQuery.isError) {
    return <ErrorState onRetry={() => detailQuery.refetch()} description="Не удалось загрузить аукцион" />;
  }

  if (detailQuery.isLoading || !detailQuery.data) {
    return (
      <div className="auction-bid-page">
        <Skeleton height={32} width="50%" />
        <Skeleton height={140} />
      </div>
    );
  }

  const detail = detailQuery.data;

  return (
    <div className="auction-bid-page">
      <Link to="/auctions/$auctionId" params={{ auctionId }} search={search} className="back-link">
        ← Карточка аукциона {detail.main.cargo_num}
      </Link>
      <h2>{detail.trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}</h2>
      <PlaceBidForm
        auction={detail}
        onSuccess={() => navigate({ to: '/auctions/$auctionId', params: { auctionId }, search })}
      />
    </div>
  );
}
