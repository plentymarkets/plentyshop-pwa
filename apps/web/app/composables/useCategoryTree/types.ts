import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export interface UseCategoryTreeState {
  data: CategoryTreeItem[];
  loading: boolean;
}

export type GetCategoryTree = () => Promise<CategoryTreeItem[]>;
export type SetCategoryTree = (data: CategoryTreeItem[]) => void;
export type ClearCategoryTree = () => void;

export interface UseCategoryTreeMethods {
  data: Readonly<Ref<UseCategoryTreeState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCategoryTree: GetCategoryTree;
  setCategoryTree: SetCategoryTree;
  clearCategoryTree: ClearCategoryTree;
}

export type UseCategoryTreeMethodsReturn = () => UseCategoryTreeMethods;
