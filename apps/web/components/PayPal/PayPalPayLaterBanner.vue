<template>
  <div v-if="isReady" :id="'paypal-messaging-' + paypalUuid" class="mt-2"></div>
</template>

<script setup lang="ts">
import { PayPalPayLaterBannerType } from '~/components/PayPal/types';
import { cartGetters } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { isReady, getScript } = usePayPal();
const props = defineProps<PayPalPayLaterBannerType>();

const textStylePlacements = ['product', 'cart', 'payment'];

const paypalUuid = uuid();
const isTextStyle = ref(textStylePlacements.includes(props.placement));

const renderMessage = async () => {
  const script = await getScript(currency.value, props.commit ?? false);

  if (script && script.Messages) {
    await script
      .Messages({
        amount: props.amount,
        placement: props.placement,
        style: {
          layout: isTextStyle.value ? 'text' : 'flex',
          color: isTextStyle.value ? 'white-no-border' : 'blue',
          ratio: isTextStyle.value ? undefined : '8x1',
          text: {
            color: isTextStyle.value ? 'black' : undefined,
            size: isTextStyle.value ? 12 : undefined,
          },
        },
      })
      .render('#paypal-messaging-' + paypalUuid)
      // eslint-disable-next-line no-unused-vars
      .catch((_error) => {
        console.error('Failed to render PayPal Pay Later banner', _error);
      });
  }
};

onNuxtReady(async () => {
  await renderMessage();
});

watch(
  () => currency.value,
  () => {
    renderMessage();
  },
);

watch(
  () => props.amount,
  () => {
    renderMessage();
  },
);
</script>
