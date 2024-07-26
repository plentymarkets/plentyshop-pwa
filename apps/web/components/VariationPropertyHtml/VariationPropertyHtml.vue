<template>
  <div class="w-full flex row">
    <div v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <div
      v-if="
        productPropertyGetters.getPropertyName(variationProperty) &&
        productPropertyGetters.getPropertyValue(variationProperty)
      "
    >
      :
    </div>
    <div v-html="productPropertyGetters.getPropertyValue(variationProperty)"></div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';
defineProps<VariationPropertyHtmlProps>();
</script>
