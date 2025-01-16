<template>
  <div class="w-full flex row variation-property-html">
    <div v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <div
      v-if="
        productPropertyGetters.getPropertyName(variationProperty) &&
        productPropertyGetters.getPropertyValue(variationProperty)
      "
      class="mr-1"
    >
      :
    </div>
    <div class="no-preflight" v-html="productPropertyGetters.getPropertyValue(variationProperty)" />
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyHtmlProps } from './types';
defineProps<VariationPropertyHtmlProps>();
</script>
