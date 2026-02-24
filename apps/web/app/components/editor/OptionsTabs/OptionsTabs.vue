<template>
  <fieldset class="py-2">
    <legend v-if="legend" :id="legendId" class="text-sm font-medium text-black m-0">
      <span class="inline-flex items-center gap-2">
        <span>{{ legend }}</span>

        <SfTooltip v-if="tooltip" :label="tooltip" :placement="tooltipPlacement">
          <SfIconInfo size="sm" :data-testid="tooltipTestId" />
        </SfTooltip>
      </span>
    </legend>

    <div
      class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
      role="radiogroup"
      :aria-labelledby="ariaLabelledBy"
      :aria-label="ariaLabelResolved"
    >
      <button
        v-for="(opt, idx) in options"
        :key="String(opt.value)"
        type="button"
        :data-testid="opt.testId ?? `${testIdPrefix}-${String(opt.value)}`"
        class="flex items-center justify-center px-4 py-2 text-sm"
        :class="itemClass(opt.value, idx)"
        role="radio"
        :aria-checked="modelValue === opt.value"
        @click="onSelect(opt.value)"
      >
        <SfIconCheck :class="{ invisible: modelValue !== opt.value }" class="mr-1 w-[1.1rem]" />
        {{ resolveLabel(opt) }}
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts" generic="T extends OptionValue">
import { SfIconCheck, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
import type { Option, OptionValue, TooltipPlacement } from './types';

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: Option<T>[];
    legend?: string;
    ariaLabel?: string;
    testIdPrefix: string;
    tooltip?: string;
    tooltipPlacement?: TooltipPlacement;
    tooltipTestId?: string;
  }>(),
  {
    legend: undefined,
    ariaLabel: undefined,
    tooltip: undefined,
    tooltipPlacement: 'top',
    tooltipTestId: undefined,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
}>();

const { modelValue, options, legend, ariaLabel, testIdPrefix } =
  toRefs(props);
const legendId = `options-tabs-legend-${useId()}`;

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
    'cursor-pointer': true,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-inset': true,
    'hover:bg-gray-50': !isActive,
  };
};
</script>
