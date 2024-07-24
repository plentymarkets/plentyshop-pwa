<template>
  <div class="w-full ml-4">
    <span class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </span>
    <span>: {{ productPropertyGetters.getPropertyValue(variationProperty) }} </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';
defineProps<VariationPropertyTextProps>();
</script>
