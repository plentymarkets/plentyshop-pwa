export interface ConfigItem {
  configId: number;
  categoryId: number;
  key: string;
  value: string;
  labelKey: [];
  type: string;
  possibleValues: [];
  defaultValue: string | null;
}

type ConfigurationCategory = Array<ConfigItem>;

export type ConfigurationResponse = {
  [key: string]: ConfigurationCategory;
};
