import type { CategoryData, CategorySearchById } from '../../../../../plentymarkets-sdk/packages/api-client/src';

export interface UseCategoryDetailState {
  data: CategoryData;
  loading: boolean;
}

export interface UseCategoryDetailsMethods {
  data: Readonly<Ref<UseCategoryDetailState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCategory: (id: CategorySearchById) => Promise<void>;
}

export type UseCategoryDetailsReturn = () => UseCategoryDetailsMethods;