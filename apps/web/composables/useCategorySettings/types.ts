import type { DrawerView } from '~/composables/useSiteConfiguration/types';
import type { Category } from '@plentymarkets/shop-api';

export interface useCategoryConfigurationState {
  data: Category;
  id: number;
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  drawerView: DrawerView | null;
  initialData: Category;
}

export interface useCategorySettings {
  data: Ref<useCategoryConfigurationState['data']>;
  id: Ref<useCategoryConfigurationState['id']>;
  loading: Ref<boolean>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  fetchCategorySettings: (categoryId: number) => Promise<Category | null>;
}

export type useCategorySettingsReturn = () => useCategorySettings;
