<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
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
const preatyDate = computed(() => productPropertyGetters.getPropertyValue(props.variationProperty)?.split(' ')[0]);
</script>
