import type { DrawerView } from '~/composables/useSiteConfiguration/types';

export interface UseSeoConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  drawerExtraOpen: boolean;
  title: string;
  description: string;
  keywords: string;  
  robots: string;
  canonical: string;
  includeSitemap: boolean;
  drawerView: DrawerView;
  initialData: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
    canonical: string;
    includeSitemap: boolean;
  };
}

export interface UseSeoConfiguration {
  data: Readonly<Ref<UseSeoConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSeoConfigurationState['drawerOpen']>>;
  drawerExtraOpen: Readonly<Ref<UseSeoConfigurationState['drawerExtraOpen']>>;
  title: Readonly<Ref<UseSeoConfigurationState['title']>>;
  description: Readonly<Ref<UseSeoConfigurationState['description']>>;
  keywords: Readonly<Ref<UseSeoConfigurationState['keywords']>>;
  robots: Readonly<Ref<UseSeoConfigurationState['robots']>>;
  canonical: Readonly<Ref<UseSeoConfigurationState['canonical']>>;
  includeSitemap: Readonly<Ref<UseSeoConfigurationState['includeSitemap']>>;
  drawerView: Readonly<Ref<UseSeoConfigurationState['drawerView']>>;
  seoSettingsIsDirty: ComputedRef<boolean>;
//   saveSeoSettings: () => Promise<boolean>;
}

export type UseSeoConfigurationReturn = () => UseSeoConfiguration;
