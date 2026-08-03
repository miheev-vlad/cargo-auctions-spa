import { useState, type FormEvent } from "react";
import { CITIES_DICTIONARY } from "../../../entities/city/model/cities-dictionary";
import { AUCTION_STATUS_LABELS } from "../../../entities/auction/model/mappers";
import { Input } from "../../../shared/ui/Input.component";
import { Select } from "../../../shared/ui/Select.component";
import { Button } from "../../../shared/ui/Button.component";
import { AUCTION_STATUS_CODES } from "../../../shared/lib/search-params/auctions-search-schema";
import type { AuctionsSearch } from "../../../shared/lib/search-params/auctions-search-schema";
import type { AuctionStatus } from "../../../entities/auction/model/types";

interface AuctionsFilterPanelProps {
  search: AuctionsSearch;
  onApply: (patch: Partial<AuctionsSearch>) => void;
  onReset: () => void;
}

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

const TRADING_STATUS_OPTIONS: {
  value: AuctionsSearch["status"];
  label: string;
}[] = [
  { value: "Leading", label: "Лидирую" },
  { value: "Losing", label: "Перебит" },
  { value: "Winner", label: "Победитель" },
  { value: "NotParticipating", label: "Не участвую" },
];

const AUC_TYPE_OPTIONS: { value: AuctionsSearch["auc_type"]; label: string }[] =
  [
    { value: "Request", label: "Заявка" },
    { value: "Up", label: "На повышение" },
    { value: "Down", label: "На понижение" },
    { value: "FixPrice", label: "Фикс. цена" },
  ];

export function AuctionsFilterPanel({
  search,
  onApply,
  onReset,
}: AuctionsFilterPanelProps) {
  const [draft, setDraft] = useState(search);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onApply(draft);
  };

  const reset = () => {
    setDraft({ page: 1, per_page: search.per_page });
    onReset();
  };

  return (
    <form className="filter-panel" onSubmit={submit}>
      <Input
        label="Номер заявки"
        value={draft.cargo_num ?? ""}
        onChange={(e) =>
          setDraft((d) => ({ ...d, cargo_num: e.target.value || undefined }))
        }
        placeholder="1000000001"
      />

      <Select
        label="Мой торговый статус"
        value={draft.status ?? ""}
        onChange={(e) =>
          setDraft((d) => ({
            ...d,
            status: (e.target.value || undefined) as AuctionsSearch["status"],
          }))
        }
      >
        <option value="">Любой</option>
        {TRADING_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        label="Статус аукциона"
        value={draft.auction_status ?? ""}
        onChange={(e) =>
          setDraft((d) => ({
            ...d,
            auction_status: e.target.value ? Number(e.target.value) : undefined,
          }))
        }
      >
        <option value="">Любой</option>
        {AUCTION_STATUS_CODES.map((code) => (
          <option key={code} value={code}>
            {AUCTION_STATUS_LABELS[AUCTION_STATUS_BY_CODE[code]]}
          </option>
        ))}
      </Select>

      <Select
        label="Тип аукциона"
        value={draft.auc_type ?? ""}
        onChange={(e) =>
          setDraft((d) => ({
            ...d,
            auc_type: (e.target.value ||
              undefined) as AuctionsSearch["auc_type"],
          }))
        }
      >
        <option value="">Любой</option>
        {AUC_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        label="Город погрузки"
        value={draft.load_city ?? ""}
        onChange={(e) =>
          setDraft((d) => ({ ...d, load_city: e.target.value || undefined }))
        }
      >
        <option value="">Любой</option>
        {CITIES_DICTIONARY.map((c) => (
          <option key={c.gc_id} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        label="Город выгрузки"
        value={draft.unload_city ?? ""}
        onChange={(e) =>
          setDraft((d) => ({ ...d, unload_city: e.target.value || undefined }))
        }
      >
        <option value="">Любой</option>
        {CITIES_DICTIONARY.map((c) => (
          <option key={c.gc_id} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>

      <div className="field-row">
        <Input
          label="Погрузка от"
          type="date"
          value={draft.load_date_from ?? ""}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              load_date_from: e.target.value || undefined,
            }))
          }
        />
        <Input
          label="Погрузка до"
          type="date"
          value={draft.load_date_to ?? ""}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              load_date_to: e.target.value || undefined,
            }))
          }
        />
      </div>

      <div className="field-row">
        <Input
          label="Цена от"
          type="number"
          min={0}
          value={draft.current_price_from ?? ""}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              current_price_from: e.target.value
                ? Number(e.target.value)
                : undefined,
            }))
          }
        />
        <Input
          label="Цена до"
          type="number"
          min={0}
          value={draft.current_price_to ?? ""}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              current_price_to: e.target.value
                ? Number(e.target.value)
                : undefined,
            }))
          }
        />
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={draft.is_available ?? false}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              is_available: e.target.checked || undefined,
            }))
          }
        />
        Только доступные
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={draft.is_bidder ?? false}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              is_bidder: e.target.checked || undefined,
            }))
          }
        />
        Только со своей ставкой
      </label>

      <div className="filter-panel__actions">
        <Button type="submit">Применить</Button>
        <Button type="button" variant="ghost" onClick={reset}>
          Сбросить
        </Button>
      </div>
    </form>
  );
}
