<template>
  <div class="px-4 md:px-0 flex items-center flex-col" data-testid="order-success-page">
    <div class="p-4 md:p-6 flex flex-col items-center max-w-2xl mx-auto">
      <NuxtImg src="/images/order-success.svg" :alt="t('orderSuccessfulImageAlt')" width="192" height="192" />
      <h1 class="mt-6 mb-1 text-2xl" data-testid="success-header">
        {{ !orderGetters.isReturn(order) ? t('successInfoOrderHeader') : t('successInfoReturnHeader') }}
      </h1>
      <span v-if="!orderGetters.isReturn(order)" class="font-medium">{{ t('successInfoMessage') }}</span>
      <span v-if="order?.order?.deliveryAddress?.options?.length" class="font-medium text-center">
        {{ t('orderConfirmation.confirmationSendTo', { email: orderGetters.getOrderEmail(order) }) }}
      </span>
    </div>

    <div class="flex flex-col md:flex-row w-full md:w-auto lg:w-3/4 flex-wrap gap-x-6">
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderDetails :order="order" />
        </div>

        <div v-if="order?.order" id="order-items" class="flex flex-col my-4">
          <OrderSummaryProductCard
            v-for="(item, index) in orderGetters.getItems(order)"
            :order="order"
            :order-item="item"
            :index="index"
            :key="item.id"
          />
        </div>

        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderTotals :order="order" />
        </div>
      </div>
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderShippingSummary :order="order" />
          <OrderPaymentSummary :order="order" />
        </div>

        <OrderDocumentsList :order="order" />

        <OrderReturnItems
          v-if="orderGetters.isReturnable(order) && orderGetters.hasReturnableItems(order)"
          :order="order"
        />
      </div>
    </div>

    <SfButton :tag="NuxtLink" href="/" class="max-md:w-full mt-6 mb-8" variant="secondary">
      {{ t('continueShopping') }}
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';
import { ConfirmationPageContentProps } from './types';

const NuxtLink = resolveComponent('NuxtLink');
defineProps<ConfirmationPageContentProps>();
const { t } = useI18n();
const { getActiveShippingCountries } = useActiveShippingCountries();

await getActiveShippingCountries();
</script>
