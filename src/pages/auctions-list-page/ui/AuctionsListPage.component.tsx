import { useAuctionsFilters } from '../../../features/filter-auctions/model/use-auctions-filters';
import { AuctionsFilterPanel } from '../../../features/filter-auctions/ui/AuctionsFilterPanel.component';
import { useAuctionsListQuery } from '../api/use-auctions-list-query';
import { AuctionCard } from '../../../widgets/auction-card/ui/AuctionCard.component';
import { AuctionCardSkeleton } from '../../../shared/ui/Skeleton.component';
import { EmptyState } from '../../../shared/ui/EmptyState.component';
import { ErrorState } from '../../../shared/ui/ErrorState.component';
import { Pagination } from '../../../widgets/pagination/ui/Pagination.component';

export function AuctionsListPage() {
  const { search, setFilters, setPage, resetFilters } = useAuctionsFilters();
  const { data, isLoading, isError, refetch, isFetching } = useAuctionsListQuery(search);

  return (
    <div className="auctions-list-page">
      <aside className="auctions-list-page__filters">
        <AuctionsFilterPanel search={search} onApply={setFilters} onReset={resetFilters} />
      </aside>

      <section className="auctions-list-page__results">
        {isError && <ErrorState onRetry={() => refetch()} description="Проверьте соединение и попробуйте снова." />}

        {!isError && isLoading && (
          <div className="auction-cards-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isError && !isLoading && data && data.data.length === 0 && (
          <EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры" />
        )}

        {!isError && !isLoading && data && data.data.length > 0 && (
          <>
            <div className={`auction-cards-grid ${isFetching ? 'auction-cards-grid--updating' : ''}`}>
              {data.data.map((item) => (
                <AuctionCard key={item.main.id} auction={item} />
              ))}
            </div>
            <Pagination
              page={data.meta.current_page}
              pageSize={data.meta.per_page}
              total={data.meta.total}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
