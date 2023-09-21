<template>
  <div v-if="paypalUuid" ref="paypalButton" :id="'paypal-' + paypalUuid" class="z-0 relative paypal-button" />
</template>

<script setup lang="ts">
import { OnApproveData, OnInitActions } from '@paypal/paypal-js';
import { orderGetters } from '@plentymarkets/shop-sdk';
import { v4 as uuid } from 'uuid';
import { paypalGetters } from '~/getters/paypalGetters';

const { shippingPrivacyAgreement } = useAdditionalInformation();
const paypalButton = ref<HTMLElement | null>(null);
const vsfCurrency = useCookie('vsf-currency').value as string;
const fallbackCurrency = useAppConfig().fallbackCurrency as string;
const currency = vsfCurrency?.length > 0 ? vsfCurrency : fallbackCurrency;

const paypalUuid = uuid();
const { loadScript, createTransaction, approveOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const { data: cart, clearCartItems } = useCart();
const router = useRouter();
const emits = defineEmits(['on-click']);

const props = defineProps({
  disabled: {
    type: Boolean,
  },
});

const paypal = await loadScript(currency);

const onInit = (actions: OnInitActions) => {
  actions.disable();
  watch(props, (watchProps) => {
    if (watchProps.disabled) {
      actions.disable();
    } else {
      actions.enable();
    }
  });
};

const onApprove = async (data: OnApproveData) => {
  await approveOrder(data.orderID, data.payerID ?? '');

  const order = await createOrder({
    paymentId: cart.value.methodOfPaymentId,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  });

  await executeOrder({
    mode: 'paypal',
    plentyOrderId: Number.parseInt(orderGetters.getId(order)),
    paypalTransactionId: data.orderID,
    paypalMerchantId: paypalGetters.getMerchantId() ?? '',
  });

  clearCartItems();

  if (order?.order?.id) {
    router.push('/thank-you/?orderId=' + order.order.id + '&accessKey=' + order.order.accessKey);
  }
};

onMounted(() => {
  if (paypal) {
    const FUNDING_SOURCES = [paypal.FUNDING?.PAYPAL];

    FUNDING_SOURCES.forEach((fundingSource) => {
      if (paypal.Buttons && fundingSource) {
        const button = paypal.Buttons({
          style: {
            layout: 'vertical',
            label: 'buynow',
            color: 'blue',
          },
          fundingSource: fundingSource,
          onClick() {
            emits('on-click');
          },
          onInit(data, actions) {
            onInit(actions);
          },
          // eslint-disable-next-line no-unused-vars
          onError(error) {
            // eslint-disable-next-line unicorn/expiring-todo-comments
            // TODO: handle error
          },
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
  }
});
</script>
