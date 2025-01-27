import type { TailwindPalette } from '~/utils/tailwindHelper';
export type DrawerView = 'settings' | 'blocks' | null;

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  drawerOpen: boolean;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  drawerView: DrawerView;
}

export type LoadGoogleFont = (font: string) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: UpdateColorPalette;
  updateSecondaryColor: UpdateColorPalette;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
export type SetColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type UpdateColorPalette = (hexColor: string) => void;
