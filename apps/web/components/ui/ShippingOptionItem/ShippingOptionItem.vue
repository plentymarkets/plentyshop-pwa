<template>
  <div class="realtive pb-4">
    <h1 class="font-bold text-lg ml-4 mt-6">{{ t('delivery') }}</h1>
    <div class="w-auto max-w-[400px] min-w-[250px] flex justify-between border rounded-md p-2 m-2">
      <div class="flex items-center flex-row gap-2">
        <SfRadio :checked="props.checked" class="mr-2 flex items-center" />
        <span>{{ props.shippingName }}</span>
      </div>
      <span class="ml-auto flex items-center">{{ getShippingAmount(props.shippingCost) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingOptionItemProps } from './types';
import { SfRadio } from '@storefront-ui/vue';

const { t, n } = useI18n();
const props = defineProps<ShippingOptionItemProps>();

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : n(amount, 'currency');
};
</script>
