import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { createBidSchema, type BidSchema } from "../model/bid-schema";
import { usePlaceBid, getValidationFieldErrors } from "../model/use-place-bid";
import { Input } from "../../../shared/ui/Input.component";
import { Button } from "../../../shared/ui/Button.component";
import { formatMoney } from "../../../shared/lib/format/format";
import { toast } from "../../../shared/lib/toast/toast-store";
import type { AuctionShowResponse } from "../../../entities/auction/model/types";

type BidFormInput = z.input<BidSchema>;
type BidFormOutput = z.output<BidSchema>;

interface PlaceBidFormProps {
  auction: AuctionShowResponse;
  onSuccess?: () => void;
}

export function PlaceBidForm({ auction, onSuccess }: PlaceBidFormProps) {
  const { trading } = auction;
  const { price, can_set_bet: canSetBet, your: ownBet } = trading;
  const currencyLabel = "RUB";
  const schema = createBidSchema({
    min: price.min,
    max: price.max,
    step: price.step,
    available: price.available,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BidFormInput, unknown, BidFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: ownBet.last_bet_with_vat ?? price.available ?? price.current ?? 0,
    },
  });

  const mutation = usePlaceBid(auction.main.id);

  useEffect(() => {
    if (mutation.isError) {
      const fieldErrors = getValidationFieldErrors(mutation.error);
      if (fieldErrors?.price?.length) {
        setError("price", { message: fieldErrors.price.join(" ") });
      }
      toast.error(
        fieldErrors
          ? "Проверьте цену ставки"
          : "Не удалось отправить ставку. Попробуйте ещё раз.",
      );
    }
  }, [mutation.isError, mutation.error]);

  if (!canSetBet) {
    return (
      <p className="state-panel state-panel--empty">
        Ставки по этому аукциону сейчас недоступны.
      </p>
    );
  }

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      { price: values.price },
      {
        onSuccess: () => {
          toast.success("Ставка успешно отправлена");
          onSuccess?.();
        },
      },
    );
  });

  return (
    <form className="bid-form" onSubmit={onSubmit}>
      <p className="bid-form__hint">
        Текущая цена: {formatMoney(price.current, currencyLabel)}
        {price.available != null && (
          <> · доступная цена: {formatMoney(price.available, currencyLabel)}</>
        )}
        {price.step != null && (
          <> · шаг ставки: {formatMoney(price.step, currencyLabel)}</>
        )}
        {price.min != null && (
          <> · мин: {formatMoney(price.min, currencyLabel)}</>
        )}
        {price.max != null && (
          <> · макс: {formatMoney(price.max, currencyLabel)}</>
        )}
      </p>

      <Input
        label="Ваша цена (с НДС)"
        type="number"
        step="any"
        error={errors.price?.message}
        {...register("price")}
      />

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {ownBet.bet ? "Обновить ставку" : "Отправить ставку"}
      </Button>
    </form>
  );
}
