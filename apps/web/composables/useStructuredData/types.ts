import type { Ref } from 'vue';
import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';
export interface UseStructuredDataState {
  loading: boolean;
}

export type SingleItemMeta = (product: Product, categoryTree: CategoryTreeItem) => void;

export interface UseStructuredData {
  loading: Readonly<Ref<boolean>>;
  setProductMetaData: SingleItemMeta;
}

export type useStructuredDataReturn = () => UseStructuredData;
