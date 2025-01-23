export type DrawerView = 'settings' | 'blocks' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  drawerView: DrawerView;
}

export type LoadGoogleFont = (font: string) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  loadGoogleFont: LoadGoogleFont;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
