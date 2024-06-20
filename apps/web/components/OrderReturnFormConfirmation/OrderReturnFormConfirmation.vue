<template>
  <div>
    <header>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="$emit('closed')">
        <SfIconClose />
      </SfButton>
    </header>
    <div class="text-2xl font-bold mb-2">{{ t('returns.returnItems') }}</div>
    <div>{{ t('returns.areYouSure') }}</div>
    <div class="my-6">
      <ul class="list-disc ml-7 font-medium">
        <template v-for="(values, variationId) in returnData.variationIds" :key="variationId">
          <li v-if="Object.keys(getItemByVariation(Number(variationId))).length > 0 && values.quantity > 0">
            {{ values.quantity }} x {{ orderGetters.getItemName(getItemByVariation(Number(variationId))) }}
          </li>
        </template>
      </ul>
    </div>
    <div class="mb-2">{{ t('returns.commentOptional') }}</div>
    <SfTextarea v-model="returnData.returnNote" :placeholder="t('returns.tellUsMore')" class="w-full block" cols="10" />
    <div class="flex flex-row justify-between mt-5">
      <SfButton @click="$emit('previous')" variant="secondary">
        <SfIconArrowBack />
        {{ t('prev') }}
      </SfButton>
      <SfButton @click="confirmReturn()" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('returns.confirmReturn') }}
        </span>
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfIconArrowBack, SfIconClose, SfLoaderCircular, SfTextarea } from '@storefront-ui/vue';
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderItem } from '@plentymarkets/shop-api';

const emit = defineEmits(['closed', 'previous']);

const localePath = useLocalePath();
const { currentReturnOrder, returnData, makeOrderReturn, loading, cleanReturnData } = useReturnOrder();
const { t } = useI18n();
const { send } = useNotification();

const getItemByVariation = (variationId: number) => {
  return (
    orderGetters
      .getItems(currentReturnOrder.value)
      .find((orderItem: OrderItem) => orderGetters.getItemVariationId(orderItem) === variationId) || ({} as OrderItem)
  );
};

const confirmReturn = async () => {
  cleanReturnData();

  await makeOrderReturn();

  send({
    type: 'positive',
    message: t('returns.successConfirmationMessage'),
  });

  navigateTo(localePath(paths.accountReturns));

  emit('closed');
};
</script>
