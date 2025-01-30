import type { TailwindPalette } from '~/utils/tailwindHelper';
export type DrawerView = 'settings' | 'blocks' | null;
export type SelectedFont = { caption: string; value: string };
export type ConfigurationSettings = {
  blockSize: string;
  selectedFont: SelectedFont;
  primaryColor: string;
  secondaryColor: string;
};

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  selectedFont: SelectedFont;
  blockSize: string;
  drawerView: DrawerView;
  initialData: ConfigurationSettings;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type SaveSettings = () => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: SetColorPalette;
  updateSecondaryColor: SetColorPalette;
  updateBlockSize: UpdateBlockSize;
  saveSettings: SaveSettings;
  openDrawerWithView: (view: DrawerView) => void;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
