<template>
  <div class="w-full flex row variation-property-date">
    <div v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold mr-1">
      <span>{{ productPropertyGetters.getPropertyName(variationProperty) }}</span>
      <span v-if="prettyDate">:</span>
    </div>
    <span v-if="prettyDate">
      {{ prettyDate }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyDateProps } from './types';
const props = defineProps<VariationPropertyDateProps>();
const prettyDate = computed(() => productPropertyGetters.getPropertyValue(props.variationProperty)?.split(' ')[0]);
</script>
