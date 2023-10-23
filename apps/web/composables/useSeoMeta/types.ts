import type { Ref } from 'vue';
import type { Product } from '@plentymarkets/shop-api';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export interface UseMetaState {
  loading: boolean;
}

export type SingleItemMeta = (product: Product, variationId: string, categoryTree: CategoryTreeItem) => void;

export interface UseSeoMeta {
  loading: Readonly<Ref<boolean>>;
  setSingleItemMeta: SingleItemMeta;
}

export type UseSeoMetaReturn = () => UseSeoMeta;
