export type OptionValue = string | number;

export type Option<T> = {
  value: T;
  label?: string;
  labelKey?: string;
  testId?: string;
};
