import { describe, it, expect } from 'vitest';
import type { Product } from '@plentymarkets/shop-api';
import {
  getAgeRatingDescriptor,
  formatContent,
  formatWeight,
  formatDimensions,
  formatVariationProperties,
  getConditionName,
  getManufacturingCountryName,
  getManufacturerName,
} from '../ItemDataHelpers';

const tMock = (key: string, params?: Record<string, unknown>) => {
  const p = params as { age?: number } | undefined;

  switch (key) {
    case 'single-item-age-restriction-none':
      return 'No age restriction';
    case 'single-item-age-restriction':
      return `${p?.age} and older`;
    case 'single-item-age-restriction-not-flagged':
      return 'Not rated';
    case 'single-item-age-restriction-not-required':
      return 'Not required';
    case 'single-item-age-restriction-unknown':
      return 'Unknown';
    default:
      return key;
  }
};

describe('getAgeRatingDescriptor', () => {
  it('should return null when age is null/undefined', () => {
    expect(getAgeRatingDescriptor(null)).toBeNull();
    expect(getAgeRatingDescriptor(undefined)).toBeNull();
  });

  it('should handle age = 0 (no restriction)', () => {
    expect(getAgeRatingDescriptor(0)).toEqual({
      key: 'single-item-age-restriction-none',
    });
  });

  it('should handle age between 1 and 18', () => {
    expect(getAgeRatingDescriptor(16)).toEqual({
      key: 'single-item-age-restriction',
      params: { age: 16 },
    });
  });

  it('should handle age = 50 (not flagged)', () => {
    expect(getAgeRatingDescriptor(50)).toEqual({
      key: 'single-item-age-restriction-not-flagged',
    });
  });

  it('should handle age = 80 (not required)', () => {
    expect(getAgeRatingDescriptor(80)).toEqual({
      key: 'single-item-age-restriction-not-required',
    });
  });

  it('should handle unknown age', () => {
    expect(getAgeRatingDescriptor(999)).toEqual({
      key: 'single-item-age-restriction-unknown',
    });
  });

  it('should integrate with a translate function correctly', () => {
    const descriptor = getAgeRatingDescriptor(16);
    const label = descriptor ? tMock(descriptor.key, descriptor.params) : '';
    expect(label).toBe('16 and older');
  });
});
describe('formatWeight', () => {
  it('should return empty string for null/undefined', () => {
    expect(formatWeight(null)).toBe('');
    expect(formatWeight(undefined)).toBe('');
  });

  it('should format number including 0', () => {
    expect(formatWeight(0)).toBe('0 g');
    expect(formatWeight(400)).toBe('400 g');
  });
});

describe('formatDimensions', () => {
  it('should return empty string when all dims are null/undefined', () => {
    expect(formatDimensions(null, null, null)).toBe('');
  });

  it('should format all 3 dimensions', () => {
    expect(formatDimensions(550, 650, 330)).toBe('550 x 650 x 330 mm');
  });

  it('should skip missing dimensions but keeps existing ones', () => {
    expect(formatDimensions(550, null, 330)).toBe('550 x 330 mm');
  });
});

describe('formatContent', () => {
  const baseProduct = {
    unit: {},
  } as unknown as Product;

  it('should return empty string when no content and no unit name', () => {
    expect(formatContent(baseProduct)).toBe('');
  });

  it('should handle unit names as single object', () => {
    const product = {
      unit: {
        content: 1,
        names: { name: 'Piece' },
      },
    } as unknown as Product;

    expect(formatContent(product)).toBe('1 Piece');
  });

  it('should handle unit names as array', () => {
    const product = {
      unit: {
        content: 2,
        names: [{ name: 'Stück' }],
      },
    } as unknown as Product;

    expect(formatContent(product)).toBe('2 Stück');
  });
});

describe('getManufacturerName', () => {
  it('should return empty string if no manufacturer', () => {
    const product = { item: {} } as unknown as Product;
    expect(getManufacturerName(product)).toBe('');
  });

  it('should prefer name over externalName', () => {
    const product = {
      item: {
        manufacturer: {
          name: 'Teston Testerton',
          externalName: 'EXT',
        },
      },
    } as unknown as Product;

    expect(getManufacturerName(product)).toBe('Teston Testerton');
  });
});

describe('getConditionName', () => {
  it('should use conditionApi if available (array)', () => {
    const product = {
      item: {
        conditionApi: { names: [{ name: 'New' }] },
        condition: { names: [{ name: 'Used' }] },
      },
    } as unknown as Product;

    expect(getConditionName(product)).toBe('New');
  });

  it('should fall back to condition if no conditionApi', () => {
    const product = {
      item: {
        condition: { names: [{ name: 'Used' }] },
      },
    } as unknown as Product;

    expect(getConditionName(product)).toBe('Used');
  });
});

describe('getManufacturingCountryName', () => {
  it('should return empty string if no country', () => {
    const product = {
      item: {},
    } as unknown as Product;

    expect(getManufacturingCountryName(product)).toBe('');
  });

  it('should use first entry when country.names is array', () => {
    const product = {
      item: {
        producingCountry: {
          names: [{ name: 'Germany' }],
        },
      },
    } as unknown as Product;

    expect(getManufacturingCountryName(product)).toBe('Germany');
  });

  it('should use names.name when names is object', () => {
    const product = {
      item: {
        producingCountry: {
          names: { name: 'Germany' },
        },
      },
    } as unknown as Product;

    expect(getManufacturingCountryName(product)).toBe('Germany');
  });
});

describe('formatVariationProperties', () => {
  it('should return empty string when no variationProperties', () => {
    const product = {} as unknown as Product;
    expect(formatVariationProperties(product)).toBe('');
  });

  it('should join properties with label when available', () => {
    const product = {
      variationProperties: [
        {
          properties: [
            {
              values: { value: 'Cotton' },
              names: { name: 'Material' },
            },
            {
              values: { value: 'Red' },
              names: { name: 'Color' },
            },
          ],
        },
      ],
    } as unknown as Product;

    expect(formatVariationProperties(product)).toBe('Material: Cotton; Color: Red');
  });
});
