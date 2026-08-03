import { z } from "zod";

export interface BidConstraints {
  min?: number | null;
  max?: number | null;
  step?: number | null;
  available?: number | null;
}

export interface BidFormValues {
  price: number;
}

export function createBidSchema(constraints: BidConstraints) {
  const { min, max, step, available } = constraints;

  return z
    .object({
      price: z.coerce
        .number({ message: "Введите цену" })
        .positive("Цена должна быть больше 0"),
    })
    .superRefine((values, ctx) => {
      if (min != null && values.price < min) {
        ctx.addIssue({
          code: "custom",
          path: ["price"],
          message: `Минимальная цена — ${min}`,
        });
      }
      if (max != null && values.price > max) {
        ctx.addIssue({
          code: "custom",
          path: ["price"],
          message: `Максимальная цена — ${max}`,
        });
      }
      if (step != null && step > 0 && available != null) {
        const diff = values.price - available;
        const remainder = Math.abs(Math.round(diff / step) * step - diff);
        if (remainder > 1e-6) {
          ctx.addIssue({
            code: "custom",
            path: ["price"],
            message: `Цена должна изменяться шагом ${step} от ${available}`,
          });
        }
      }
    });
}

export type BidSchema = ReturnType<typeof createBidSchema>;
