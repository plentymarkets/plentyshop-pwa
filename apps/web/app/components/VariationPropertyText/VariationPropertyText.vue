<template>
  <div
    class="w-full flex flex-col variation-property-text @md/variationProperties:flex-row"
    :class="{ '!flex-col': isLongText }"
  >
    <div v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold mr-1">
      <span>{{ productPropertyGetters.getPropertyName(variationProperty) }}</span>
      <span v-if="productPropertyGetters.getPropertyValue(variationProperty)">:</span>
    </div>
    <div v-if="productPropertyGetters.getPropertyValue(variationProperty)">
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';

const props = defineProps<VariationPropertyTextProps>();

const isLongText = computed(() => {
  const value = productPropertyGetters.getPropertyValue(props.variationProperty);
  return value?.length && value.length > 100;
});
</script>
