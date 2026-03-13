import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView =
  | 'blocksList'
  | 'DesignView'
  | 'PagesView'
  | 'blocksSettings'
  | 'LocalizationView'
  | 'TableOfContents'
  | null;
export type SettingsType = 'general-settings' | 'seo-settings' | 'general-menu' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  settingsCategory: CategoryTreeItem | null;
  settingsType: SettingsType;
  siteConfigurationDrawerOpen: boolean;
  blocksConfigurationDrawerOpen: boolean;
  pageModalOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  siteConfigurationDrawerView: DrawerView;
  blocksConfigurationDrawerView: DrawerView;
  activeSetting: string;
  activeSubCategory: string;
  blockType: string;
  blockUuid: string;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type OpenDrawerView = (view: DrawerView, block?: Block) => void;
export type TogglePageModal = (value: boolean) => void;
export type SetActiveSetting = (setting: string) => void;
export type SetActiveSubCategory = (subCategory: string) => void;
export type SetSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  siteConfigurationDrawerOpen: Readonly<Ref<UseSiteConfigurationState['siteConfigurationDrawerOpen']>>;
  blocksConfigurationDrawerOpen: Readonly<Ref<UseSiteConfigurationState['blocksConfigurationDrawerOpen']>>;
  settingsCategory: Readonly<Ref<UseSiteConfigurationState['settingsCategory']>>;
  settingsType: Readonly<Ref<UseSiteConfigurationState['settingsType']>>;
  pageModalOpen: Readonly<Ref<UseSiteConfigurationState['pageModalOpen']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockUuid: Readonly<Ref<UseSiteConfigurationState['blockUuid']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  siteConfigurationDrawerView: Readonly<Ref<UseSiteConfigurationState['siteConfigurationDrawerView']>>;
  blocksConfigurationDrawerView: Readonly<Ref<UseSiteConfigurationState['blocksConfigurationDrawerView']>>;
  activeSetting: Readonly<Ref<UseSiteConfigurationState['activeSetting']>>;
  activeSubCategory: Readonly<Ref<UseSiteConfigurationState['activeSubCategory']>>;
  setActiveSetting: SetActiveSetting;
  setActiveSubCategory: SetActiveSubCategory;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  openDrawerWithView: OpenDrawerView;
  togglePageModal: TogglePageModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  closeSiteConfigurationDrawer: () => void;
  closeBlocksConfigurationDrawer: () => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
