<template>
  <div v-for="(propertiesGroup, groupIndex) in orderPropertiesGroups" :key="`group-${groupIndex}`">
    <div v-for="(groupProperty, propIndex) in propertiesGroup" :key="`group-prop-${propIndex}`">
      <template v-if="propIndex === 0">
        <div class="font-semibold">
          {{ groupProperty?.group?.names.name }}
        </div>

        <div v-if="groupProperty?.group?.names.description" class="font-normal typography-text-sm">
          {{ groupProperty?.group?.names.description }}
        </div>
      </template>

      <div class="mt-4 flex items-center">
        <SfCheckbox :id="`prop-${groupProperty.property.id}`" />
        <label class="ml-2 cursor-pointer peer-disabled:text-disabled-900" :for="`prop-${groupProperty.property.id}`">
          {{ groupProperty.property.names.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from '~/components/OrderProperties/types';
import { SfCheckbox } from '@storefront-ui/vue';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const orderPropertiesGroups = productPropertyGetters.getOrderPropertiesGroups(product);
</script>
