import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';
export interface UseStructuredDataState {
  loading: boolean;
}

export type SetProductMetaData = (product: Product, categoryTree: CategoryTreeItem) => void;
export type SetLogoMeta = () => void;
export type SetProductRobotsMetaData = (product: Product) => void;
export type SetProductCanonicalMetaData = (product: Product) => void;

export interface UseStructuredData {
  loading: Readonly<Ref<boolean>>;
  setLogoMeta: SetLogoMeta;
  setProductMetaData: SetProductMetaData;
  setProductRobotsMetaData: SetProductRobotsMetaData;
  setProductCanonicalMetaData: SetProductCanonicalMetaData;
}

export type useStructuredDataReturn = () => UseStructuredData;
