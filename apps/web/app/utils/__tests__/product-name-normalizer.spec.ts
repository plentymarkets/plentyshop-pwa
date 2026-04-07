import type { Cart, Product, WishlistItem } from '@plentymarkets/shop-api';
import {
  getNormalizedProductName,
  normalizeCartProductNames,
  normalizeProductName,
  normalizeWishlistProductNames,
} from '../product-name-normalizer';

const createProduct = (): Product =>
  ({
    texts: {
      name1: 'Original Name',
    },
    variationProperties: [
      {
        name: 'Variation Texts',
        properties: [
          {
            id: 10,
            cast: 'text',
            names: {
              propertyId: 10,
              name: 'Variation Title',
            },
            values: {
              value: 'Normalized Name',
            },
          },
        ],
      },
    ],
  }) as Product;

describe('product name normalizer', () => {
  it('should return null when no property id is configured', () => {
    expect(getNormalizedProductName(createProduct())).toBeNull();
  });

  it('should extract a configured variation property as normalized product name', () => {
    const product = {
      texts: {
        name1: 'Original Name',
      },
      variationProperties: [
        {
          name: 'Custom Group',
          properties: [
            {
              id: 42,
              cast: 'text',
              names: {
                propertyId: 42,
                name: 'Custom Property',
              },
              values: {
                value: 'Configured Name',
              },
            },
          ],
        },
      ],
    } as Product;

    expect(getNormalizedProductName(product, '42')).toBe('Configured Name');
  });

  it('should return null when the configured property id does not exist', () => {
    expect(getNormalizedProductName(createProduct(), '999')).toBeNull();
  });

  it('should return null when the configured property is not text', () => {
    const product = {
      texts: {
        name1: 'Original Name',
      },
      variationProperties: [
        {
          name: 'Custom Group',
          properties: [
            {
              id: 42,
              cast: 'file',
              names: {
                propertyId: 42,
                name: 'Custom Property',
              },
              values: {
                value: 'Configured Name',
              },
            },
          ],
        },
      ],
    } as Product;

    expect(getNormalizedProductName(product, '42')).toBeNull();
  });

  it('should keep the original product name when no valid replacement is resolved', () => {
    const product = createProduct();

    expect(normalizeProductName(product).texts?.name1).toBe('Original Name');
    expect(normalizeProductName(createProduct(), '999').texts?.name1).toBe('Original Name');
  });

  it('should overwrite product texts.name1 with the normalized name', () => {
    const product = createProduct();

    expect(normalizeProductName(product, '10').texts?.name1).toBe('Normalized Name');
  });

  it('should normalize cart item variation names', () => {
    const cart = {
      items: [{ variation: createProduct() }],
    } as Cart;
    const normalizedCart = normalizeCartProductNames(cart, '10');
    const firstItem = normalizedCart.items?.[0];

    expect(firstItem).toBeDefined();
    expect(firstItem?.variation?.texts?.name1).toBe('Normalized Name');
  });

  it('should normalize wishlist item variation names', () => {
    const wishlistItems: WishlistItem[] = [createProduct() as WishlistItem];

    expect(normalizeWishlistProductNames(wishlistItems, '10')[0]?.texts?.name1).toBe('Normalized Name');
  });
});