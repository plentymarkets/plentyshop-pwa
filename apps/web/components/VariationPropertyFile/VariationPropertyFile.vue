<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(productProperty) }}
    </div>
    <div>
      <a target="_blank" :href="downloadLink">
        {{ productPropertyGetters.getPropertyValue(productProperty) }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyFileProps } from './types';
const props = defineProps<VariationPropertyFileProps>();
const productProperty = props.productProperty;
const downloadLink = `https://s3-eu-central-1.amazonaws.com/plentymarkets-public-92/mevofvd5omld/propertyItems/${productPropertyGetters.getPropertyValue(productProperty)}`
</script>
