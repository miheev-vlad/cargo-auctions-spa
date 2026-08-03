import type { AuctionShowResponse } from '../../../entities/auction/model/types';
import { AUC_TYPE_LABELS, AUCTION_STATUS_LABELS, TRADING_STATUS_LABELS } from '../../../entities/auction/model/mappers';
import { Badge } from '../../../shared/ui/Badge.component';
import { formatDateTime, formatMoney } from '../../../shared/lib/format/format';

interface AuctionDetailInfoProps {
  detail: AuctionShowResponse;
}

export function AuctionDetailInfo({ detail }: AuctionDetailInfoProps) {
  const { organizer, contacts, cargo, payment, trading, routes } = detail;
  const hideContacts = trading.hide_points_address_and_contacts;
  const contact = contacts[0];

  return (
    <div className="auction-detail-info">
      <section className="detail-section">
        <h2>Аукцион {detail.main.cargo_num}</h2>
        <div className="detail-badges">
          <Badge tone="neutral">{AUC_TYPE_LABELS[detail.main.auc_type]}</Badge>
          <Badge tone="neutral">{AUCTION_STATUS_LABELS[trading.status]}</Badge>
          {trading.status_mobile !== 'NotParticipating' && (
            <Badge tone={trading.status_mobile === 'Winner' || trading.status_mobile === 'Leading' ? 'success' : 'warning'}>
              {TRADING_STATUS_LABELS[trading.status_mobile]}
            </Badge>
          )}
        </div>
      </section>

      <section className="detail-section">
        <h3>Организатор</h3>
        <p>
          {organizer.organization_name} · ИНН {organizer.organization_inn}
        </p>
        {hideContacts || !contact ? (
          <p className="detail-muted">Контакты скрыты организатором</p>
        ) : (
          <p>
            {contact.name && `${contact.name}, `}
            {contact.phone}
            {contact.email && `, ${contact.email}`}
          </p>
        )}
      </section>

      <section className="detail-section">
        <h3>Маршрут</h3>
        <ol className="route-list">
          {routes.map((point) => (
            <li key={point.row_num}>
              <strong>{point.op_type === 'Loading' ? 'Погрузка' : 'Выгрузка'}:</strong> {point.location.city_name}
              {point.location.loading_address && !hideContacts && `, ${point.location.loading_address}`}
              {' — '}
              {formatDateTime(point.start_date)}
            </li>
          ))}
        </ol>
      </section>

      <section className="detail-section">
        <h3>Груз и требования к ТС</h3>
        <p>
          {routes[0]?.cargo.name ?? '—'} · {cargo.truck_count} ТС · {cargo.body_type}
          {cargo.distance != null && ` · ${cargo.distance} км`}
        </p>
        {cargo.car && (
          <p className="detail-muted">
            Требования к ТС: {cargo.car.type}
            {cargo.car.weight != null && `, до ${cargo.car.weight} т`}
          </p>
        )}
      </section>

      <section className="detail-section">
        <h3>Условия оплаты</h3>
        <p>
          {payment.form}
          {payment.delay ? ` · отсрочка ${payment.delay} дн.` : ''}
        </p>
        {payment.condition && <p className="detail-muted">{payment.condition}</p>}
      </section>

      <section className="detail-section">
        <h3>Параметры торгов</h3>
        {trading.no_view_cargo_price ? (
          <p className="detail-muted">Цена груза скрыта организатором</p>
        ) : (
          <p>
            Текущая цена: <strong>{formatMoney(trading.price.current)}</strong>
            {trading.price.available != null && <> · доступная: {formatMoney(trading.price.available)}</>}
          </p>
        )}
        <p className="detail-muted">
          {trading.price.step != null && `Шаг: ${formatMoney(trading.price.step)}`}
          {trading.price.min != null && ` · мин: ${formatMoney(trading.price.min)}`}
          {trading.price.max != null && ` · макс: ${formatMoney(trading.price.max)}`}
        </p>
        {trading.your.bet && (
          <p>
            Ваша ставка: <strong>{formatMoney(trading.your.last_bet_with_vat)}</strong>
          </p>
        )}
      </section>
    </div>
  );
}
