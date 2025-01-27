export type DrawerView = 'settings' | 'blocks' | null;
export type SelectedFont = { caption: string; value: string };
export type ConfigurationSettings = { blockSize: string; selectedFont: SelectedFont };

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  selectedFont: SelectedFont;
  blockSize: string;
  drawerView: DrawerView;
  initialData: ConfigurationSettings;
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
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  loadGoogleFont: LoadGoogleFont;
  updateBlockSize: UpdateBlockSize;
  openDrawerWithView: (view: DrawerView) => void;
  closeDrawer: () => void;
  isDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
