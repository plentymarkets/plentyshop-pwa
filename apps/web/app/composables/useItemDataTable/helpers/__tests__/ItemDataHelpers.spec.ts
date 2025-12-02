import { describe, it, expect } from 'vitest';
import type { Product } from '@plentymarkets/shop-api';
import {
  formatAgeRating,
  formatContent,
  formatWeight,
  formatDimensions,
  formatVariationProperties,
  getConditionName,
  getManufacturingCountryName,
  getManufacturerName,
} from '../ItemDataHelpers';

const tMock = (key: string, params?: object) => {
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

describe('formatAgeRating', () => {
  it('returns empty string when age is null/undefined', () => {
    expect(formatAgeRating(tMock, null)).toBe('');
    expect(formatAgeRating(tMock, undefined)).toBe('');
  });

  it('handles age = 0 (no restriction)', () => {
    expect(formatAgeRating(tMock, 0)).toBe('No age restriction');
  });

  it('handles age between 1 and 18', () => {
    expect(formatAgeRating(tMock, 16)).toBe('16 and older');
  });

  it('handles age = 50 (not flagged)', () => {
    expect(formatAgeRating(tMock, 50)).toBe('Not rated');
  });

  it('handles age = 80 (not required)', () => {
    expect(formatAgeRating(tMock, 80)).toBe('Not required');
  });

  it('handles unknown age', () => {
    expect(formatAgeRating(tMock, 999)).toBe('Unknown');
  });
});

describe('formatWeight', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatWeight(null)).toBe('');
    expect(formatWeight(undefined)).toBe('');
  });

  it('formats number including 0', () => {
    expect(formatWeight(0)).toBe('0 g');
    expect(formatWeight(400)).toBe('400 g');
  });
});

describe('formatDimensions', () => {
  it('returns empty string when all dims are null/undefined', () => {
    expect(formatDimensions(null, null, null)).toBe('');
  });

  it('formats all 3 dimensions', () => {
    expect(formatDimensions(550, 650, 330)).toBe('550 x 650 x 330 mm');
  });

  it('skips missing dimensions but keeps existing ones', () => {
    expect(formatDimensions(550, null, 330)).toBe('550 x 330 mm');
  });
});

describe('formatContent', () => {
  const baseProduct = {
    unit: {},
  } as unknown as Product;

  it('returns empty string when no content and no unit name', () => {
    expect(formatContent(baseProduct)).toBe('');
  });

  it('handles unit names as single object', () => {
    const product = {
      unit: {
        content: 1,
        names: { name: 'Piece' },
      },
    } as unknown as Product;

    expect(formatContent(product)).toBe('1 Piece');
  });

  it('handles unit names as array', () => {
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
  it('returns empty string if no manufacturer', () => {
    const product = { item: {} } as unknown as Product;
    expect(getManufacturerName(product)).toBe('');
  });

  it('prefers name over externalName', () => {
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
  it('uses conditionApi if available (array)', () => {
    const product = {
      item: {
        conditionApi: { names: [{ name: 'New' }] },
        condition: { names: [{ name: 'Used' }] },
      },
    } as unknown as Product;

    expect(getConditionName(product)).toBe('New');
  });

  it('falls back to condition if no conditionApi', () => {
    const product = {
      item: {
        condition: { names: [{ name: 'Used' }] },
      },
    } as unknown as Product;

    expect(getConditionName(product)).toBe('Used');
  });
});

describe('getManufacturingCountryName', () => {
  it('returns empty string if no country', () => {
    const product = {
      item: {},
    } as unknown as Product;

    expect(getManufacturingCountryName(product)).toBe('');
  });

  it('uses first entry when country.names is array', () => {
    const product = {
      item: {
        producingCountry: {
          names: [{ name: 'Germany' }],
        },
      },
    } as unknown as Product;

    expect(getManufacturingCountryName(product)).toBe('Germany');
  });

  it('uses names.name when names is object', () => {
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
  it('returns empty string when no variationProperties', () => {
    const product = {} as unknown as Product;
    expect(formatVariationProperties(product)).toBe('');
  });

  it('joins properties with label when available', () => {
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
