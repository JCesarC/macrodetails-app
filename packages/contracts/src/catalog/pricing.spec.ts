import { describe, expect, it } from 'vitest';
import type { Money } from '../common/primitives.js';
import type { ProductOption } from './product.js';
import { calculateUnitPrice, validateSelections } from './pricing.js';

const basePrice: Money = { amount: 65_000, currency: 'MXN' };

const size: ProductOption = {
  type: 'select',
  key: 'size',
  label: 'Tamaño',
  required: true,
  choices: [
    { value: '12', label: '12 rosas', priceDelta: 0 },
    { value: '24', label: '24 rosas', priceDelta: 45_000 },
  ],
};

const color: ProductOption = {
  type: 'select',
  key: 'color',
  label: 'Color',
  required: false,
  choices: [
    { value: 'rojo', label: 'Rojo', priceDelta: 5_000 },
    { value: 'blanco', label: 'Blanco', priceDelta: 0 },
  ],
};

const cardMessage: ProductOption = {
  type: 'text',
  key: 'card-message',
  label: 'Mensaje',
  required: false,
  maxLength: 10,
};

describe('calculateUnitPrice', () => {
  it('returns the base price when the product has no options', () => {
    expect(calculateUnitPrice(basePrice, [], {})).toEqual(basePrice);
  });

  it('adds the price delta of the chosen select option', () => {
    expect(calculateUnitPrice(basePrice, [size], { size: '24' })).toEqual({
      amount: 110_000,
      currency: 'MXN',
    });
  });

  it('ignores text options', () => {
    expect(calculateUnitPrice(basePrice, [cardMessage], { 'card-message': 'Hola' }).amount).toBe(
      65_000,
    );
  });

  it('adds the deltas of several select options', () => {
    expect(calculateUnitPrice(basePrice, [size, color], { size: '24', color: 'rojo' }).amount).toBe(
      115_000,
    );
  });

  it('treats an unanswered optional select as no extra cost', () => {
    expect(calculateUnitPrice(basePrice, [color], {}).amount).toBe(65_000);
  });

  it('keeps the currency of the base price', () => {
    expect(calculateUnitPrice(basePrice, [size], { size: '24' }).currency).toBe('MXN');
  });
});

describe('validateSelections', () => {
  it('accepts a complete and valid selection', () => {
    expect(validateSelections([size, cardMessage], { size: '24', 'card-message': 'Hola' })).toEqual(
      [],
    );
  });

  it('reports a missing required option', () => {
    expect(validateSelections([size], {})).toEqual([{ key: 'size', reason: 'required' }]);
  });

  it('treats a blank text as missing when it is required', () => {
    const required = { ...cardMessage, required: true };
    expect(validateSelections([required], { 'card-message': '   ' })).toEqual([
      { key: 'card-message', reason: 'required' },
    ]);
  });

  it('does not report an empty optional option', () => {
    expect(validateSelections([color, cardMessage], {})).toEqual([]);
  });

  it('reports a choice that does not exist', () => {
    expect(validateSelections([size], { size: '100' })).toEqual([
      { key: 'size', reason: 'invalid-choice' },
    ]);
  });

  it('reports a text longer than maxLength', () => {
    expect(validateSelections([cardMessage], { 'card-message': 'más de diez letras' })).toEqual([
      { key: 'card-message', reason: 'too-long' },
    ]);
  });

  it('reports keys the product does not define', () => {
    expect(validateSelections([size], { size: '24', engraving: 'Ana' })).toEqual([
      { key: 'engraving', reason: 'unknown-option' },
    ]);
  });

  it('reports every problem at once', () => {
    expect(
      validateSelections([size, cardMessage], { 'card-message': 'más de diez letras', foo: 'x' }),
    ).toHaveLength(3);
  });
});
