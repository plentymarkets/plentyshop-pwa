<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(productProperty) }}
    </div>
    <div>
      {{ productPropertyGetters.getPropertyValue(productProperty) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';
const props = defineProps<VariationPropertyTextProps>();
const productProperty = props.productProperty;
</script>
