<template>
  <div id="apple-pay-button" />
</template>

<script lang="ts" setup>
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const { initialize, config, processPayment } = useApplePay();
const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();

const renderButton = async () => {
  if ((await initialize()) && config.value.isEligible) {
    const applePayButtonContainer = document.querySelector('#apple-pay-button');
    if (applePayButtonContainer) {
      applePayButtonContainer.innerHTML =
        '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en" />';

      const applePayButton = document.querySelector('#btn-appl');
      if (applePayButton) {
        applePayButton.addEventListener('click', () => {
          console.log('Apple Pay button clicked');
          processPayment(emits);
          console.log('Apple Pay button event listener added');
        });
      }
    }
  }
};

onMounted(async () => {
  await renderButton();
});
</script>
