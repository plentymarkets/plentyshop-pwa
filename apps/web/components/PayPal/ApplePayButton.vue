<template>
  <div id="apple-pay-button" />
</template>

<script lang="ts" setup>
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const { initialize, config, processPayment, getTransactionInfo } = useApplePay();
const { data: cart } = useCart();
const { locale } = useI18n();

const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();

const renderButton = async () => {
  if ((await initialize()) && config.value.isEligible) {
    await getTransactionInfo();
    const applePayButtonContainer = document.querySelector('#apple-pay-button');
    if (applePayButtonContainer) {
      applePayButtonContainer.innerHTML =
        '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="' + locale.value + '" />';

      const applePayButton = document.querySelector('#btn-appl');
      if (applePayButton) {
        applePayButton.addEventListener('click', () => {
          processPayment(emits);
        });
      }
    }
  }
};

onNuxtReady(async () => {
  await renderButton();

  watch(cart, async () => {
    console.log('Cart changed, re-rendering Apple Pay button');
    await renderButton();
  });
});
</script>
