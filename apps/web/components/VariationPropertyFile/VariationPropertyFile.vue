<template>
  <div class="w-full">
    <div class="font-semibold">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}
    </div>
    <div>
      <button @click="downloadPropertyFile">
        {{ productPropertyGetters.getPropertyValue(variationProperty) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyFileProps } from './types';
const props = defineProps<VariationPropertyFileProps>();
const variationProperty = props.variationProperty;
// const downloadLink = `https://s3-eu-central-1.amazonaws.com/plentymarkets-public-92/mevofvd5omld/propertyItems/${productPropertyGetters.getPropertyValue(productProperty)}`
const { downloadFile } = useProductOrderProperties();
const loading = ref(false);
const downloadPropertyFile = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  await downloadFile(productPropertyGetters.getPropertyValue(variationProperty));
  loading.value = false;
};
</script>
