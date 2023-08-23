<template>
  <div v-if="paypalUuid" ref="paypalButton" :id="'paypal-' + paypalUuid" class="z-0 relative paypal-button" />
</template>

<script setup lang="ts">
import { OnApproveData } from '@paypal/paypal-js';
import { orderGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { v4 as uuid } from 'uuid';
import { paypalGetters } from '~/getters/paypalGetters';

const paypalButton = ref<HTMLElement | null>(null);
const vsfCurrency = useCookie('vsf-currency').value as string;
const fallbackCurrency = useAppConfig().fallbackCurrency as string;
const currency = vsfCurrency?.length > 0 ? vsfCurrency : fallbackCurrency;

const paypalUuid = uuid();
const { loadScript, createTransaction, approveOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const { data: cart } = useCart();
const router = useRouter();

const paypal = await loadScript(currency);

const onApprove = async (data: OnApproveData) => {
  await approveOrder(data.orderID, data.payerID ?? '');

  const order = await createOrder({
    paymentId: cart.value.methodOfPaymentId,
    // eslint-disable-next-line unicorn/expiring-todo-comments
    shippingPrivacyHintAccepted: true, // TODO
  });

  await executeOrder({
    mode: 'paypal',
    plentyOrderId: Number.parseInt(orderGetters.getId(order)),
    paypalTransactionId: data.orderID,
    paypalMerchantId: paypalGetters.getMerchantId() ?? '',
  });

  if (order?.order?.id) {
    router.push('/order/success');
  } else {
    router.push('/order/failed');
  }
};

onMounted(() => {
  if (paypal) {
    const FUNDING_SOURCES = [paypal.FUNDING?.PAYPAL];

    try {
      FUNDING_SOURCES.forEach((fundingSource) => {
        if (paypal.Buttons && fundingSource) {
          const button = paypal.Buttons({
            style: {
              layout: 'vertical',
              label: 'pay',
            },
            fundingSource: fundingSource,

            async createOrder() {
              const order = await createTransaction(fundingSource);
              return order?.id ?? '';
            },

            async onApprove(data) {
              await onApprove(data);
            },
          });

          if (button.isEligible() && paypalButton.value) {
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
