import type { Cart, Facet, ItemSearchResult, Product, WishlistItem } from '@plentymarkets/shop-api';

type ProductNameSource = {
  texts?: {
    name1?: string;
  };
  variationProperties?: Array<{
    name: string | null;
    properties: Array<{
      id?: number;
      cast?: string;
      names: {
        propertyId?: number;
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

const getVariationTitleSettingPropertyId = (settingValue: unknown = ''): number | null => {
  if (typeof settingValue === 'number') {
    return Number.isInteger(settingValue) && settingValue > 0 ? settingValue : null;
  }

  if (typeof settingValue !== 'string') {
    return null;
  }

  const normalizedSettingValue = settingValue.trim();

  if (!/^\d+$/.test(normalizedSettingValue)) {
    return null;
  }

  const propertyId = Number(normalizedSettingValue);

  return propertyId > 0 ? propertyId : null;
};

/**
 * Returns the custom variation title used as the canonical storefront product name.
 */
export const getNormalizedProductName = (product?: unknown | null, settingValue = ''): string | null => {
  if (!isProductNameSource(product)) {
    return null;
  }

  const propertyId = getVariationTitleSettingPropertyId(settingValue);

  if (!propertyId) {
    return null;
  }

  const variationProperties = product.variationProperties ?? [];
  const configuredVariationTitle = variationProperties
    .flatMap((propertyGroup) => propertyGroup.properties ?? [])
    .find((property) => property.names.propertyId === propertyId || property.id === propertyId);

  if (!configuredVariationTitle || configuredVariationTitle.cast !== 'text') {
    return null;
  }

  return configuredVariationTitle.values.value?.trim() || null;
};

/**
 * Rewrites the product name in-place so existing product getters resolve the normalized name.
 */
export const normalizeProductName = <T>(product?: T | null, settingValue = ''): T => {
  if (!product) {
    return {} as T;
  }

  if (!isProductNameSource(product)) {
    return product;
  }

  const normalizedName = getNormalizedProductName(product, settingValue);

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
export const normalizeProductCollection = (products?: Product[] | null, settingValue = ''): Product[] => {
  if (!products?.length) {
    return products ?? [];
  }

  products.forEach((product) => normalizeProductName(product, settingValue));

  return products;
};

/**
 * Normalizes product names in facet responses.
 */
export const normalizeFacetProductNames = (facet?: Facet | null, settingValue = ''): Facet => {
  if (!facet) {
    return {} as Facet;
  }

  if (facet.products) {
    normalizeProductCollection(facet.products, settingValue);
  }

  return facet;
};

/**
 * Normalizes product names in search responses.
 */
export const normalizeItemSearchResultProductNames = (result?: ItemSearchResult | null, settingValue = ''): ItemSearchResult => {
  if (!result) {
    return {} as ItemSearchResult;
  }

  if (result.products) {
    normalizeProductCollection(result.products, settingValue);
  }

  return result;
};

/**
 * Normalizes product names for cart item variations.
 */
export const normalizeCartProductNames = (cart?: Cart | null, settingValue = ''): Cart => {
  if (!cart) {
    return {} as Cart;
  }

  cart.items?.forEach((item) => normalizeProductName(item.variation, settingValue));

  return cart;
};

/**
 * Normalizes product names for wishlist item variations.
 */
export const normalizeWishlistProductNames = (wishlistItems?: WishlistItem[] | null, settingValue = ''): WishlistItem[] => {
  if (!wishlistItems?.length) {
    return wishlistItems ?? [];
  }

  wishlistItems.forEach((wishlistItem) => {
    normalizeProductName(wishlistItem, settingValue);

    if ('variation' in wishlistItem) {
      normalizeProductName(wishlistItem.variation, settingValue);
    }
  });

  return wishlistItems;
};