import type { CategoryData } from '../../../../../plentymarkets-sdk/packages/api-client/src';
import type { CategorySearchCriteria } from '../../../../../plentymarkets-sdk/packages/api-client';

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