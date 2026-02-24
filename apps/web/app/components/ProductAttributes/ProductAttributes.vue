<template>
  <div v-if="attributes.length > 0" data-testid="product-attributes" class="mb-2">
    <div v-for="(attribute, index) in attributes" :key="index" class="mb-2">
      <Component
        :is="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
        v-if="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
        :attribute="attribute"
      />
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
const props = defineProps<ProductAttributesProps>();
const product = computed(() => props.product);
const route = useRoute();
const config = useRuntimeConfig().public;

const lastSegment = route.path.split('/').pop() ?? '';
const selectAttributes = ref(lastSegment.split('_').length > 2 || config.enableCallistoUrlScheme);

watch(
  selectAttributes,
  () => {
    setAttribute(product.value, selectAttributes.value);
  },
  { immediate: true },
);

watch(
  product,
  (newProduct) => {
    setAttribute(newProduct, selectAttributes.value);
  },
  { immediate: false },
);
</script>
