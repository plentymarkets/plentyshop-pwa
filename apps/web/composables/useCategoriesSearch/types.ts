import type { CategoryData, CategorySearchCriteria, CategoryEntry } from '@plentymarkets/shop-api';

export interface UseCategoriesSearchState {
  data: CategoryData;
  contentItems: CategoryEntry[];
  itemItems: CategoryEntry[];
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
  contentItems: Readonly<Ref<CategoryEntry[]>>;
  itemItems: Readonly<Ref<CategoryEntry[]>>;
  loadingContent: Readonly<Ref<boolean>>;
  loadingItem: Readonly<Ref<boolean>>;
  hasMoreContent: Readonly<Ref<boolean>>;
  hasMoreItem: Readonly<Ref<boolean>>;
  data: Ref<CategoryData>;
  fetchContentCategories: () => Promise<void>;
  fetchItemCategories: () => Promise<void>;
  getCategories: (params: CategorySearchCriteria) => Promise<void>;
  usePaginatedChildren: (parentCategoryId: number) => PaginatedChildren;
}

export type UseCategoriesSearchMethodsReturn = () => UseCategoriesSearchMethods;
