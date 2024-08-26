<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <a target="_blank" :href="productPropertyGetters.getPropertyDownloadLink(variationProperty)">
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyFileProps } from './types';
defineProps<VariationPropertyFileProps>();
</script>
