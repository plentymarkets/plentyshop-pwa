export type OptionValue = string | number;

export type Option<T extends OptionValue = OptionValue> = {
  value: T;
  label?: string;
  labelKey?: string;
  testId?: string;
};
