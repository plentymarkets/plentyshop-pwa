import type { Ref } from 'vue';
import type { Product, ReviewAverage, Review } from '@plentymarkets/shop-api';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
export interface UseStructuredDataState {
  loading: boolean;
}

export type SingleItemMeta = (product: Product, variationId: string, categoryTree: CategoryTreeItem, review: Review, reviewAverage: ReviewAverage) => void;

export interface UseStructuredData {
  loading: Readonly<Ref<boolean>>;
  setSingleItemMeta: SingleItemMeta;
}

export type useStructuredDataReturn = () => UseStructuredData;
