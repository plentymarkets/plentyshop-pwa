<template>
  <div v-for="(group, groupIndex) in productOrderPropertyGroups" :key="`group-${groupIndex}`">
    <div class="font-semibold">
      {{ group.name }}
    </div>

    <div v-if="group.description" class="font-normal typography-text-sm">
      {{ group.description }}
    </div>

    <div v-for="(productProperty, propIndex) in group.orderProperties" :key="`group-prop-${propIndex}`">
      <div v-if="!productPropertyGetters.isHidden(productProperty.property)" class="mt-4 flex items-center">
        <SfCheckbox
          v-if="productPropertyGetters.isCheckBox(productProperty.property)"
          :value="productPropertyGetters.getOrderPropertyId(productProperty.property)"
          :id="`prop-${productPropertyGetters.getOrderPropertyId(productProperty.property)}`"
        />
        <label
          class="ml-2 cursor-pointer peer-disabled:text-disabled-900"
          :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty.property)}`"
        >
          {{ productPropertyGetters.getOrderPropertyName(productProperty.property) }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from '~/components/OrderProperties/types';
import { SfCheckbox } from '@storefront-ui/vue';
// import { ref, Ref } from 'vue';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const productOrderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);

// const checkedOrderProperties: Ref<number[]> = ref([]);

// const preCheckProperties = () => {
//   if (Object.values(productOrderPropertyGroups)[0]) {
//     checkedOrderProperties.value = Object.values(productOrderPropertyGroups)[0]
//       .filter((property) => productPropertyGetters.isChecked(property.property))
//       .map((property) => property.property.id);
//   }
// };

// preCheckProperties();
</script>
