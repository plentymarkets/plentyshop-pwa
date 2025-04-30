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
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  manufactured: string;
};

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  settingsCategory: CategoryTreeItem | null;
  settingsType: SettingsType;
  drawerOpen: boolean;
  pageModalOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  manufactured: string;
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
export type SetSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  settingsCategory: Readonly<Ref<UseSiteConfigurationState['settingsCategory']>>;
  settingsType: Readonly<Ref<UseSiteConfigurationState['settingsType']>>;
  pageModalOpen: Readonly<Ref<UseSiteConfigurationState['pageModalOpen']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockUuid: Readonly<Ref<UseSiteConfigurationState['blockUuid']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  headerLogo: Readonly<Ref<UseSiteConfigurationState['headerLogo']>>;
  favicon: Readonly<Ref<UseSiteConfigurationState['favicon']>>;
  ogTitle: Readonly<Ref<UseSiteConfigurationState['ogTitle']>>;
  ogImg: Readonly<Ref<UseSiteConfigurationState['ogImg']>>;
  useAvif: Readonly<Ref<UseSiteConfigurationState['useAvif']>>;
  useWebp: Readonly<Ref<UseSiteConfigurationState['useWebp']>>;
  manufactured: Readonly<Ref<UseSiteConfigurationState['manufactured']>>;
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
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
  fields: { label: string; value: string }[];
  selectedFields: ComputedRef<{ label: string; value: string }[]>;

}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
