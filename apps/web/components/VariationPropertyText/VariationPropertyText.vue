<template>
  <div class="w-full flex row variation-property-text">
    <span v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </span>
    <span
      v-if="
        productPropertyGetters.getPropertyName(variationProperty) &&
        productPropertyGetters.getPropertyValue(variationProperty)
      "
      class="mr-1"
      >:
    </span>
    <span v-if="productPropertyGetters.getPropertyValue(variationProperty)">
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';
defineProps<VariationPropertyTextProps>();
</script>
