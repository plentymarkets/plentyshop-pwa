import ProductFixture from './../../../utils/__tests__/__fixtures__/Product';

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
});
