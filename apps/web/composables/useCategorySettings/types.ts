import type { DrawerView } from '~/composables/useSiteConfiguration/types';

export interface useCategoryConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  id: number;
  parentCategoryId: number | null;
  sitemap: string;
  linkList: string;
  name: string;
  canonicalLink: string;
  position: number;
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  includeSitemap: boolean;
  drawerView: DrawerView;

  initialData: {
    id: number;
    parentCategoryId: number | null;
    sitemap: string;
    linkList: string;
    name: string;
    canonicalLink: string;
    position: number;
    title: string;
    description: string;
    keywords: string;
    robots: string;
    canonical: string;
    includeSitemap: boolean;
  };
}

export interface useCategorySettings {
  data: Readonly<Ref<useCategoryConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<useCategoryConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<useCategoryConfigurationState['drawerExtraOpen']>>;
  title: Readonly<Ref<useCategoryConfigurationState['title']>>;
  description: Readonly<Ref<useCategoryConfigurationState['description']>>;
  keywords: Readonly<Ref<useCategoryConfigurationState['keywords']>>;
  robots: Readonly<Ref<useCategoryConfigurationState['robots']>>;
  canonical: Readonly<Ref<useCategoryConfigurationState['canonical']>>;
  includeSitemap: Readonly<Ref<useCategoryConfigurationState['includeSitemap']>>;
  drawerView: Readonly<Ref<useCategoryConfigurationState['drawerView']>>;
  categorySettingsIsDirty: ComputedRef<boolean>;
  id: Readonly<Ref<useCategoryConfigurationState['id']>>;
  parentCategoryId: Readonly<Ref<useCategoryConfigurationState['parentCategoryId']>>;
  sitemap: Readonly<Ref<useCategoryConfigurationState['sitemap']>>;
  linkList: Readonly<Ref<useCategoryConfigurationState['linkList']>>;
  name: Readonly<Ref<useCategoryConfigurationState['name']>>;
  canonicalLink: Readonly<Ref<useCategoryConfigurationState['canonicalLink']>>;
  position: Readonly<Ref<useCategoryConfigurationState['position']>>;
  setPageId: (id: number, parentId?: number) => void;
  getPageId: Readonly<ComputedRef<number>>;
  getParentCategoryId: Readonly<ComputedRef<number | null>>;
  saveCategorySettings: () => Promise<boolean>;
}

export type useCategorySettingsReturn = () => useCategorySettings;