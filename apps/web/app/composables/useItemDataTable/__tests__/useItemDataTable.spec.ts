import { describe, it, expect, vi } from 'vitest';
import type { Product } from '@plentymarkets/shop-api';
import { useItemDataTable } from '~/composables/useItemDataTable/useItemDataTable';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: object) => {
      const p = params as { age?: number } | undefined;
      switch (key) {
        case 'single-item-age-restriction':
          return `${p?.age} and older`;
        case 'single-item-age-restriction-none':
          return 'No age restriction';
        case 'single-item-age-restriction-not-flagged':
          return 'Not rated';
        case 'single-item-age-restriction-not-required':
          return 'Not required';
        case 'single-item-age-restriction-unknown':
          return 'Unknown';
        default:
          return key;
      }
    },
  }),
}));

describe('useItemDataTable', () => {
  it('should return empty values when product is null', () => {
    const productRef = ref<Product | null>(null);
    const { fieldValues } = useItemDataTable(productRef);

    expect(fieldValues.value.itemId).toBe('');
    expect(fieldValues.value.manufacturer).toBe('');
    expect(fieldValues.value.grossWeight).toBe('');
    expect(fieldValues.value.dimensions).toBe('');
    expect(fieldValues.value.ageRating).toBe('');
  });

  it('should map product fields correctly', () => {
    const productRef = ref<Product | null>({
      item: {
        id: 109,
        ageRestriction: 16,
        manufacturer: {
          name: 'Teston Testerton',
        },
        producingCountry: {
          names: [{ name: 'Germany' }],
        },
        customsTariffNumber: '1234',
      },
      variation: {
        externalId: 'EXT-1',
        model: 'MODEL-1',
        weightG: 400,
        weightNetG: 300,
        lengthMM: 550,
        widthMM: 650,
        heightMM: 330,
      },
      unit: {
        content: 1,
        names: { name: 'Piece' },
      },
      variationProperties: [],
    } as unknown as Product);

    const { fieldValues } = useItemDataTable(productRef);

    expect(fieldValues.value.itemId).toBe('109');
    expect(fieldValues.value.manufacturer).toBe('Teston Testerton');
    expect(fieldValues.value.manufacturingCountry).toBe('Germany');
    expect(fieldValues.value.content).toBe('1 Piece');
    expect(fieldValues.value.grossWeight).toBe('400 g');
    expect(fieldValues.value.netWeight).toBe('300 g');
    expect(fieldValues.value.dimensions).toBe('550 x 650 x 330 mm');
    expect(fieldValues.value.ageRating).toBe('16 and older');
  });
});
