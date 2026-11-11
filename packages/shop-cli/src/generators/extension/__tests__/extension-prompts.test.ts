import { describe, expect, it } from 'vitest';
import { MIN_PAID_PRICE } from '../constants';
import { validatePrice } from '../extension-prompts';

describe('validatePrice', () => {
  it('should accept a price at or above the minimum', () => {
    expect(validatePrice(String(MIN_PAID_PRICE))).toBe(true);
    expect(validatePrice('19.9')).toBe(true);
  });

  it('should reject a price below the minimum', () => {
    expect(validatePrice('0')).not.toBe(true);
  });

  it.each(['abc', 'Infinity', '-Infinity', '1e309'])('should reject the non-finite or invalid input %s', (input) => {
    expect(validatePrice(input)).not.toBe(true);
  });
});
