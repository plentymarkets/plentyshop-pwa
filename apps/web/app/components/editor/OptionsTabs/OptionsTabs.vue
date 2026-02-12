<template>
  <fieldset class="py-2">
    <legend v-if="legendKey" class="text-sm font-medium text-black">
      {{ t(legendKey) }}
    </legend>

    <div
      class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
      role="radiogroup"
      :aria-label="legendKey ? t(legendKey) : undefined"
    >
      <button
        v-for="(opt, idx) in props.options"
        :key="String(opt.value)"
        type="button"
        :data-testid="opt.testId ?? `${props.testIdPrefix}-${String(opt.value)}`"
        class="flex items-center justify-center px-4 py-2 text-sm"
        :class="itemClass(opt.value, idx)"
        role="radio"
        :aria-checked="props.modelValue === opt.value"
        @click="onSelect(opt.value)"
      >
        <SfIconCheck :class="{ invisible: props.modelValue !== opt.value }" class="mr-1 w-[1.1rem]" />
        {{ resolveLabel(opt) }}
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';
import type { Option, OptionValue } from './types';

const props = withDefaults(
  defineProps<{
    modelValue: OptionValue;
    options: Option[];
    legendKey?: string;
    t: (key: string) => string;
    testIdPrefix: string;
  }>(),
  {
    legendKey: undefined,
  },
);
const { legendKey, t } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:modelValue', value: OptionValue): void;
}>();

const onSelect = (value: OptionValue) => {
  if (value === props.modelValue) return;
  emit('update:modelValue', value);
};

const resolveLabel = (opt: Option) => {
  if (opt.label != null) return opt.label;
  if (opt.labelKey != null) return t.value(opt.labelKey);
  return String(opt.value);
};

const itemClass = (value: OptionValue, idx: number) => {
  const isActive = props.modelValue === value;
  const isLast = idx === props.options.length - 1;

  return {
    'bg-gray-100 text-gray-900 font-semibold': isActive,
    'border-r border-gray-300': !isLast,
    'w-1/2': props.options.length === 2,
    'w-1/3': props.options.length === 3,
    'flex-1': props.options.length !== 2 && props.options.length !== 3,
    'cursor-pointer': true,
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-inset': true,
    'hover:bg-gray-50': !isActive,
  };
};
</script>
