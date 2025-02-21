import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';

export interface UseCategoryTemplateState {
  data: CategoryTemplate | Block[] | null;
  loading: boolean;
}

export type FetchCategoryTemplate = (categoryId: number) => Promise<void>;
export type SetCategoryTemplate = (categoryId: number, content: string) => Promise<void>;

export interface UseCategoryTemplate {
  data: Readonly<Ref<UseCategoryTemplateState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  setCategoryTemplate: SetCategoryTemplate;
}

export type UseCategoryTemplateReturn = () => UseCategoryTemplate;
