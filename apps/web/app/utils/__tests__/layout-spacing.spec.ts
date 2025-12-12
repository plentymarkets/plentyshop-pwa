import { describe, it, expect } from 'vitest';
import { getHorizontalClass, DEFAULT_HORIZONTAL_CLASS } from '../layout-spacing';

describe('layout-spacing/getHorizontalClass', () => {
  it('should map known keys to classes', () => {
    expect(getHorizontalClass('s')).toBe('max-w-screen-3xl');
    expect(getHorizontalClass('m')).toBe('max-w-screen-2xl');
    expect(getHorizontalClass('l')).toBe('max-w-screen-xl');
  });

  it('should fall back to default on unknown or undefined', () => {
    expect(getHorizontalClass('unknown')).toBe(DEFAULT_HORIZONTAL_CLASS);
    expect(getHorizontalClass(undefined)).toBe(DEFAULT_HORIZONTAL_CLASS);
    expect(getHorizontalClass('')).toBe(DEFAULT_HORIZONTAL_CLASS);
  });
});
