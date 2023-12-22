<template>
  <div v-for="(group, groupIndex) in orderPropertiesGroups" :key="`group-${groupIndex}`" class="mt-5">
    <div class="font-semibold">
      {{ productPropertyGetters.getOrderPropertyGroupName(group) }}
    </div>

    <div class="font-normal typography-text-sm">
      {{ productPropertyGetters.getOrderPropertyGroupDescription(group) }}
    </div>

    <div v-for="(productProperty, propIndex) in group.orderProperties" :key="`group-prop-${propIndex}`">
      <div v-if="!productPropertyGetters.isOrderPropertyHidden(productProperty)" class="mt-1 flex items-center">
        <OrderPropertyCheckbox
          v-if="productPropertyGetters.isOrderPropertyCheckbox(productProperty)"
          :has-tooltip="hasTooltip"
          :product-property="productProperty"
        >
          <template #tooltip v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty)">
            <OrderPropertyTooltip :product-property="productProperty" />
          </template>
        </OrderPropertyCheckbox>

        <OrderPropertyInput
          v-if="productPropertyGetters.isOrderPropertyInput(productProperty)"
          :has-tooltip="hasTooltip"
          :product-property="productProperty"
        >
          <template #tooltip v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty)">
            <OrderPropertyTooltip :product-property="productProperty" />
          </template>
        </OrderPropertyInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from './types';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const orderPropertiesGroups = productPropertyGetters.getOrderPropertiesGroups(product);
const hasTooltip = productPropertyGetters.hasOrderPropertiesGroupsTooltips(orderPropertiesGroups);
</script>
