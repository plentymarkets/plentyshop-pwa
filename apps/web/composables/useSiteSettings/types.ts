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
export type IsDirty = ComputedRef<boolean>;
export type SaveSettings = () => void;

export interface UseSiteSettings {
  data: Readonly<Ref<UseSiteSettingsState['data']>>;
  initialData: Readonly<Ref<UseSiteSettingsState['initialData']>>;
  loading: Readonly<Ref<boolean>>;
  updateSetting: UpdateSetting;
  getSetting: GetSetting;
  isDirty: IsDirty;
  saveSettings: SaveSettings;
}

export type UseSiteSettingsReturn = (setting?: string) => UseSiteSettings;
