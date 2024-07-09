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
import type { ProductPropertyTextProps } from './types';
const props = defineProps<ProductPropertyTextProps>();
const productProperty = props.productProperty;
</script>
