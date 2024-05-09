<template>
  <div class="inline-flex flex-col items-center" data-testid="quantity-selector">
    <div class="flex border border-neutral-300 rounded-md h-full w-full">
      <SfButton
        variant="tertiary"
        :disabled="disabled || count <= minValue"
        square
        class="rounded-r-none"
        :aria-controls="inputId"
        :aria-label="$t('quantitySelectorDecrease')"
        data-testid="quantity-selector-decrease-button"
        @click="dec()"
      >
        <SfIconRemove />
      </SfButton>
      <input
        :id="inputId"
        v-model="count"
        type="number"
        role="spinbutton"
        :class="inputClasses"
        :min="minValue"
        :max="maxValue"
        data-testid="quantity-selector-input"
        class="h-12"
        :aria-label="$t('quantitySelector')"
        @input="handleOnChange"
        :disabled="disabled"
      />
      <SfButton
        variant="tertiary"
        :disabled="disabled || count >= maxValue"
        square
        class="rounded-l-none"
        :aria-controls="inputId"
        :aria-label="$t('quantitySelectorIncrease')"
        data-testid="quantity-selector-increase-button"
        @click="inc()"
      >
        <SfIconAdd />
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfButton, SfIconAdd, SfIconRemove, useId } from '@storefront-ui/vue';
import { useCounter } from '@vueuse/core';
import type { QuantitySelectorProps } from '~/components/ui/QuantitySelector/types';

const emit = defineEmits(['changeQuantity']);

const { value, minValue, maxValue } = withDefaults(defineProps<QuantitySelectorProps>(), {
  value: 1,
  minValue: 1,
  maxValue: Number.POSITIVE_INFINITY,
  disabled: false,
});

const inputId = ref('0');
const { count, inc, dec, set } = useCounter(value);

const inputClasses = computed(
  () =>
    'appearance-none flex-1 mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm',
);

onMounted(() => (inputId.value = useId()));

watch(count, (quantity) => {
  emit('changeQuantity', quantity);
});

const handleOnChange = (event: Event) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);
  set(clamp(nextValue, minValue, maxValue));
};
</script>
