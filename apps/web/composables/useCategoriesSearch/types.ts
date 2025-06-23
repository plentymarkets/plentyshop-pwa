import type { CategoryEntry, CategoryData, CategorySearchCriteria } from '@plentymarkets/shop-api';

export interface UseCategoriesSearchState {
  data: CategoryData;
  contentItems: CategoryEntry[];
  itemItems: CategoryEntry[];
  newPages: number[];
  loadingContent: boolean;
  loadingItem: boolean;
  contentPage: number;
  itemPage: number;
  hasMoreContent: boolean;
  hasMoreItem: boolean;
}
export interface PaginatedChildren {
  items: Ref<CategoryEntry[]>;
  loading: Ref<boolean>;
  hasMore: Ref<boolean>;
  fetchMore: () => Promise<void>;
}
export interface UseCategoriesSearchMethods {
  data: Ref<CategoryData>;
  contentItems: Readonly<Ref<CategoryEntry[]>>;
  itemItems: Readonly<Ref<CategoryEntry[]>>;
  loadingContent: Readonly<Ref<boolean>>;
  loadingItem: Readonly<Ref<boolean>>;
  hasMoreContent: Readonly<Ref<boolean>>;
  hasMoreItem: Readonly<Ref<boolean>>;
  fetchCategories: (categoryType: 'item' | 'content') => Promise<void>;
  usePaginatedChildren: (category: CategoryEntry) => PaginatedChildren;
  addNewPageToTree: (newPage: CategoryEntry) => void;
  deletePageFromTree: (id: number) => void;
  getCategories: (params: CategorySearchCriteria) => Promise<void>;
  resetCategories: () => void;
}

export type UseCategoriesSearchMethodsReturn = () => UseCategoriesSearchMethods;
