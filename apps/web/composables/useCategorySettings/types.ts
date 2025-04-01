import type { DrawerView } from '~/composables/useSiteConfiguration/types';

export interface useCategoryConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  id: number;
  parentCategoryId: number | null;
  sitemap: string;
  linkList: boolean;
  name: string;
  canonicalLink: string;
  position: number;
  right: string;
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  includeSitemap: boolean;
  drawerView: DrawerView;
  path:string;

  initialData: {
    id: number;
    parentCategoryId: number | null;
    sitemap: string;
    linkList: boolean;
    name: string;
    canonicalLink: string;
    right: string;
    position: number;
    title: string;
    description: string;
    keywords: string;
    robots: string;
    canonical: string;
    includeSitemap: boolean;
    path:string;

  };
}

export interface useCategorySettings {
  data: Readonly<Ref<useCategoryConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  title: Ref<useCategoryConfigurationState['title']>;
  description: Ref<useCategoryConfigurationState['description']>;
  keywords: Ref<useCategoryConfigurationState['keywords']>;
  robots: Ref<useCategoryConfigurationState['robots']>;
  canonical: Ref<useCategoryConfigurationState['canonical']>;
  includeSitemap: Ref<useCategoryConfigurationState['includeSitemap']>;
  path: Ref<useCategoryConfigurationState['path']>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  categorySettingsIsDirty: ComputedRef<boolean>;
  id: Readonly<Ref<useCategoryConfigurationState['id']>>;
  parentCategoryId: Readonly<Ref<useCategoryConfigurationState['parentCategoryId']>>;
  sitemap: Readonly<Ref<useCategoryConfigurationState['sitemap']>>;
  linkList: Ref<useCategoryConfigurationState['linkList']>;
  right: Ref<useCategoryConfigurationState['right']>;
  name: Ref<useCategoryConfigurationState['name']>;
  canonicalLink: Readonly<Ref<useCategoryConfigurationState['canonicalLink']>>;
  position: Readonly<Ref<useCategoryConfigurationState['position']>>;
  setPageId: (id: number, parentId?: number) => void;
  getPageId: Readonly<ComputedRef<number>>;
  getParentCategoryId: Readonly<ComputedRef<number | null>>;
  saveCategorySettings: () => Promise<boolean>;
}

export type useCategorySettingsReturn = (id: number, parentId?: number) => useCategorySettings;
