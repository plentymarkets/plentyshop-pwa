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
}

export type UseSiteSettingsReturn = (setting?: string) => UseSiteSettings;
