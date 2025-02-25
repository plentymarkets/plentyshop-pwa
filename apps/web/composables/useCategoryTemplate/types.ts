import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';

export interface UseCategoryTemplateState {
  data: Block[];
  categoryTemplateData: CategoryTemplate | null;
  loading: boolean;
}

export type FetchCategoryTemplate = (categoryId: number) => Promise<void>;
export type SetCategoryTemplate = (categoryId: number, content: string) => Promise<void>;
export type GetBlocks = (identifier: number | string, type: string) => Promise<void>;

export interface UseCategoryTemplate {
  data: Readonly<Ref<UseCategoryTemplateState['data']>>;
  categoryTemplateData: Readonly<Ref<UseCategoryTemplateState['categoryTemplateData']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  setCategoryTemplate: SetCategoryTemplate;
  getBlocks: GetBlocks;
}

export type UseCategoryTemplateReturn = () => UseCategoryTemplate;
