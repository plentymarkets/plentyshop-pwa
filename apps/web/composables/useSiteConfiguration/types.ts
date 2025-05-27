import type { TailwindPalette } from '~/utils/tailwindHelper';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView =
  | 'SeoView'
  | 'SettingsView'
  | 'blocksList'
  | 'DesignView'
  | 'PagesView'
  | 'blocksSettings'
  | 'FooterView'
  | null;
export type SettingsType = 'general-settings' | 'seo-settings' | 'general-menu' | null;
export type SelectedFont = { caption: string; value: string };
export type ConfigurationSettings = {
  blockSize: string;
  selectedFont: SelectedFont;
  primaryColor: string;
  secondaryColor: string;
  headerBackgroundColor: string;
  iconColor: string;
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
  initialFooterSettings: FooterSettings;
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
  headerBackgroundColor: string;
  iconColor: string;
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  selectedFont: SelectedFont;
  blockSize: string;
  placement: string;
  drawerView: DrawerView;
  blockType: string;
  blockUuid: string;
  initialData: ConfigurationSettings;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  };
  footerSettings: FooterSettings;

}
export interface FooterColumn {
  title: string;
  description?: string;
  showContactLink?: boolean;
}

export interface FooterSettings {
  column1: {
    title: string;
  };
  column2: FooterColumn;
  column3: FooterColumn;
  column4: FooterColumn;
  footnote: string;
  colors: {
    background: string;
    text: string;
    noteBackground: string;
    noteText: string;
  };
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type OpenDrawerView = (view: DrawerView, block?: Block) => void;
export type OpenFooterDrawer = (view: DrawerView) => void;
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
  headerBackgroundColor: Readonly<Ref<UseSiteConfigurationState['headerBackgroundColor']>>;
  iconColor: Readonly<Ref<UseSiteConfigurationState['iconColor']>>;
  headerLogo: Readonly<Ref<UseSiteConfigurationState['headerLogo']>>;
  favicon: Readonly<Ref<UseSiteConfigurationState['favicon']>>;
  ogTitle: Readonly<Ref<UseSiteConfigurationState['ogTitle']>>;
  ogImg: Readonly<Ref<UseSiteConfigurationState['ogImg']>>;
  useAvif: Readonly<Ref<UseSiteConfigurationState['useAvif']>>;
  useWebp: Readonly<Ref<UseSiteConfigurationState['useWebp']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  seoSettings: Readonly<Ref<UseSiteConfigurationState['seoSettings']>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: SetColorPalette;
  updateSecondaryColor: SetColorPalette;
  updateHeaderBackgroundColor: SetColorPalette;
  updateBlockSize: UpdateBlockSize;
  saveSettings: SaveSettings;
  openDrawerWithView: OpenDrawerView;
  openFooterDrawer: OpenFooterDrawer;
  togglePageModal: TogglePageModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
  footerSettings: Readonly<Ref<UseSiteConfigurationState['footerSettings']>>;
  setFooterColumn: (column: keyof FooterSettings, value: Partial<FooterColumn>) => void;
  setFootnote: (text: string) => void;
  setFooterColors: (colors: Partial<FooterSettings['colors']>) => void;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
