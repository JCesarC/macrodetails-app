export const locales = ['es-MX'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es-MX';
