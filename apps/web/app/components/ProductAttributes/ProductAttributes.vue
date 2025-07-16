<template>
  <div v-if="attributes.length > 0" data-testid="product-attributes" class="mb-2">
    <div v-for="(attribute, index) in attributes" :key="index" class="mb-2">
      <ClientOnly>
        <Component
          :is="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
          v-if="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
          :attribute="attribute"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductAttributesProps, ComponentsMapper } from './types';
import AttributeDropdown from './AttributeDropdown/AttributeDropdown.vue';
import AttributeBox from './AttributeBox/AttributeBox.vue';
import AttributeImage from './AttributeImage/AttributeImage.vue';
import { productAttributeGetters } from '@plentymarkets/shop-api';

const componentsMapper: ComponentsMapper = {
  dropdown: AttributeDropdown,
  box: AttributeBox,
  image: AttributeImage,
};

const { attributes, setAttribute } = useProductAttributes();
const { product } = defineProps<ProductAttributesProps>();
const route = useRoute();

const lastSegment = route.path.split('/').pop() ?? '';
const selectAttributes = lastSegment.split('_').length > 2;

onNuxtReady(() => setAttribute(product, selectAttributes));
</script>
