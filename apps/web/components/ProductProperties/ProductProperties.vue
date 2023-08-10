<template>
  <div v-if="options" class="px-4" data-testid="product-properties">
    {{ options }}
    <!-- <SfSelect
      v-for="(option, key) in options"
      :key="key"
      size="sm"
      v-e2e="'size-select'"
      class="sf-select--underlined product__select-size"
      :label="option.label"
    >
      <option v-for="(optionValue, valueKey) in option.value" :key="valueKey" :value="valueKey">
        {{ optionValue }}
      </option>
    </SfSelect> -->
  </div>
</template>

<script setup lang="ts">
// const NO_SELECTION_ID = '-1';
import Vue from 'vue';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfSelect } from '@storefront-ui/vue';
import { ProductPropertiesProps } from '~/components/ProductProperties/types';

// import { computed, reactive, ref, watch } from '@vue/composition-api';

const props = defineProps<ProductPropertiesProps>();
const product = props.product;

// const preselectAttributes = () => {
//   if (product?.variationAttributeMap) {
//     // set attribute-less variation
//     if (!product.attributes.length && Object.keys(options.value).length) {
//       for (const key in options.value) {
//         Vue.set(selectedAttributes, key, NO_SELECTION_ID);
//       }
//       // set attributes
//     } else {
//       for (const attribute of product.attributes) {
//         Vue.set(selectedAttributes, attribute.attributeId, attribute.valueId.toString());
//       }
//     }

//     // set unit
//     const variation = product.variationAttributeMap.variations.find(
//       (variation) => variation.variationId === product.variation.id,
//     );

//     if (variation) {
//       selectedUnit.value = variation.unitCombinationId.toString();
//     }
//   }
// };
// const router = useRouter();
// const route = useRoute();
// const slug = route.params.slug as string;
// const changeVariationId = (newId: String) => {
//   const delimiter = '-' as string;
//   const newLink = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + `${newId}` as String;
//   router.push({ name: route.name, params: { slug: newLink } });
// };
/// set it only if different from default !!!!
// const productId = slug.split('-').pop() ?? '0';
// const selectedVar = ref(productId);
console.log('list of products ');
const options = computed(() => {
  console.log('testing');
  console.log(productGetters.getAttributes([product]));
  return productGetters.getAttributes([product], ['color', 'size']);
});
// const units = computed(() => productGetters.getUnits(products));
// const hasEmptyOption = computed(() => {
//   return product.variationAttributeMap.variations.some((variation) => !variation.attributes.length);
// });

// const selectedAttributes = reactive({});
// const selectedUnit = ref(null);

// const selectedVariationId = computed(() =>
//   productGetters.getVariationIdForAttributes(product, selectedAttributes, selectedUnit.value),
// );
// const units = [];
// console.log(product);
// const hasEmptyOption = computed(() => {
//   return false;
// });
</script>
