import type { CategoryEntry, CategoryParams } from '@plentymarkets/shop-api';

export interface UseCategoryState {
  data: CategoryEntry;
  loading: boolean;
}

export type AddCategory = (params: CategoryParams) => Promise<void>;

export interface UseCategoryMethods {
  data: Readonly<Ref<UseCategoryState['data']>>;
  loading: Readonly<Ref<boolean>>;
  addCategory: AddCategory;
}

export type UseCategoryMethodsReturn = () => UseCategoryMethods;
