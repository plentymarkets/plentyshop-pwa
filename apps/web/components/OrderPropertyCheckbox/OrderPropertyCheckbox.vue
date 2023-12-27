<template>
  <div class="flex items-center">
    <SfCheckbox
      :id="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
      v-model="value"
      class="mr-2"
    />
    <label
      class="cursor-pointer peer-disabled:text-disabled-900"
      :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
    >
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
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyCheckboxProps } from '~/components/OrderPropertyCheckbox/types';
import { SfCheckbox } from '@storefront-ui/vue';

const props = defineProps<OrderPropertyCheckboxProps>();
const productProperty = props.productProperty;
const { getPropertyById } = useProductOrderProperties();

const property = getPropertyById(productProperty.property.id);
const value = ref<boolean>(productProperty.property.isPreSelected);

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
