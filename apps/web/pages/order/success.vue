<template>
  <div class="px-4 md:px-0" data-testid="order-success-page" v-if="orderData.order">
    <div
      class="border border-1 border-neutral-200 mt-10 mb-20 rounded p-4 md:p-6 flex flex-col items-center max-w-2xl mx-auto"
    >
      <NuxtImg src="/images/order-success.svg" :alt="$t('orderSuccessfulImageAlt')" width="192" height="192" />
      <h1 class="mt-6 mb-1 text-2xl">{{ $t('successInfoHeader') }}</h1>
      <span class="font-medium">{{ $t('successInfoMessage') }}</span>
      <span v-if="orderData.order.deliveryAddress.options.length > 0" class="font-medium">{{
        $t('orderConfirmation.confirmationSendTo', { email: getEmail() })
      }}</span>
      <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
        <h2 class="font-medium text-base">{{ $t('orderNumber') }}</h2>
        <p>{{ orderData.order.id }}</p>
      </div>
      <SfButton :tag="NuxtLink" href="/" class="max-md:w-full" variant="secondary">
        {{ $t('continueShopping') }}
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
import {AddressOption} from "@plentymarkets/plentymarkets-sdk/packages/api-client/src/types/api/address";

const NuxtLink = resolveComponent('NuxtLink');
const { data: orderData } = useMakeOrder();
const router = useRouter();

if (!orderData.value.order) {
  router.push('/');
}

const getEmail = (): string => {
  if (orderData.value.order.deliveryAddress.options.length > 0) {
    return (
      orderData.value.order.deliveryAddress.options.find((option: AddressOption) => option.typeId === 5)?.value ?? ''
    );
  }

  return '';
};

definePageMeta({
  layout: 'order',
});
</script>
