import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView = 'blocksList' | 'DesignView' | 'PagesView' | 'blocksSettings' | null;
export type SettingsType = 'general-settings' | 'seo-settings' | 'general-menu' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  settingsCategory: CategoryTreeItem | null;
  settingsType: SettingsType;
  drawerOpen: boolean;
  pageModalOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  placement: string;
  drawerView: DrawerView;
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
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  activeSetting: Readonly<Ref<UseSiteConfigurationState['activeSetting']>>;
  activeSubCategory: Readonly<Ref<UseSiteConfigurationState['activeSubCategory']>>;
  setActiveSetting: SetActiveSetting;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  openDrawerWithView: OpenDrawerView;
  togglePageModal: TogglePageModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
