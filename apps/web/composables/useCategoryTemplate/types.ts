import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';
import type { ItemGridProps } from '~/components/blocks/ItemGrid/types';
import { SortFilterProps } from '~/components/blocks/SortFilter/types';

export interface UseCategoryTemplateState {
  data: Block[];
  cleanData: Block[];
  categoryTemplateData: CategoryTemplate | null;
  loading: boolean;
}

export type FetchCategoryTemplate = (categoryId: number) => Promise<void>;
export type SaveBlocks = (identifier: string | number, type: string, content: string) => Promise<void>;
export type GetBlocks = (identifier: number | string, type: string, block?: string) => Promise<void>;
export type UpdateBlocks = (blocks: Block[]) => void;
export type GetCategoryTemplateBlock = () => ItemGridProps;
export type GetSortFilterCategoryTemplateBlock = () => SortFilterProps;

export interface UseCategoryTemplate {
  data: Readonly<Ref<UseCategoryTemplateState['data']>>;
  cleanData: Readonly<Ref<UseCategoryTemplateState['cleanData']>>;
  categoryTemplateData: Readonly<Ref<UseCategoryTemplateState['categoryTemplateData']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  saveBlocks: SaveBlocks;
  getBlocks: GetBlocks;
  getBlocksServer: GetBlocks;
  updateBlocks: UpdateBlocks;
  getCategoryTemplateBlock: GetCategoryTemplateBlock;
  getSortFilterCategoryTemplateBlock: GetSortFilterCategoryTemplateBlock;
}

export type UseCategoryTemplateReturn = (blocks?: string) => UseCategoryTemplate;
