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
          <OrderBankDetails v-if="bankDetails" :bank-details="bankDetails" />
        </div>

        <div
          v-if="!isAuthorized"
          class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full mt-4 text-sm items-center flex flex-col"
        >
          <div class="font-bold text-primary-700 md:text-lg text-center mt-5">
            {{ t('orderConfirmation.saveOrderToAccount') }}
          </div>
          <div class="font-bold text-center mt-3">{{ t('orderConfirmation.createAccountForBenefits') }}</div>
          <UiButton variant="primary" class="mt-5 mb-5" @click="isAuthenticationOpen = true">
            {{ t('orderConfirmation.signUp') }}
          </UiButton>
        </div>

        <OrderDocumentsList :order="order" />

        <OrderReturnItems
          v-if="orderGetters.isReturnable(order) && orderGetters.hasReturnableItems(order)"
          :order="order"
        />
        <OrderAgainButton v-if="isAuthorized" :order="order" />
      </div>
    </div>

    <UiButton :tag="NuxtLink" :href="localePath(paths.home)" class="max-md:w-full mt-6 mb-8" variant="secondary">
      {{ t('continueShopping') }}
    </UiButton>
  </div>

  <UiModal
    v-if="isAuthenticationOpen"
    v-model="isAuthenticationOpen"
    tag="section"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
    aria-labelledby="login-modal"
  >
    <header>
      <UiButton square variant="tertiary" class="absolute right-2 top-2" @click="closeAuthentication()">
        <SfIconClose />
      </UiButton>
    </header>
    <Register
      :order="order"
      :email-address="orderGetters.getOrderEmail(order)"
      :is-modal="true"
      :changeable-view="false"
      @registered="closeAuthentication"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfIconClose, useDisclosure } from '@storefront-ui/vue';
import type { ConfirmationPageContentProps } from './types';
import { paths } from '~/utils/paths';

const NuxtLink = resolveComponent('NuxtLink');
const { order } = defineProps<ConfirmationPageContentProps>();
const { t } = useI18n();
const { isOpen: isAuthenticationOpen, toggle: closeAuthentication } = useDisclosure();
const { isAuthorized } = useCustomer();
const { getActiveShippingCountries } = useActiveShippingCountries();
const localePath = useLocalePath();
const bankDetails = orderGetters.getOrderPaymentBankDetails(order);
useProcessingOrder().processingOrder.value = false;

await getActiveShippingCountries();
</script>
