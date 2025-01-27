export type DrawerView = 'settings' | 'blocks' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  blockSize: string;
  drawerView: DrawerView;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  loadGoogleFont: LoadGoogleFont;
  updateBlockSize: UpdateBlockSize;
  openDrawerWithView: (view: DrawerView) => void;
  closeDrawer: () => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
