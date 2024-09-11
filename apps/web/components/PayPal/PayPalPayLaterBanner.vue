<template>
  <div v-if="isReady" :id="'paypal-messaging-' + paypalUuid"></div>
</template>

<script setup lang="ts">
import { PayPalPayLaterBannerType } from '~/components/PayPal/types';
import { cartGetters } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { isReady, getScript } = usePayPal();
const props = defineProps<PayPalPayLaterBannerType>();

const bannerTextStylePlacements = ['product', 'cart', 'payment'];

const paypalUuid = uuid();
const isTextStyle = ref(bannerTextStylePlacements.includes(props.placement));

const renderMessage = async () => {
  await nextTick(async () => {
    const script = await getScript(currency.value);

    if (script && script.Messages) {
      await script
        .Messages({
          amount: props.amount,
          placement: props.placement,
          style: {
            layout: isTextStyle ? 'text' : 'flex',
            color: isTextStyle ? undefined : 'white-no-border',
            ratio: isTextStyle ? undefined : '8x1',
            text: {
              color: isTextStyle ? 'black' : undefined,
              size: isTextStyle ? 12 : undefined,
            },
          },
        })
        .render('#paypal-messaging-' + paypalUuid)
        // eslint-disable-next-line no-unused-vars
        .catch((_error) => {
          console.error('Failed to render PayPal Pay Later banner', _error);
        });
    }
  });
};

const removeMessage = () => {
  const message = document.querySelector('#paypal-messaging-' + paypalUuid);
  message?.setHTMLUnsafe('');
};

onMounted(() => {
  renderMessage();
});

onUnmounted(() => {
  removeMessage();
});

watch(
  () => currency.value,
  () => {
    renderMessage();
  },
);
</script>
