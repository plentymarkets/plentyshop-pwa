<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(productProperty) }}
    </div>
    <div>
      {{ preatyDate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyDateProps } from './types';
const props = defineProps<VariationPropertyDateProps>();
const productProperty = props.productProperty;
const preatyDate = computed(() => productPropertyGetters.getPropertyValue(productProperty).split(' ')[0]);
</script>
