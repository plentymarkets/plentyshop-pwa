import type { Setting } from '../../../../../plentymarkets-sdk/packages/api-client/src';

export type SettingValue = string | number | boolean | any[] | object | null;

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
export type GetJsonSetting = () => string[];
export type IsDirty = ComputedRef<boolean>;
export type SaveSiteSettings = () => Promise<boolean>;

export interface UseSiteSettings {
  data: Readonly<Ref<UseSiteSettingsState['data']>>;
  initialData: Readonly<Ref<UseSiteSettingsState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  updateSetting: UpdateSetting;
  getSetting: GetSetting;
  getJsonSetting: GetJsonSetting;
  settingsIsDirty: IsDirty;
  saveSiteSettings: SaveSiteSettings;
  setInitialData: SetSettingsInitialData;
}

export type UseSiteSettingsReturn = (setting?: string) => UseSiteSettings;
