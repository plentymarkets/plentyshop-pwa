import type { CategoryData } from '@plentymarkets/shop-api';

export interface UseCategoryDetailState {
  data: CategoryData;
  loading: boolean;
}

export interface UseCategoryDetailsMethods {
  data: Readonly<Ref<UseCategoryDetailState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getCategory: (id: number) => Promise<CategoryData>;
}

export type UseCategoryDetailsReturn = () => UseCategoryDetailsMethods;

