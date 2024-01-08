<template>
  <div class="w-full">
    <label :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`">
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <span v-if="productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeType">
        ({{ $t('orderProperties.vat.' + productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeType) }}
        {{ $n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
      </span>
      {{ productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeIndicator }}
      <span
        v-if="
          productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeIndicator &&
          productPropertyGetters.getOrderPropertyLabel(productProperty).requiredIndicator
        "
      >
        ,
      </span>
      {{ productPropertyGetters.getOrderPropertyLabel(productProperty).requiredIndicator }}
    </label>
    <div class="flex items-center w-full">
      <div class="w-full">
        <SfSelect
          :id="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
          v-model="selectedValue"
          :placeholder="`-- ${$t('orderProperties.select')} --`"
        >
          <option value="">{{ $t('orderProperties.noSelection') }}</option>
          <option v-for="{ value, label } in options" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>
      <span v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfSelect } from '@storefront-ui/vue';
import { OrderPropertySelectProps } from './types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import type { OrderPropertySelectionValue } from '@plentymarkets/shop-api';
import { ref } from 'vue';

const { getPropertyById } = useProductOrderProperties();
const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
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
const property = getPropertyById(productPropertyGetters.getOrderPropertyId(productProperty));

watch(
  () => selectedValue.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue.trim() === '' ? null : updatedValue;
    }
  },
);
</script>
