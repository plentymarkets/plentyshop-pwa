import type { DrawerView } from '~/composables/useSiteConfiguration/types';
import type { Category } from '@plentymarkets/shop-api';

export interface useCategoryConfigurationState {
  data: Record<number, any>;
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  id: number;
  parentCategoryId: number | null;
  sitemap: boolean;
  linkList: boolean;
  name: string;
  canonicalLink: string;
  right: string;
  title: string;
  description: string;
  keywords: string;
  robots: string;
  drawerView: DrawerView;
  path: string;

  initialData: {
    id: number;
    parentCategoryId: number | null;
    sitemap: boolean;
    linkList: boolean;
    name: string;
    canonicalLink: string;
    right: string;
    title: string;
    description: string;
    keywords: string;
    robots: string;
    path: string;
  };
}

export interface useCategorySettings {
  data: Ref<useCategoryConfigurationState['data']>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  title: Ref<useCategoryConfigurationState['title']>;
  description: Ref<useCategoryConfigurationState['description']>;
  keywords: Ref<useCategoryConfigurationState['keywords']>;
  robots: Ref<useCategoryConfigurationState['robots']>;
  path: Ref<useCategoryConfigurationState['path']>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  categorySettingsIsDirty: ComputedRef<boolean>;
  id: Ref<useCategoryConfigurationState['id']>;
  parentCategoryId: Ref<useCategoryConfigurationState['parentCategoryId']>;
  sitemap: Ref<useCategoryConfigurationState['sitemap']>;
  linkList: Ref<useCategoryConfigurationState['linkList']>;
  right: Ref<useCategoryConfigurationState['right']>;
  name: Ref<useCategoryConfigurationState['name']>;
  canonicalLink: Ref<useCategoryConfigurationState['canonicalLink']>;
  setPageId: (id: number) => void;
  getPageId: ComputedRef<number>;
  getParentCategoryId: ComputedRef<number | null>;
  saveCategorySettings: () => Promise<boolean>;
  fetchCategorySettings: (categoryId: number) => Promise<void>;
}

export type useCategorySettingsReturn = () => useCategorySettings;
