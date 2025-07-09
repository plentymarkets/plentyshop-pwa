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
export type GetJsonSetting = () => unknown;
export type IsDirty = ComputedRef<boolean>;
export type SaveSiteSettings = () => void;

export interface UseSiteSettings {
  data: Readonly<Ref<UseSiteSettingsState['data']>>;
  initialData: Readonly<Ref<UseSiteSettingsState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  updateSetting: UpdateSetting;
  getSetting: GetSetting;
  getJsonSetting: GetJsonSetting;
  isDirty: IsDirty;
  saveSiteSettings: SaveSiteSettings;
}

export type UseSiteSettingsReturn = (setting?: string) => UseSiteSettings;
