import { z } from 'zod';

import type { Money } from '../common/primitives.js';
import type { ProductOption } from './product.js';

export type Selections = Readonly<Record<string, string>>;

function findChosen(option: ProductOption, selections: Selections) {
  if (option.type !== 'select') return undefined;
  return option.choices.find((choice) => choice.value === selections[option.key]);
}

/**
 * Unit price in centavos for the given selections.
 * Select options add the priceDelta of the chosen choice; text options never change the price.
 * Unknown or invalid selections add nothing: run validateSelections before charging.
 */
export function calculateUnitPrice(
  basePrice: Money,
  options: readonly ProductOption[],
  selections: Selections,
): Money {
  const extra = options.reduce(
    (sum, option) => sum + (findChosen(option, selections)?.priceDelta ?? 0),
    0,
  );
  return { amount: basePrice.amount + extra, currency: basePrice.currency };
}

export const SELECTION_ISSUE_REASONS = [
  'required',
  'invalid-choice',
  'too-long',
  'unknown-option',
] as const;

export const SelectionIssueSchema = z.object({
  key: z.string(),
  reason: z.enum(SELECTION_ISSUE_REASONS),
});

export type SelectionIssue = z.infer<typeof SelectionIssueSchema>;

function issueFor(
  option: ProductOption,
  value: string | undefined,
): SelectionIssue['reason'] | null {
  if (value === undefined || value.trim() === '') return option.required ? 'required' : null;
  if (option.type === 'select') {
    return findChosen(option, { [option.key]: value }) ? null : 'invalid-choice';
  }
  return value.length > option.maxLength ? 'too-long' : null;
}

/**
 * Reports every problem in a buyer's selections.
 * Unknown keys, missing required values, choices that do not exist, and text
 * longer than `maxLength` are all returned together. An empty array means the selections are valid.
 * @param options Product options the buyer may set.
 * @param selections Chosen values, keyed by option key.
 * @returns The issues found: unknown keys first, then problems in option order.
 */
export function validateSelections(
  options: readonly ProductOption[],
  selections: Selections,
): SelectionIssue[] {
  const knownKeys = new Set(options.map((option) => option.key));

  const unknown: SelectionIssue[] = Object.keys(selections)
    .filter((key) => !knownKeys.has(key))
    .map((key) => ({ key, reason: 'unknown-option' }));

  const invalid = options.flatMap((option): SelectionIssue[] => {
    const reason = issueFor(option, selections[option.key]);
    return reason ? [{ key: option.key, reason }] : [];
  });

  return [...unknown, ...invalid];
};
