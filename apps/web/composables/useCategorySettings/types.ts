import type { DrawerView } from '~/composables/useSiteConfiguration/types';
import type { Category } from '@plentymarkets/shop-api';

export interface useCategoryConfigurationState {
  data: any;
  id: number;
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  drawerView: DrawerView;
}

export interface useCategorySettings {
  data: Ref<useCategoryConfigurationState['data']>;
  id: Ref<useCategoryConfigurationState['id']>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  // categorySettingsIsDirty: ComputedRef<boolean>;
  // setPageId: (id: number) => void;
  saveCategorySettings: () => Promise<boolean>;
  fetchCategorySettings: (categoryId: number) => Promise<Record<number, any>>;
}

export type useCategorySettingsReturn = () => useCategorySettings;
