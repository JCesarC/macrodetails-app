import { z } from 'zod';

/** MongoDB ObjectId serialized as a 24-char hex string. */
export const IdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

/** URL-friendly identifier: lowercase letters, digits and dashes. */
export const SlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z\d]+(?:-[a-z\d]+)*$/, 'Invalid slug');

export const CurrencySchema = z.enum(['MXN']);

/** Money is always stored in the smallest unit (centavos) to avoid float errors. */
export const MoneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: CurrencySchema,
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export function pageOf<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
}

export type Id = z.infer<typeof IdSchema>;
export type Money = z.infer<typeof MoneySchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type Page<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
