import type { Setting } from '@plentymarkets/shop-api';

export type SettingValue = string | number | boolean | unknown[] | object | null;

export interface UseSiteSettingsDeps {
  sdk: {
    plentysystems: {
      setConfiguration: (params: {
        settings: { key: string; value: string }[];
      }) => Promise<{ data: unknown } | undefined>;
    };
  };
  runtimeConfigPublic: Record<string, unknown>;
}

export interface UseSiteSettingsState {
  data: {
    [key: string]: unknown;
  };
  initialData: {
    [key: string]: unknown;
  };
  loading: boolean;
}

export type UpdateSetting = (value: string) => void;
export type SetSettingsInitialData = (settings: Setting[]) => void;
export type GetSetting = () => string;
export type GetBooleanSetting = (fallback?: boolean) => boolean;
export type GetNumberSetting = (fallback?: number) => number;
export type GetJsonSetting = () => string[];
export type IsDirty = ComputedRef<boolean>;
export type DirtyKeys = ComputedRef<string[]>;
export type SaveSiteSettings = () => Promise<boolean>;

export interface UseSiteSettings {
  data: Readonly<Ref<UseSiteSettingsState['data']>>;
  initialData: Readonly<Ref<UseSiteSettingsState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  updateSetting: UpdateSetting;
  getSetting: GetSetting;
  getBooleanSetting: GetBooleanSetting;
  getNumberSetting: GetNumberSetting;
  getJsonSetting: GetJsonSetting;
  settingsIsDirty: IsDirty;
  dirtyKeys: DirtyKeys;
  saveSiteSettings: SaveSiteSettings;
  setInitialData: SetSettingsInitialData;
}

export type UseSiteSettingsReturn = (setting?: string) => UseSiteSettings;
