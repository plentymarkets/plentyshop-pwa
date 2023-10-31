import type { Ref } from 'vue';
import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';
export interface UseStructuredDataState {
  loading: boolean;
}

export type SingleItemMeta = (product: Product, categoryTree: CategoryTreeItem) => Promise<void>;

export interface UseStructuredData {
  loading: Readonly<Ref<boolean>>;
  setSingleItemMeta: SingleItemMeta;
}

export type useStructuredDataReturn = () => UseStructuredData;
