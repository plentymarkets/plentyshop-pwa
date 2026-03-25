<template>
  <fieldset class="py-2">
    <legend v-if="legend" :id="legendId" class="text-sm font-medium text-black">
      {{ legend }}
    </legend>

    <div
      class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
      role="radiogroup"
      :aria-labelledby="ariaLabelledBy"
      :aria-label="ariaLabelResolved"
    >
      <label
        v-for="(opt, idx) in options"
        :key="String(opt.value)"
        :data-testid="opt.testId ?? `${testIdPrefix}-${String(opt.value)}`"
        class="flex items-center justify-center px-4 py-2 text-sm cursor-pointer select-none"
        :class="itemClass(opt.value, Number(idx))"
      >
        <input
          type="radio"
          class="sr-only"
          :name="groupName"
          :value="String(opt.value)"
          :checked="modelValue === opt.value"
          @change="onSelect(opt.value)"
        />
        <SfIconCheck :class="{ invisible: modelValue !== opt.value }" class="mr-1 w-[1.1rem]" />
        <span class="flex flex-col items-center">
          <span>{{ resolveLabel(opt) }}</span>
          <span v-if="opt.subLabel" class="text-xs font-normal text-gray-500">{{ opt.subLabel }}</span>
        </span>
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts" generic="T extends string | number">
import { SfIconCheck } from '@storefront-ui/vue';
import type { Option } from './types';

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: Option<T>[];
    legend?: string;
    ariaLabel?: string;
    testIdPrefix: string;
  }>(),
  {
    legend: undefined,
    ariaLabel: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: T];
}>();

const { modelValue, options, legend, ariaLabel, testIdPrefix } = toRefs(props);

const legendId = `options-tabs-legend-${useId()}`;
const groupName = `options-tabs-group-${useId()}`;

const ariaLabelledBy = computed<string | undefined>(() => (legend.value ? legendId : undefined));

const ariaLabelResolved = computed<string | undefined>(() => {
  if (legend.value) return undefined;
  return ariaLabel.value ?? testIdPrefix.value;
});

const onSelect = (value: T) => {
  if (value === modelValue.value) return;
  emit('update:modelValue', value);
};

const resolveLabel = (opt: Option<T>) => opt.label ?? String(opt.value);

const itemClass = (value: T, idx: number) => {
  const isActive = modelValue.value === value;
  const isLast = idx === options.value.length - 1;

  return {
    'bg-gray-100 text-gray-900 font-semibold': isActive,
    'border-r border-gray-300': !isLast,
    'w-1/2': options.value.length === 2,
    'w-1/3': options.value.length === 3,
    'flex-1': options.value.length !== 2 && options.value.length !== 3,
    'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-700 has-[:focus-visible]:ring-inset': true,
    'hover:bg-gray-50': !isActive,
  };
};
</script>
