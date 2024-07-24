<template>
  <div class="w-full list-item list-disc ml-4">
    <span class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </span>
    <span>: {{ preatyDate }} </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyDateProps } from './types';
const props = defineProps<VariationPropertyDateProps>();
const preatyDate = computed(() => productPropertyGetters.getPropertyValue(props.variationProperty)?.split(' ')[0]);
</script>
