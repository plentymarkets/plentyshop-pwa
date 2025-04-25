import type { CategoryData, CategorySearchCriteria } from '@plentymarkets/shop-api';

export interface UseCategoriesSearchState {
  data: CategoryData;
  loading: boolean;
}

export interface UseCategoriesSearchMethods {
  data: Readonly<Ref<UseCategoriesSearchState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCategories: (params: CategorySearchCriteria) => Promise<void>;
}

export type UseCategoriesSearchMethodsReturn = () => UseCategoriesSearchMethods;
