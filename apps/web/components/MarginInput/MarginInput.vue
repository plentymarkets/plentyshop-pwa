<template>
  <div class="py-2">
    <UiFormLabel>{{ label }}</UiFormLabel>
    <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
      <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
        <span><SfIconArrowUpward /></span>
        <input
          v-model.number="modelValue.marginTop"
          type="number"
          class="w-12 text-center outline-none"
          data-testid="margin-top"
        />
      </div>
      <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
        <span><SfIconArrowDownward /></span>
        <input
          v-model.number="modelValue.marginBottom"
          type="number"
          class="w-12 text-center outline-none"
          data-testid="margin-bottom"
        />
      </div>
      <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
        <span><SfIconArrowBack /></span>
        <input
          v-model.number="modelValue.marginLeft"
          type="number"
          class="w-12 text-center outline-none"
          data-testid="margin-left"
        />
      </div>
      <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
        <span><SfIconArrowForward /></span>
        <input
          v-model.number="modelValue.marginRight"
          type="number"
          class="w-12 text-center outline-none"
          data-testid="margin-right"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconArrowUpward, SfIconArrowDownward, SfIconArrowBack, SfIconArrowForward } from '@storefront-ui/vue';
import type { MarginInputProps } from './types';

const props = defineProps<MarginInputProps>();
const modelValue = defineModel<{ marginTop: string; marginBottom: string; marginLeft: string; marginRight: string }>(
  'modelValue',
  { default: () => ({ marginTop: '', marginBottom: '', marginLeft: '', marginRight: '' }) },
);
const label = props.label ?? 'Margin';
</script>
