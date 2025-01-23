export type DrawerView = 'settings' | 'blocks' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  drawerView: DrawerView;
}

export type LoadGoogleFont = (font: string) => void;

export type SetDrawerView = (blocks: string) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  setDrawerView: SetDrawerView;
  loadGoogleFont: LoadGoogleFont;
  openDrawer: () => void;
  toggleDrawer: () => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
