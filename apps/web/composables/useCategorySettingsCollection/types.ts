import type { Category } from '@plentymarkets/shop-api';

export interface useCategorySettingsCollectionState {
  data: Category[];
  initialData: Category[];
  loading: boolean;
}

export interface useCategorySettingsCollection {
  data: Readonly<Ref<useCategorySettingsCollectionState['data']>>;
  initialData: Readonly<Ref<useCategorySettingsCollectionState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  hasChanges: ComputedRef<boolean>;
  isCategoryDirty: (id: number) => boolean;
  addCategorySettings: (category: Category) => Promise<void>;
  saveCategorySettings: () => Promise<boolean>;
  save: () => Promise<void>;
}

export type useCategorySettingsCollectionReturn = () => useCategorySettingsCollection;
