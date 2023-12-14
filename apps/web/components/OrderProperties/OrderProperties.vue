<template>
  <div v-for="(propertiesGroup, groupIndex) in productOrderPropertyGroups" :key="`group-${groupIndex}`">
    <div v-for="(groupProperty, propIndex) in propertiesGroup" :key="`group-prop-${propIndex}`">
      <template v-if="propIndex === 0">
        <div class="font-semibold">
          {{ groupProperty?.group?.names.name }}
        </div>

        <div v-if="groupProperty?.group?.names.description" class="font-normal typography-text-sm">
          {{ groupProperty?.group?.names.description }}
        </div>
      </template>

      <div v-if="!productPropertyGetters.isHidden(groupProperty.property)" class="mt-4 flex items-center">
        <SfCheckbox
          v-if="productPropertyGetters.isCheckBox(groupProperty.property)"
          v-model="checkedOrderProperties"
          :value="groupProperty.property.id"
          :id="`prop-${groupProperty.property.id}`"
        />
        <label class="ml-2 cursor-pointer peer-disabled:text-disabled-900" :for="`prop-${groupProperty.property.id}`">
          {{ groupProperty.property.names.name }}
        </label>
        <div>
          {{ productPropertyGetters.getLabel(groupProperty.property) }}
          <!-- {{ get_Tax_asterisk_on_order_property(prop) }} {{ getCost(prrice) }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from '~/components/OrderProperties/types';
import { SfCheckbox } from '@storefront-ui/vue';
import { ref, Ref } from 'vue';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const productOrderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);

const checkedOrderProperties: Ref<number[]> = ref([]);

const preCheckProperties = () => {
  if (productOrderPropertyGroups[0]) {
    checkedOrderProperties.value = productOrderPropertyGroups[0]
      .filter((property) => productPropertyGetters.alreadyChecked(property.property))
      .map((property) => property.property.id);
  }
};

preCheckProperties();

// preCheckProperties();
</script>
