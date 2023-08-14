import type { Ref } from 'vue';
import type { CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseCategoryTreeState {
  data: CategoryTreeItem[];
  loading: boolean;
}

export type GetCategoryTree = () => Promise<CategoryTreeItem[]>;

export interface UseCategoryTreeMethods {
  data: Readonly<Ref<UseCategoryTreeState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCategoryTree: GetCategoryTree;
}

export type UseCategoryTreeMethodsReturn = () => UseCategoryTreeMethods;
