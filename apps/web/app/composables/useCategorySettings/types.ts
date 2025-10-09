import type { DrawerView } from '~/composables/useSiteConfiguration/types';
import type { CategoryEntry } from '@plentymarkets/shop-api';

export interface useCategoryConfigurationState {
  data: CategoryEntry;
  id: number;
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  drawerView: DrawerView | null;
  initialData: CategoryEntry;
  unlinkModalOpen: boolean;
}
export type ToggleDeleteModal = (value: boolean) => void;

export interface useCategorySettings {
  data: Ref<useCategoryConfigurationState['data']>;
  id: Ref<useCategoryConfigurationState['id']>;
  loading: Ref<boolean>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  fetchCategorySettings: (categoryId: number) => Promise<CategoryEntry | null>;
  unlinkModalOpen: Readonly<Ref<useCategoryConfigurationState['unlinkModalOpen']>>;
  deletePage: (pageId: number, pageName: string) => void;
  toggleDeleteModal: ToggleDeleteModal;
}

export type useCategorySettingsReturn = () => useCategorySettings;
