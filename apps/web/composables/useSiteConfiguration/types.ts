import type { TailwindPalette } from '~/utils/tailwindHelper';
export type DrawerView = 'settings' | 'blocksList' | 'blocksSettings' | null;
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
  placement: string;
  drawerOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  selectedFont: SelectedFont;
  blockType: string;
  blockSize: string;
  drawerView: DrawerView;
  initialData: ConfigurationSettings;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type SaveSettings = () => void;
export type OpenDrawerView = (view: DrawerView, placement: string, blockType?: string) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: SetColorPalette;
  updateSecondaryColor: SetColorPalette;
  updateBlockSize: UpdateBlockSize;
  saveSettings: SaveSettings;
  openDrawerWithView: OpenDrawerView;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
