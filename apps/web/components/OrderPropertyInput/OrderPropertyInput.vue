<template>
  <div class="w-full">
    <label :for="`prod-input-${productPropertyGetters.getOrderPropertyId(productProperty)}`">
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

    <div class="flex items-center">
      <SfInput
        :id="`prod-input-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
        v-model="value"
        :wrapper-class="'w-full'"
      />

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

const { getPropertyById } = useProductOrderProperties();
const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const property = getPropertyById(productPropertyGetters.getOrderPropertyId(productProperty));

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
