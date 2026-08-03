import type { BetItem } from '../../../entities/bet/model/types';
import { Badge } from '../../../shared/ui/Badge.component';
import { EmptyState } from '../../../shared/ui/EmptyState.component';
import { formatDateTime, formatMoney } from '../../../shared/lib/format/format';

interface BetsListProps {
  bets: BetItem[];
  hidden: boolean;
}

export function BetsList({ bets, hidden }: BetsListProps) {
  if (hidden) {
    return <EmptyState title="История ставок скрыта организатором" />;
  }

  if (bets.length === 0) {
    return <EmptyState title="Ставок пока нет" description="Будьте первым, кто сделает ставку" />;
  }

  const isOwn = (bet: BetItem) => bet.subscriber_id === 999;
  const activeCount = bets.filter((b) => !b.is_rejected).length;

  return (
    <div className="bets-list">
      <p className="bets-list__summary">Участников: {activeCount}</p>
      <table className="bets-table">
        <thead>
          <tr>
            <th>Место</th>
            <th>Перевозчик</th>
            <th>Цена с НДС</th>
            <th>Цена без НДС</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <tr key={bet.id} className={isOwn(bet) ? 'bets-table__row--own' : ''}>
              <td>{bet.is_rejected ? '—' : bet.place ?? '—'}</td>
              <td>
                {bet.organization_name}
                {isOwn(bet) && <Badge tone="info">Вы</Badge>}
              </td>
              <td>{formatMoney(bet.price_with_vat)}</td>
              <td>{formatMoney(bet.price_no_vat)}</td>
              <td>
                {bet.is_rejected ? (
                  <Badge tone="danger">Отменена{bet.cancel_reason ? `: ${bet.cancel_reason}` : ''}</Badge>
                ) : bet.is_win ? (
                  <Badge tone="success">Победитель</Badge>
                ) : (
                  <span className="bets-table__timestamp">{formatDateTime(bet.created_at)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
