<template>
  <div class="flex items-center">
    <SfCheckbox
      v-if="!productPropertyGetters.isOrderPropertyHidden(productProperty)"
      :id="`prop-${orderPropertyId}`"
      v-model="value"
      class="mr-2"
    />

    <div class="flex items-center">
      <label class="cursor-pointer select-none peer-disabled:text-disabled-900" :for="`prop-${orderPropertyId}`">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
        <template v-if="orderPropertyLabel.surchargeType">
          ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
          {{ n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
        </template>
        {{ orderPropertyLabel.surchargeIndicator }}
        <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
        {{ orderPropertyLabel.requiredIndicator }}
      </label>

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyCheckboxProps } from './types';
import { SfCheckbox } from '@storefront-ui/vue';

const props = defineProps<OrderPropertyCheckboxProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(productProperty.property.id);
const value = ref<boolean>(productProperty.property.isPreSelected);
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);

if (property?.property) {
  property.property.value = productProperty.property.isPreSelected ? 'true' : null;
}

watch(
  () => value.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue ? 'true' : null;
    }
  },
);
</script>
