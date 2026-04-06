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
            names: {
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
  it('should extract the variation title as normalized product name', () => {
    expect(getNormalizedProductName(createProduct())).toBe('Normalized Name');
  });

  it('should overwrite product texts.name1 with the normalized name', () => {
    const product = createProduct();

    expect(normalizeProductName(product).texts?.name1).toBe('Normalized Name');
  });

  it('should normalize cart item variation names', () => {
    const cart = {
      items: [{ variation: createProduct() }],
    } as Cart;
    const normalizedCart = normalizeCartProductNames(cart);
    const firstItem = normalizedCart.items?.[0];

    expect(firstItem).toBeDefined();
    expect(firstItem?.variation?.texts?.name1).toBe('Normalized Name');
  });

  it('should normalize wishlist item variation names', () => {
    const wishlistItems: WishlistItem[] = [createProduct() as WishlistItem];

    expect(normalizeWishlistProductNames(wishlistItems)[0]?.texts?.name1).toBe('Normalized Name');
  });
});