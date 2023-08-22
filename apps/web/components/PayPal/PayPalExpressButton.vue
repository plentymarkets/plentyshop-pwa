<template>
  <div
    v-if="paypalUuid"
    ref="paypalButton"
    :id="'paypal-' + paypalUuid"
    class="z-0 relative paypal-button"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  />
</template>

<script setup lang="ts">
import { v4 as uuid } from 'uuid';

const paypalButton = ref<HTMLElement | null>(null);
const vsfCurrency = useCookie('vsf-currency').value as string;
const fallbackCurrency = useAppConfig().fallbackCurrency as string;
const currency = vsfCurrency?.length > 0 ? vsfCurrency : fallbackCurrency;

const paypalUuid = uuid();
const disabled = true;
const { loadScript } = usePayPal();

const paypal = await loadScript(currency);

onMounted(() => {
  if (paypal) {
    const FUNDING_SOURCES = [paypal.FUNDING?.PAYPAL];

    try {
      FUNDING_SOURCES.forEach((fundingSource) => {
        if (paypal.Buttons) {
          const button = paypal.Buttons({
            style: {
              layout: 'vertical',
              label: 'buynow',
            },
            fundingSource: fundingSource,
          });

          if (button.isEligible() && paypalButton.value) {
            console.log("rendering paypal button");
            button.render('#' + paypalButton.value?.id);
          }
        }
      });
    } catch {
      // console.error('failed to render the PayPal Buttons', error);
    }
  }
});
</script>
