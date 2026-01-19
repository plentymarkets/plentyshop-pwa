import type { Product } from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../../../__tests__/__mocks__/product.mock';

/**
 * Factory for creating Product objects in tests
 * @example
 * const product = ProductFactory.create(1234);
 * const products = ProductFactory.createMany([1234, 5678, 9012]);
 */
export class ProductFactory {
  /**
   * Create a single product with the given variation ID
   * @param variationId - The variation ID for the product
   * @param overrides - Optional partial product data to override defaults
   */
  static create(variationId: number, overrides?: Partial<Product>): Product {
    return {
      ...ProductMock,
      ...overrides,
      variation: {
        ...ProductMock.variation,
        id: variationId,
        ...(overrides?.variation ?? {}),
      },
    } as Product;
  }

  /**
   * Create multiple products from an array of variation IDs
   * @param variationIds - Array of variation IDs
   */
  static createMany(variationIds: number[]): Product[] {
    return variationIds.map((id) => ProductFactory.create(id));
  }
}
