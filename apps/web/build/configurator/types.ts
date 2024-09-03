export type ConfigurationEntry = {
  configId: number;
  categoryId: number;
  key: string;
  value: string;
  labelKey: [];
  type: string;
  possibleValues: [];
  defaultValue: string | null;
};

export type ConfigurationCategory = Array<ConfigurationEntry>;

export type ConfigurationResponse = {
  [key: string]: ConfigurationCategory;
};

export type BaseColors = {
  primary: string;
  secondary: string;
};
