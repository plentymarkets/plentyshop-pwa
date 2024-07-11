<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <div>
      <div v-html="productPropertyGetters.getPropertyValue(variationProperty)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';
const props = defineProps<VariationPropertyHtmlProps>();
const variationProperty = props.variationProperty;
</script>
