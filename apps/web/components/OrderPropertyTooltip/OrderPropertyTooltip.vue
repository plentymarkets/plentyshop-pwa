<template>
  <SfTooltip
    :label="productPropertyGetters.getOrderPropertyDescription(productProperty)"
    :placement="'bottom'"
    :show-arrow="true"
    class="ml-2"
  >
    <SfIconInfo :size="'sm'" />
  </SfTooltip>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyTooltipProps } from './types';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const props = defineProps<OrderPropertyTooltipProps>();
const productProperty = props.productProperty;
</script>
