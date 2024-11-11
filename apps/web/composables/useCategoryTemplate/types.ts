import type { CategoryTemplate } from '@plentymarkets/shop-api';

export interface UseCategoryTemplateState {
  data: CategoryTemplate | null;
  loading: boolean;
}

export type FetchCategoryTemplate = (categoryId: number) => Promise<CategoryTemplate>;

export interface UseCategoryTemplate {
  data: Readonly<Ref<UseCategoryTemplateState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
}

export type UseCategoryTemplateReturn = () => UseCategoryTemplate;
