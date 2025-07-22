import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView =
  | 'SeoView'
  | 'SettingsView'
  | 'blocksList'
  | 'DesignView'
  | 'PagesView'
  | 'blocksSettings'
  | null;
export type SettingsType = 'general-settings' | 'seo-settings' | 'general-menu' | null;
export type ConfigurationSettings = {
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  };
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
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  placement: string;
  drawerView: DrawerView;
  activeSetting: string;
  blockType: string;
  blockUuid: string;
  initialData: ConfigurationSettings;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  };
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type OpenDrawerView = (view: DrawerView, block?: Block) => void;
export type SaveSettings = () => Promise<boolean>;
export type TogglePageModal = (value: boolean) => void;
export type SetActiveSetting = (setting: string) => void;
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
  headerLogo: Readonly<Ref<UseSiteConfigurationState['headerLogo']>>;
  favicon: Readonly<Ref<UseSiteConfigurationState['favicon']>>;
  ogTitle: Readonly<Ref<UseSiteConfigurationState['ogTitle']>>;
  ogImg: Readonly<Ref<UseSiteConfigurationState['ogImg']>>;
  useAvif: Readonly<Ref<UseSiteConfigurationState['useAvif']>>;
  useWebp: Readonly<Ref<UseSiteConfigurationState['useWebp']>>;
  seoSettings: Readonly<Ref<UseSiteConfigurationState['seoSettings']>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  activeSetting: Readonly<Ref<UseSiteConfigurationState['activeSetting']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  setActiveSetting: SetActiveSetting;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  saveSettings: SaveSettings;
  openDrawerWithView: OpenDrawerView;
  togglePageModal: TogglePageModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
  updateHeaderLogo: () => void;
  updateFavicon: () => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
