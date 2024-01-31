<template>
  <div>
    <header>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="$emit('close')">
        <SfIconClose />
      </SfButton>
    </header>
    <div class="text-2xl font-bold mb-2">{{ t('returns.returnItems') }}</div>
    <div>{{ t('returns.areYouSure') }}</div>
    <div class="my-6">
      <ul class="list-disc ml-7 font-medium">
        <li v-for="(quantity, variationId) in returnData.variationIds" :key="variationId">
          {{ quantity }} x {{ orderGetters.getItemName(getItemByVariation(Number(variationId))) }}
        </li>
      </ul>
    </div>
    <div class="mb-2">{{ t('returns.commentOptional') }}</div>
    <div class="w-full">
      <SfTextarea
        v-model="returnData.returnNote"
        :placeholder="t('returns.tellUsMore')"
        class="w-full block"
        cols="10"
      />
    </div>
    <div class="flex flex-row justify-between mt-5">
      <SfButton @click="$emit('close')" variant="secondary"> {{ t('returns.cancel') }} </SfButton>
      <SfButton> {{ t('returns.confirmReturn') }} </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose, SfTextarea } from '@storefront-ui/vue';
import { OrderReturnFormProps } from './types';
import { orderGetters } from '@plentymarkets/shop-sdk';

defineProps<OrderReturnFormProps>();

defineEmits(['close']);

const { currentReturnOrder, returnData } = useReturnOrder();
const { t } = useI18n();

const getItemByVariation = (variationId: number) => {
  return orderGetters
    .getItems(currentReturnOrder.value)
    .find((orderItem) => orderGetters.getItemVariationId(orderItem) === variationId);
};
</script>
