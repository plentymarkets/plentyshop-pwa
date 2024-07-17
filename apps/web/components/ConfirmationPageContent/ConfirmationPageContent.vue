<template>
  <div class="px-4 md:px-0 flex items-center flex-col" data-testid="order-success-page">
    <div class="p-4 md:p-6 flex flex-col max-w-2xl mx-auto">
      <h1 class="mt-6 mb-1 text-2xl text-center" data-testid="success-header">
        {{ !orderGetters.isReturn(order) ? t('successInfoOrderHeader') : t('successInfoReturnHeader') }}
      </h1>
      <div v-if="!orderGetters.isReturn(order)" class="font-medium text-center">{{ t('successInfoMessage') }}</div>
      <div v-if="order?.order?.deliveryAddress?.options?.length" class="font-medium text-center">
        {{ t('orderConfirmation.confirmationSendTo', { email: orderGetters.getOrderEmail(order) }) }}
      </div>
    </div>

    <div class="flex flex-col md:flex-row w-full md:w-auto lg:w-3/4 flex-wrap gap-x-6">
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderDetails :order="order" />
        </div>

        <div v-if="order?.order" id="order-items" class="flex flex-col my-4">
          <div v-for="(item, index) in orderGetters.getItems(order)" :key="item.id">
            <OrderSummaryProductCard
              v-if="!orderGetters.isBundleItem(item) && !orderGetters.isCouponItem(item)"
              :order="order"
              :order-item="item"
              :index="index"
              :class="{ 'border-t': index === 0 }"
            />
          </div>
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
        <OrderAgainButton :order="order" />
      </div>
    </div>

    <SfButton :tag="NuxtLink" :href="localePath(paths.home)" class="max-md:w-full mt-6 mb-8" variant="secondary">
      {{ t('continueShopping') }}
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfButton } from '@storefront-ui/vue';
import type { ConfirmationPageContentProps } from './types';

const NuxtLink = resolveComponent('NuxtLink');
defineProps<ConfirmationPageContentProps>();
const { t } = useI18n();
const { getActiveShippingCountries } = useActiveShippingCountries();
const localePath = useLocalePath();

await getActiveShippingCountries();
</script>
