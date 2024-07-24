<template>
  <div class="w-full ml-4">
    <span class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </span>
    <div v-html="productPropertyGetters.getPropertyValue(variationProperty)"></div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';
defineProps<VariationPropertyHtmlProps>();
</script>
