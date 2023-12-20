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
        {{ $n(productProperty.surcharge, 'currency') }})
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

    <template v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty)">
      <SfTooltip
        :label="productPropertyGetters.getOrderPropertyDescription(productProperty)"
        :placement="'bottom'"
        :show-arrow="true"
        class="ml-2"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyChecboxProps } from '~/components/OrderPropertyCheckbox/types';
import { SfCheckbox, SfTooltip, SfIconInfo } from '@storefront-ui/vue';

const props = defineProps<OrderPropertyChecboxProps>();
const productProperty = props.productProperty;
</script>
