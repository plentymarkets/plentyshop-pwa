<template>
  <div class="w-full flex row variation-property-date">
    <span v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </span>
    <span v-if="productPropertyGetters.getPropertyName(variationProperty) && preatyDate" class="mr-1">: </span>
    <span v-if="preatyDate">
      {{ preatyDate }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyDateProps } from './types';
const props = defineProps<VariationPropertyDateProps>();
const preatyDate = computed(() => productPropertyGetters.getPropertyValue(props.variationProperty)?.split(' ')[0]);
</script>
