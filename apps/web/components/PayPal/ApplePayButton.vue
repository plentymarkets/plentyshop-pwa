<template>
  <div id="apple-pay-button" />
</template>

<script lang="ts" setup>
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const { initialize, config, processPayment, getTransactionInfo } = useApplePay();
const { getCurrentScript } = usePayPal();
const { data: cart } = useCart();
const { locale } = useI18n();

const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();

const basketAmount = computed(() => cart.value?.basketAmount ?? 0);
const payPalScript = computed(() => getCurrentScript());

const renderButton = async () => {
  console.log('Render Apple Pay Button');
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
});

watch(basketAmount, async () => {
  await renderButton();
});

watch(payPalScript, async () => {
  await renderButton();
});
</script>
