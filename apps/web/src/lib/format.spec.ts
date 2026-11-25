import { describe, expect, it } from 'vitest';
import { formatLeadTime, formatPrice } from './format';

describe('formatPrice', () => {
  it('formats whole pesos without decimals', () => {
    expect(formatPrice({ amount: 65000, currency: 'MXN' })).toBe('$650');
  });

  it('keeps centavos when present', () => {
    expect(formatPrice({ amount: 12550, currency: 'MXN' })).toBe('$125.50');
  });

  it('uses thousands separators', () => {
    expect(formatPrice({ amount: 125000, currency: 'MXN' })).toBe('$1,250');
  });
});

describe('formatLeadTime', () => {
  const templates = { readyIn: 'Listo en {hours} h', readyInDays: 'Listo en {days} días' };

  it('shows hours under two days', () => {
    expect(formatLeadTime(6, templates)).toBe('Listo en 6 h');
    expect(formatLeadTime(47, templates)).toBe('Listo en 47 h');
  });

  it('switches to days from 48 hours', () => {
    expect(formatLeadTime(48, templates)).toBe('Listo en 2 días');
  });

  it('rounds to the nearest whole day', () => {
    expect(formatLeadTime(84, templates)).toBe('Listo en 4 días');
    expect(formatLeadTime(80, templates)).toBe('Listo en 3 días');
  });
});
