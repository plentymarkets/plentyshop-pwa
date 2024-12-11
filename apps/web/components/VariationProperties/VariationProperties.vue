<template>
  <div v-for="(group, groupIndex) in variationPropertyGroups" :key="`group-${groupIndex}`">
    <template v-for="(variationProperty, propIndex) in group.properties" :key="`group-prop-${propIndex}`">
      <div v-if="propertyHasNameOrValue(variationProperty)" class="flex items-center variation-properties">
        <ClientOnly>
          <Component
            v-if="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
            :variation-property="variationProperty"
            :is="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
          >
          </Component>
        </ClientOnly>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { Product, VariationProperty } from '@plentymarkets/shop-api';
import type { VariationPropertiesProps, ComponentsMapper } from './types';
import VariationPropertyText from '../VariationPropertyText/VariationPropertyText.vue';
import VariationPropertyHtml from '../VariationPropertyHtml/VariationPropertyHtml.vue';
import VariationPropertyDate from '../VariationPropertyDate/VariationPropertyDate.vue';
import VariationPropertyFile from '../VariationPropertyFile/VariationPropertyFile.vue';

const props = defineProps<VariationPropertiesProps>();
const propertyHasNameOrValue = (variationProperty: VariationProperty) => {
  return (
    productPropertyGetters.getPropertyName(variationProperty) ||
    productPropertyGetters.getPropertyValue(variationProperty)
  );
};

const variationPropertyGroups = productGetters.getPropertyGroups(props.product ?? ({} as Product));

const componentsMapper: ComponentsMapper = {
  text: VariationPropertyText,
  int: VariationPropertyText,
  float: VariationPropertyText,
  file: VariationPropertyFile,
  string: VariationPropertyText,
  html: VariationPropertyHtml,
  date: VariationPropertyDate,
};
</script>
