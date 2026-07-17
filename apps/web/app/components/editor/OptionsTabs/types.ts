export type OptionValue = string | number;

export type Option<T extends OptionValue = OptionValue> = {
  value: T;
  label?: string;
  subLabel?: string;
  labelKey?: string;
  testId?: string;
};
export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';
