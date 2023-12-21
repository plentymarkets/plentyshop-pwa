<template>
  <div>
    <label>
      <span class="text-sm font-medium">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      </span>
      <SfInput :id="`prod-input-${productPropertyGetters.getOrderPropertyId(productProperty)}`"></SfInput>
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from '~/components/OrderPropertyInput/types';

const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
</script>
