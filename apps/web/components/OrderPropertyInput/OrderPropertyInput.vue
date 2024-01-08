<template>
  <div class="w-full">
    <label :for="`prop-${orderPropertyId}`">
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <template v-if="orderPropertyLabel.surchargeType">
        ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
        {{ n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
      </template>
      {{ orderPropertyLabel.surchargeIndicator }}
      <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
      {{ orderPropertyLabel.requiredIndicator }}
    </label>

    <div class="flex items-center">
      <SfInput :id="`prop-${orderPropertyId}`" v-model="value" :wrapper-class="'w-full'" />

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from './types';

const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(orderPropertyId);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);

const value = ref('');

watch(
  () => value.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue.trim() === '' ? null : updatedValue;
    }
  },
);
</script>
