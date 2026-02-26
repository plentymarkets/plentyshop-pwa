import type {  ComputedRef } from 'vue';
import type { Option, OptionValue } from '~/components/editor/OptionsTabs/types';

type TabItem<T extends OptionValue> = {
  value: T;
  labelKey: string;
  testIdSuffix?: string;
};

export function useEditorOptionsTabs<T extends OptionValue>(args: {
  t: (key: string) => string;
  testIdPrefix: string;

  get: () => T | undefined;
  set: (v: T) => void;

  defaultValue: T;
  items: readonly TabItem<T>[];
}): {
  model: ComputedRef<T>;
  options: ComputedRef<Option<T>[]>;
} {
  const model = computed<T>({
    get: () => args.get() ?? args.defaultValue,
    set: (v) => args.set(v),
  });

  const options = computed<Option<T>[]>(() =>
    args.items.map((it) => ({
      value: it.value,
      label: args.t(it.labelKey),
      testId: `${args.testIdPrefix}-${it.testIdSuffix ?? String(it.value)}`,
    })),
  );

  return { model, options };
}
