<template>
  <div v-for="(group, groupIndex) in productOrderPropertyGroups" :key="`group-${groupIndex}`" class="mt-5">
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
          :product-property="productProperty"
        />
        <OrderPropertyInput
          v-if="
            productPropertyGetters.isOrderPropertyInt(productProperty) ||
            productPropertyGetters.isOrderPropertyText(productProperty) ||
            productPropertyGetters.isOrderPropertyFloat(productProperty)
          "
          :product-property="productProperty"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from '~/components/OrderProperties/types';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const productOrderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);
</script>
