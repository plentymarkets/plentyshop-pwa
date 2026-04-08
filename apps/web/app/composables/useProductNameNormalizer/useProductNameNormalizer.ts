import type { Cart, Facet, ItemSearchResult, Product, WishlistItem } from '@plentymarkets/shop-api';
import {
  getNormalizedProductName as getNormalizedProductNameBase,
  normalizeCartProductNames as normalizeCartProductNamesBase,
  normalizeFacetProductNames as normalizeFacetProductNamesBase,
  normalizeItemSearchResultProductNames as normalizeItemSearchResultProductNamesBase,
  normalizeProductCollection as normalizeProductCollectionBase,
  normalizeProductName as normalizeProductNameBase,
  normalizeWishlistProductNames as normalizeWishlistProductNamesBase,
} from '~/utils/product-name-normalizer';

export const useProductNameNormalizer = () => {
  const { getSetting: getVariationTitlePropertySetting } = useSiteSettings('variationTitleProperty');

  const getSettingValue = () => getVariationTitlePropertySetting();

  return {
    getNormalizedProductName: (product?: unknown | null) => getNormalizedProductNameBase(product, getSettingValue()),
    normalizeProductName: <T>(product?: T | null) => normalizeProductNameBase(product, getSettingValue()),
    normalizeProductCollection: (products?: Product[] | null) => normalizeProductCollectionBase(products, getSettingValue()),
    normalizeFacetProductNames: (facet?: Facet | null) => normalizeFacetProductNamesBase(facet, getSettingValue()),
    normalizeItemSearchResultProductNames: (result?: ItemSearchResult | null) => normalizeItemSearchResultProductNamesBase(result, getSettingValue()),
    normalizeCartProductNames: (cart?: Cart | null) => normalizeCartProductNamesBase(cart, getSettingValue()),
    normalizeWishlistProductNames: (wishlistItems?: WishlistItem[] | null) => normalizeWishlistProductNamesBase(wishlistItems, getSettingValue()),
  };
};