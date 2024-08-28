<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <NuxtLink target="_blank" :to="productPropertyGetters.getPropertyDownloadLink(variationProperty)">
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyFileProps } from './types';
defineProps<VariationPropertyFileProps>();
</script>
