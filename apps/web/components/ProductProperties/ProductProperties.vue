<template>
  <div v-for="(group, groupIndex) in variationProperties" :key="`group-${groupIndex}`" class="mt-5">
    <div
      v-for="(productProperty, propIndex) in group.properties"
      :key="`group-prop-${propIndex}`"
      class="mt-2 flex items-center"
    >
      <ClientOnly>
        <Component
          v-if="componentsMapper[productPropertyGetters.getPropertyCast(productProperty)]"
          :product-property="productProperty"
          :is="componentsMapper[productPropertyGetters.getPropertyCast(productProperty)]"
        >
        </Component>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { ProductPropertiesProps, ComponentsMapper } from './types';
import ProductPropertyText from '~/components/ProductPropertyText/ProductPropertyText.vue';

const props = defineProps<ProductPropertiesProps>();
const product = props.product;
const variationProperties = productGetters.getPropertyGroups(product);

const componentsMapper: ComponentsMapper = {
  text: ProductPropertyText,
};
</script>
