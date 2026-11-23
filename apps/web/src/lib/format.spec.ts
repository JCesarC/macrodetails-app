import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

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
