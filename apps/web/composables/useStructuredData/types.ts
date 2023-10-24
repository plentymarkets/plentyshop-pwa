import type { Ref } from 'vue';
import type { Product } from '@plentymarkets/shop-api';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export interface UseStructuredDataState {
  loading: boolean;
}

export type SingleItemMeta = (product: Product, variationId: string, categoryTree: CategoryTreeItem) => void;

export interface UseStructuredData {
  loading: Readonly<Ref<boolean>>;
  setSingleItemMeta: SingleItemMeta;
}

export type useStructuredDataReturn = () => UseStructuredData;
