<template>
  <div v-if="isReady" :id="'paypal-messaging-' + paypalUuid">
    <div
      v-if="bannerTextStylePlacements.includes(placement)"
      data-pp-message
      data-pp-style-layout="text"
      data-pp-style-logo-type="inline"
      data-pp-style-text-color="black"
      data-pp-style-text-size="12"
      :data-pp-amount="amount"
      :data-pp-placement="placement"
    />
    <div
      v-else-if="bannerLogoStylePlacements.includes(placement)"
      data-pp-message
      data-pp-style-color="white-no-border"
      data-pp-style-layout="flex"
      data-pp-style-ratio="8x1"
      :data-pp-amount="amount"
      :data-pp-placement="placement"
    />
  </div>
</template>

<script setup lang="ts">
import { PayPalPayLaterBannerType } from '~/components/PayPal/types';
import { cartGetters } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { isReady, getScript } = usePayPal();
defineProps<PayPalPayLaterBannerType>();

const bannerTextStylePlacements = ['product', 'cart', 'payment'];
const bannerLogoStylePlacements = ['home', 'category'];

const paypalUuid = uuid();

onMounted(() => {
  nextTick(() => {
    if (!isReady.value) {
      getScript(currency.value);
    }
  });
});

onUnmounted(() => {
  const script = document.querySelector('#paypal-messaging-' + paypalUuid);
  script?.remove();
});
</script>
