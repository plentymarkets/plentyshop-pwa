import ProductFixture from '../../../utils/__tests__/__fixtures__/Product';
import type { Product } from '@plentymarkets/shop-api';
import { deepClone } from '~/utils/jsonHelper';

const MultiAttributeProductFixture: Product = {
  ...deepClone(ProductFixture),
  variationAttributeMap: {
    attributes: [
      {
        attributeId: 1,
        position: 1,
        name: 'Color',
        type: 'dropdown',
        values: [
          { attributeValueId: 1, position: 1, name: 'Red', imageUrl: '' },
          { attributeValueId: 2, position: 2, name: 'Blue', imageUrl: '' },
        ],
      },
      {
        attributeId: 2,
        position: 2,
        name: 'Size',
        type: 'dropdown',
        values: [
          { attributeValueId: 3, position: 1, name: 'S', imageUrl: '' },
          { attributeValueId: 4, position: 2, name: 'M', imageUrl: '' },
        ],
      },
    ],
    variations: [
      {
        variationId: 1101,
        isSalable: true,
        unitCombinationId: 9,
        unitId: 5,
        unitName: '2 liter',
        attributes: [
          { attributeId: 1, attributeValueId: 1 },
          { attributeId: 2, attributeValueId: 3 },
        ],
      },
      {
        variationId: 1102,
        isSalable: true,
        unitCombinationId: 9,
        unitId: 5,
        unitName: '2 liter',
        attributes: [
          { attributeId: 1, attributeValueId: 2 },
          { attributeId: 2, attributeValueId: 4 },
        ],
      },
    ],
  },
};

describe('useProductAttributes', () => {
  it('should initialize state correctly', () => {
    const { attributes, attributeValues, combinations, itemId, variationId } = useProductAttributes();

    expect(attributes.value).toEqual([]);
    expect(attributeValues.value).toEqual({});
    expect(combinations.value).toEqual([]);
    expect(itemId.value).toBe(0);
    expect(variationId.value).toBe(0);
  });

  it('should update attribute values', () => {
    const { setAttribute, updateValue, attributeValues } = useProductAttributes();
    setAttribute(ProductFixture, true);
    updateValue(1, 1);

    expect(attributeValues.value).toEqual({ 1: 1 });
  });

  it('should should return empty object if value is not found during update', () => {
    const { setAttribute, updateValue, attributeValues } = useProductAttributes();
    setAttribute(ProductFixture, true);
    updateValue(1, 2);

    expect(attributeValues.value).toEqual({});
  });

  it('should get the correct combination of attributes', () => {
    const { setAttribute, getCombination } = useProductAttributes();

    setAttribute(ProductFixture, true);
    const combination = getCombination();

    expect(combination).toEqual({
      attributes: [],
      isSalable: true,
      unitCombinationId: 9,
      unitId: 5,
      unitName: '2 liter',
      variationId: 1100,
    });
  });

  it('should get the correct attribute value', () => {
    const { setAttribute, updateValue, getValue } = useProductAttributes();
    setAttribute(ProductFixture, true);
    updateValue(1, 1);

    const value = getValue(1);

    expect(value).toBe(1);
  });

  it('should disable values that are not part of any combination with the selected attribute', () => {
    const { setAttribute, updateValue, attributes } = useProductAttributes();
    setAttribute(MultiAttributeProductFixture, false);
    updateValue(1, 1);

    const sizeAttribute = attributes.value.find((attribute) => attribute.attributeId === 2);
    const disabledValueIds = sizeAttribute?.values
      .filter((value) => value.disabled)
      .map((value) => value.attributeValueId);
    const enabledValueIds = sizeAttribute?.values
      .filter((value) => !value.disabled)
      .map((value) => value.attributeValueId);

    expect(enabledValueIds).toEqual([3]);
    expect(disabledValueIds).toEqual([4]);
  });

  it('should re-enable values once the blocking selection is cleared', () => {
    const { setAttribute, updateValue, attributes } = useProductAttributes();
    setAttribute(MultiAttributeProductFixture, false);
    updateValue(1, 1);
    updateValue(1, undefined);

    const sizeAttribute = attributes.value.find((attribute) => attribute.attributeId === 2);
    const disabledValueIds = sizeAttribute?.values
      .filter((value) => value.disabled)
      .map((value) => value.attributeValueId);

    expect(disabledValueIds).toEqual([]);
  });

  it('should resolve the matching variation once a full combination is selected', () => {
    const { setAttribute, updateValue, getCombination } = useProductAttributes();
    setAttribute(MultiAttributeProductFixture, false);
    updateValue(1, 2);
    updateValue(2, 4);

    const combination = getCombination();

    expect(combination?.variationId).toBe(1102);
  });
});
