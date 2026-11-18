import { z } from 'zod';

/**
 * Taxonomies are closed sets of keys. Human-readable labels live in the
 * web app's i18n dictionaries, never here.
 */
export const CATEGORIES = [
  'flowers',
  'desserts',
  'chocolates',
  'gift-boxes',
  'balloons',
  'personalized',
] as const;

export const OCCASIONS = [
  'birthday',
  'anniversary',
  'valentines',
  'mothers-day',
  'graduation',
  'congratulations',
  'thank-you',
  'get-well',
  'just-because',
] as const;

export const ALLERGENS = ['gluten', 'dairy', 'eggs', 'nuts', 'peanuts', 'soy', 'pollen'] as const;

export const CategorySchema = z.enum(CATEGORIES);
export const OccasionSchema = z.enum(OCCASIONS);
export const AllergenSchema = z.enum(ALLERGENS);

export type Category = z.infer<typeof CategorySchema>;
export type Occasion = z.infer<typeof OccasionSchema>;
export type Allergen = z.infer<typeof AllergenSchema>;
