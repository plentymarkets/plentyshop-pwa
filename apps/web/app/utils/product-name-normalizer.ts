import type { Cart, Facet, ItemSearchResult, Product, WishlistItem } from '@plentymarkets/shop-api';

type ProductNameSource = {
  texts?: {
    name1?: string;
  };
  variationProperties?: Array<{
    name: string | null;
    properties: Array<{
      names: {
        name: string | null;
      };
      values: {
        value: string | null;
      };
    }>;
  }>;
};

const isProductNameSource = (value: unknown): value is ProductNameSource => {
  return typeof value === 'object' && value !== null;
};

const VARIATION_TEXTS_GROUP_NAME = 'Variation Texts';
const VARIATION_TITLE_NAME = 'Variation Title';

/**
 * Returns the custom variation title used as the canonical storefront product name.
 */
export const getNormalizedProductName = (product?: unknown | null): string => {
  if (!isProductNameSource(product)) {
    return '';
  }

  const variationTitle = product?.variationProperties
    ?.find((propertyGroup) => propertyGroup.name === VARIATION_TEXTS_GROUP_NAME)
    ?.properties?.find((property) => property.names.name === VARIATION_TITLE_NAME)
    ?.values.value;

  return variationTitle?.trim() ?? '';
};

/**
 * Rewrites the product name in-place so existing product getters resolve the normalized name.
 */
export const normalizeProductName = <T>(product?: T | null): T => {
  if (!product) {
    return {} as T;
  }

  if (!isProductNameSource(product)) {
    return product;
  }

  const normalizedName = getNormalizedProductName(product);

  if (!normalizedName) {
    return product;
  }

  product.texts = {
    ...(product.texts ?? {}),
    name1: normalizedName,
  };

  return product;
};

/**
 * Normalizes all product names in a product collection.
 */
export const normalizeProductCollection = (products?: Product[] | null): Product[] => {
  if (!products?.length) {
    return products ?? [];
  }

  products.forEach((product) => normalizeProductName(product));

  return products;
};

/**
 * Normalizes product names in facet responses.
 */
export const normalizeFacetProductNames = (facet?: Facet | null): Facet => {
  if (!facet) {
    return {} as Facet;
  }

  if (facet.products) {
    normalizeProductCollection(facet.products);
  }

  return facet;
};

/**
 * Normalizes product names in search responses.
 */
export const normalizeItemSearchResultProductNames = (result?: ItemSearchResult | null): ItemSearchResult => {
  if (!result) {
    return {} as ItemSearchResult;
  }

  if (result.products) {
    normalizeProductCollection(result.products);
  }

  return result;
};

/**
 * Normalizes product names for cart item variations.
 */
export const normalizeCartProductNames = (cart?: Cart | null): Cart => {
  if (!cart) {
    return {} as Cart;
  }

  cart.items?.forEach((item) => normalizeProductName(item.variation));

  return cart;
};

/**
 * Normalizes product names for wishlist item variations.
 */
export const normalizeWishlistProductNames = (wishlistItems?: WishlistItem[] | null): WishlistItem[] => {
  if (!wishlistItems?.length) {
    return wishlistItems ?? [];
  }

  wishlistItems.forEach((wishlistItem) => {
    normalizeProductName(wishlistItem);

    if ('variation' in wishlistItem) {
      normalizeProductName(wishlistItem.variation);
    }
  });

  return wishlistItems;
};