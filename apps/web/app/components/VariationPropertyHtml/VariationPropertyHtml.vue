<template>
  <div
    class="w-full flex flex-col variation-property-html @md/variationProperties:flex-row"
    :class="{ '!flex-col': isLongText }"
  >
    <div v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold mr-1">
      <span>{{ productPropertyGetters.getPropertyName(variationProperty) }}</span>
      <span v-if="productPropertyGetters.getPropertyValue(variationProperty)">:</span>
    </div>
    <div class="no-preflight" v-html="productPropertyGetters.getPropertyValue(variationProperty)" />
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';

const props = defineProps<VariationPropertyHtmlProps>();

const isLongText = computed(() => {
  const value = productPropertyGetters.getPropertyValue(props.variationProperty);
  return value?.length && value.length > 100;
});
</script>
