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

    <div class="flex items-center w-full">
      <div class="w-full">
        <SfSelect
          :id="`prop-${orderPropertyId}`"
          v-model="selectedValue"
          :placeholder="`-- ${t('orderProperties.select')} --`"
        >
          <option value="">{{ t('orderProperties.noSelection') }}</option>
          <option v-for="{ value, label } in options" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfSelect } from '@storefront-ui/vue';
import { OrderPropertySelectProps } from './types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import type { OrderPropertySelectionValue } from '@plentymarkets/shop-api';
import { ref } from 'vue';

const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(orderPropertyId);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const selectedValue = ref('');

const options = Object.values(productProperty.property.selectionValues).map(
  (selection: OrderPropertySelectionValue) => ({
    label: selection.name,
    value: String(selection.id),
  }),
);

if (productPropertyGetters.isOrderPropertyPreSelected(productProperty) && Object.values(options).length > 0) {
  selectedValue.value = String(Object.values(options)[0].value);
}

watch(
  () => selectedValue.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue.trim() === '' ? null : updatedValue;
    }
  },
);
</script>
