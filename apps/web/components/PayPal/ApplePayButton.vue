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
        applePayButton.addEventListener('click', async () => {
          await emits('button-clicked', async (successfully) => {
            if (successfully) {
              processPayment();
            }
          });
        });
      }
    }
  }
};

onMounted(async () => {
  await renderButton();
});
</script>
