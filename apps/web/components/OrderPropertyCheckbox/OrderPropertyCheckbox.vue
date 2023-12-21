<template>
  <div>
    <SfCheckbox
      :value="productPropertyGetters.getOrderPropertyId(productProperty)"
      :id="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
      class="mr-2"
    />
    <label
      class="cursor-pointer peer-disabled:text-disabled-900"
      :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
    >
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <span v-if="productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeType">
        ({{ productPropertyGetters.getOrderPropertyLabel(productProperty).surchargeType }}
        {{ n(productProperty.surcharge, 'currency') }})
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

    <slot />
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyCheckboxProps } from '~/components/OrderPropertyCheckbox/types';
import { SfCheckbox } from '@storefront-ui/vue';
const { n } = useI18n();

const props = defineProps<OrderPropertyCheckboxProps>();
const productProperty = props.productProperty;
</script>
