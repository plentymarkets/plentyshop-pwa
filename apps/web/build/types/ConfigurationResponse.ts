export interface ConfigurationEntry {
  configId: number;
  categoryId: number;
  key: string;
  value: string;
  labelKey: [];
  type: string;
  possibleValues: [];
  defaultValue: string | null;
}

type ConfigurationCategory = Array<ConfigurationEntry>;

export type ConfigurationResponse = {
  [key: string]: ConfigurationCategory;
};
