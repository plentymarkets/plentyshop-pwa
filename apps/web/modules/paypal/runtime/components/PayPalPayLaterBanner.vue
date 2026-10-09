<template>
  <div v-if="isReady" :id="'paypal-messaging-' + paypalUuid" class="mt-2" />
  <div>Test 1</div>
</template>

<script setup lang="ts">
import type { PayPalPayLaterBannerType } from '../types';
import { cartGetters } from '@plentymarkets/shop-api';
import type { PayPalNamespace } from '@paypal/paypal-js';
import { useDebounceFn } from '@vueuse/core';
import { usePayPal } from '../composables/usePayPal';

const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { isReady, getScript, loadConfig, payLaterVisibility } = usePayPal();
const { placement, amount, location, commit = false } = defineProps<PayPalPayLaterBannerType>();
const textStylePlacements = ['product', 'cart', 'payment'];
const paypalUuid = useId();
const isTextStyle = ref(textStylePlacements.includes(placement));
const loadScript = computed(() => payLaterVisibility.getVisibility(location));
const watchAmount = computed(() => amount);
let renderSequence = 0;

const renderPayPalMessage = async (script: PayPalNamespace | null) => {
  const isEligible = script
    ?.Buttons?.({
      fundingSource: script?.FUNDING?.PAYLATER,
    })
    .isEligible();
  if (script?.Messages && isEligible) {
    const message = script.Messages({
      amount: amount,
      placement: placement,
      style: {
        layout: isTextStyle.value ? 'text' : 'flex',
        color: isTextStyle.value ? 'white-no-border' : 'blue',
        ratio: isTextStyle.value ? undefined : '8x1',
        text: {
          color: isTextStyle.value ? 'black' : undefined,
          size: isTextStyle.value ? 12 : undefined,
        },
      },
    });

    const banner = document.querySelector('#paypal-messaging-' + paypalUuid);
    if (banner) await message.render('#' + banner.id);
  }
};

const renderMessage = async () => {
  const sequence = ++renderSequence;
  await loadConfig();
  if (!loadScript.value) return;
  await getScript(currency.value, commit)
    .then(async (script) => {
      if (sequence !== renderSequence) return;
      await renderPayPalMessage(script);
    })
    .catch((error) => useHandleError(error));
};

const debouncedRenderMessage = useDebounceFn(renderMessage, 300);

onNuxtReady(async () => {
  await renderMessage();

  watch([currency, watchAmount, loadScript], async () => {
    await debouncedRenderMessage();
  });
});
</script>
