<template>
  <div v-for="(group, groupIndex) in variationProperties" :key="`group-${groupIndex}`" class="mt-5">
    <div
      v-for="(variationProperty, propIndex) in group.properties"
      :key="`group-prop-${propIndex}`"
      class="mt-2 flex items-center"
    >
      <ClientOnly>
        <Component
          v-if="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
          :variation-property="variationProperty"
          :is="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
        >
        </Component>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { Product } from '@plentymarkets/shop-api';
import type { VariationPropertiesProps, ComponentsMapper } from './types';
import VariationPropertyText from '~/components/VariationPropertyText/VariationPropertyText.vue';
import VariationPropertyHtml from '~/components/VariationPropertyHtml/VariationPropertyHtml.vue';
import VariationPropertyDate from '~/components/VariationPropertyDate/VariationPropertyDate.vue';

const props = defineProps<VariationPropertiesProps>();
const variationProperties = productGetters.getPropertyGroups(props.product ?? ({} as Product));

const componentsMapper: ComponentsMapper = {
  text: VariationPropertyText,
  int: VariationPropertyText,
  float: VariationPropertyText,
  string: VariationPropertyText,
  html: VariationPropertyHtml,
  date: VariationPropertyDate,
};
</script>
