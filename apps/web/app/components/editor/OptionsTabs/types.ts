export type OptionValue = string | number;

export type Option<T extends OptionValue = OptionValue> = {
  value: T;
  label?: string;
  subLabel?: string;
  labelKey?: string;
  testId?: string;
};
