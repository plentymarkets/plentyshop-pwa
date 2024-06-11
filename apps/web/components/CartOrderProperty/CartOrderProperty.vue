<template>
  <div v-if="property" class="list-item list-disc ml-4">
    <span class="font-bold">
      {{ basketItemOrderParam.name }}
      <span v-if="productPropertyGetters.getOrderPropertyLabel(property).surchargeType">
        ({{ $t('orderProperties.vat.' + productPropertyGetters.getOrderPropertyLabel(property).surchargeType) }}
        {{ $n(productPropertyGetters.getOrderPropertySurcharge(property), 'currency') }})</span
      >
    </span>
    <span v-if="!productPropertyGetters.isOrderPropertyCheckbox(property)">: {{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CartOrderPropertyProps } from '~/components/CartOrderProperty/types';
import { cartGetters, productPropertyGetters } from '@plentymarkets/shop-api';

const props = defineProps<CartOrderPropertyProps>();
const property = computed(() =>
  cartGetters.getPropertyFromCartItem(props.cartItem, Number(props.basketItemOrderParam.propertyId)),
);

const value = computed(() => {
  if (property.value && productPropertyGetters.isOrderPropertySelection(property.value)) {
    const selection = property.value.property.selectionValues[Number(props.basketItemOrderParam.value)];
    return selection ? selection.name : '';
  }
  return props.basketItemOrderParam.value;
});
</script>
