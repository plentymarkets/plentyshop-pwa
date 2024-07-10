<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(productProperty) }}
    </div>
    <div>
      <div v-html="productPropertyGetters.getPropertyValue(productProperty)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';
const props = defineProps<VariationPropertyHtmlProps>();
const productProperty = props.productProperty;
</script>
