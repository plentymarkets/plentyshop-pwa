import type { TailwindPalette } from '~/utils/tailwindHelper';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView =
  | 'SettingsView'
  | 'blocksList'
  | 'DesignView'
  | 'SeoView'
  | 'PagesView'
  | 'blocksSettings'
  | null;
export type SettingsType = 'general-settings' | 'seo-settings' | null;
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
  settingsCategory: CategoryTreeItem | null;
  settingsType: SettingsType;
  drawerOpen: boolean;
  pageModalOpen: boolean;
  unlinkModalOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  selectedFont: SelectedFont;
  blockSize: string;
  placement: string;
  drawerView: DrawerView;
  blockType: string;
  blockUuid: string;
  initialData: ConfigurationSettings;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type OpenDrawerView = (view: DrawerView, block?: Block) => void;
export type SaveSettings = () => Promise<boolean>;
export type TogglePageModal = (value: boolean) => void;
export type ToggleDeleteModal = (value: boolean) => void;
export type SetSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  settingsCategory: Readonly<Ref<UseSiteConfigurationState['settingsCategory']>>;
  settingsType: Readonly<Ref<UseSiteConfigurationState['settingsType']>>;
  pageModalOpen: Readonly<Ref<UseSiteConfigurationState['pageModalOpen']>>;
  unlinkModalOpen: Readonly<Ref<UseSiteConfigurationState['unlinkModalOpen']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockUuid: Readonly<Ref<UseSiteConfigurationState['blockUuid']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
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
  togglePageModal: TogglePageModal;
  toggleDeleteModal: ToggleDeleteModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
