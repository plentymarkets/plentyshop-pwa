export interface useCategorySettingsCollectionState {
    data: any[];
    initialData: any[];
  }
  
  export interface useCategorySettingsCollection {
    data: Ref<useCategorySettingsCollectionState['data']>;
    initialData: Ref<useCategorySettingsCollectionState['initialData']>;
    loading: Readonly<Ref<boolean>>;
    hasChanges: ComputedRef<boolean>;
    addCategorySettings: (categoryId: number) => Promise<void>;
  }
  
  export type useCategorySettingsCollectionReturn = () => useCategorySettingsCollection;