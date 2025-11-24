<template>
  <div
    data-testid="producteprel"
    class="flex items-center gap-2 absolute"
    style="position: absolute; right: 0; top: 0; z-index: 2"
  >
    <ArrowSvg v-if="showArrow" :level="eprelValue" :size="size" class="transition-transform duration-200" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import ArrowSvg from '~/components/ArrowSvg/ArrowSvg.vue';
import type { ProductEprelProps } from './types';

const EPREL_PROPERTY_ID = 172;
const props = defineProps<ProductEprelProps>();

const propertyGroups = computed(() => props.product.variationProperties);
const eprelProperty = computed(() => productPropertyGetters.getProperty(EPREL_PROPERTY_ID, propertyGroups.value || []));

const size = computed(() => props.size || 'base');

const eprelValue = computed(() =>
  eprelProperty.value ? productPropertyGetters.getPropertyValue(eprelProperty.value) : '',
);

const showArrow = computed(
  () => eprelValue.value !== null && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(eprelValue.value),
);
</script>

<style scoped>
svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
