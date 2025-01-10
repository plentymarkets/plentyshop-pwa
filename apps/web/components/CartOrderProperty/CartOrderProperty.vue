<template>
  <div v-if="property" class="ml-4">
    <span class="font-bold">
      {{ basketItemOrderParam.name }}
      <span v-if="productPropertyGetters.getOrderPropertyLabel(property).surchargeType">
        ({{ $t('orderProperties.vat.' + productPropertyGetters.getOrderPropertyLabel(property).surchargeType) }}
        {{ $n(productPropertyGetters.getOrderPropertySurcharge(property), 'currency') }})</span
      >
    </span>
    <span
      v-if="productPropertyGetters.isOrderPropertyFile(property)"
      class="cursor-pointer"
      @click="downloadPropertyFile"
    >
      <span>: {{ value }}</span>
      <SfLoaderCircular v-if="loading" class="absolute ml-2 z-[999]" size="sm" />
    </span>
    <span v-else-if="!productPropertyGetters.isOrderPropertyCheckbox(property)">: {{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CartOrderPropertyProps } from '~/components/CartOrderProperty/types';
import { cartGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

const { downloadFile } = useProductOrderProperties();
const loading = ref(false);
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

const downloadPropertyFile = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  await downloadFile(value.value);
  loading.value = false;
};
</script>
