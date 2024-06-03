<!-- CHANGES -->
<template>
  <div data-testid="product-attributes" class="mb-2">
    <div v-for="(attribute, index) in attributes" :key="index" class="mb-2">
      <ClientOnly>
        <Component
          v-if="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
          :attribute="attribute"
          :is="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
          :propertygarniturfarbe="propertyGarniturfarbe"
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
import { productAttributeGetters, productGetters } from '@plentymarkets/shop-sdk';

const componentsMapper: ComponentsMapper = {
  dropdown: AttributeDropdown,
  box: AttributeBox,
  image: AttributeImage,
};

const { attributes, setAttribute } = useProductAttributes();
const props = defineProps<ProductAttributesProps>();
const route = useRoute();

const lastSegment = route.path.split('/').pop() ?? '';
const selectAttributes = lastSegment.split('_').length > 2;

setAttribute(props.product, selectAttributes); 
//const propertyGarniturfarbe: any = productGetters.getPropertyById(67, props.product).values;

const propertyGarniturfarbe: any  = computed(() => {
  let garniturFarbeValues: string[] = [];
  if (productGetters.getPropertyById(67, props.product) != null) {
    const propertyGarniturfarbeValueArray: any = productGetters.getPropertyById(67, props.product).values
    propertyGarniturfarbeValueArray.forEach((property: any) => {
      garniturFarbeValues.push(property.value);
    });
  }

  return garniturFarbeValues;
});

</script>
