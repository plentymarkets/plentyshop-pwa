import type { CartItem, Product } from '@plentymarkets/shop-api';

const createItem = (id: number, variation: Product | null = null): CartItem =>
  ({ id, quantity: 1, variationId: id * 10, variation }) as CartItem;

const productA = { variation: { name: 'A' } } as Product;
const productB = { variation: { name: 'B' } } as Product;

describe('mergeCartItems', () => {
  it('should add items that are not in the cart yet including their item data', () => {
    const result = mergeCartItems([createItem(1, productA)], [createItem(1), createItem(2, productB)]);

    expect(result.map((item) => item.id)).toEqual([1, 2]);
    expect(result[1]?.variation).toBe(productB);
  });

  it('should keep the item data of items already in the cart when the backend sends none', () => {
    const result = mergeCartItems([createItem(1, productA)], [createItem(1)]);

    expect(result[0]?.variation).toBe(productA);
  });

  it('should prefer the item data sent by the backend', () => {
    const result = mergeCartItems([createItem(1, productA)], [createItem(1, productB)]);

    expect(result[0]?.variation).toBe(productB);
  });

  it('should drop items the backend no longer reports', () => {
    const result = mergeCartItems([createItem(1, productA), createItem(2, productB)], [createItem(2)]);

    expect(result.map((item) => item.id)).toEqual([2]);
  });

  it('should use the backend quantity', () => {
    const result = mergeCartItems([createItem(1, productA)], [{ ...createItem(1), quantity: 5 }]);

    expect(result[0]?.quantity).toBe(5);
  });
});
