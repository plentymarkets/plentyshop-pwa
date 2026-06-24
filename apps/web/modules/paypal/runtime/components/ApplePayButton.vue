<template>
  <div id="apple-pay-button" />
</template>

<script lang="ts" setup>
import type { PayPalCreditPropsType } from '../types';
import { usePayPal } from '../composables/usePayPal';
import type { ButtonClickedEmits } from '~/composables/useApplePay/types';

const { initialize, config, processPayment, getTransactionInfo } = useApplePay();
const { getCurrentScript } = usePayPal();
const { data: cart } = useCart();
const { locale } = useI18n();

const props = defineProps<PayPalCreditPropsType>();
const emits = defineEmits<ButtonClickedEmits>();

const basketAmount = computed(() => cart.value?.basketAmount ?? 0);
const payPalScript = computed(() => getCurrentScript());

const renderButton = async () => {
  if ((await initialize()) && config.value.isEligible) {
    await getTransactionInfo(props.order?.order?.id);
    const applePayButtonContainer = document.querySelector('#apple-pay-button');
    if (applePayButtonContainer) {
      applePayButtonContainer.innerHTML =
        '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="' + locale.value + '" />';

      const applePayButton = document.querySelector('#btn-appl');
      if (applePayButton) {
        applePayButton.addEventListener('click', () => {
          processPayment(emits, props.order);
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
