<template>
  <div class="flex flex-col">
    <label :for="`prod-input-${productPropertyGetters.getOrderPropertyId(productProperty)}`">
      <UiFormLabel>{{ productPropertyGetters.getOrderPropertyName(productProperty) }}</UiFormLabel>
    </label>

    <div class="flex items-center">
      <SfInput
        :id="`prod-input-${productPropertyGetters.getOrderPropertyId(productProperty)}`"
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
import { OrderPropertyInputProps } from '~/components/OrderPropertyInput/types';

const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
</script>
