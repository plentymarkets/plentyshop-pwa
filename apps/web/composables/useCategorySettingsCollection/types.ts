import type { CategoryEntry } from '@plentymarkets/shop-api';

export interface useCategorySettingsCollectionState {
  data: CategoryEntry[];
  initialData: CategoryEntry[];
  loading: boolean;
  hasChanges: boolean;
}

export interface useCategorySettingsCollection {
  data: Readonly<Ref<useCategorySettingsCollectionState['data']>>;
  initialData: Readonly<Ref<useCategorySettingsCollectionState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  hasChanges: ComputedRef<boolean>;
  isCategoryDirty: (id: number) => boolean;
  addCategorySettings: (category: CategoryEntry) => Promise<void>;
  saveCategorySettings: () => Promise<boolean>;
  save: () => Promise<void>;
}

export type useCategorySettingsCollectionReturn = () => useCategorySettingsCollection;
