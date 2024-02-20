<template>
  <div data-testid="product-attributes">
    {{ attributeValues }}
    <div v-for="(attribute, index) in attributes" :key="index" class="mb-2">
      <ClientOnly>
        <Component
          v-if="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
          :attribute="attribute"
          :is="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductAttributeProps, ComponentsMapper } from './types';
import AttributeDropdown from './AttributeDropdown/AttributeDropdown.vue';
import AttributeBox from './AttributeBox/AttributeBox.vue';
import { productAttributeGetters } from '@plentymarkets/shop-sdk';

const componentsMapper: ComponentsMapper = {
  dropdown: AttributeDropdown,
  box: AttributeBox,
};

const { attributes, setAttribute, attributeValues } = useProductAttributes();
const props = defineProps<ProductAttributeProps>();
const route = useRoute();

const pathSegments = route.path.split('/');
let lastSegment = pathSegments[pathSegments.length - 1];
const lastSegmentParts = lastSegment.split('_');
let selectAttributes = false;

if (lastSegmentParts.length > 2) {
  selectAttributes = true;
}

setAttribute(props.product, selectAttributes);
</script>
