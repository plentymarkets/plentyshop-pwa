<template>
  <div v-if="paypalUuid" ref="paypalButton" :id="'paypal-' + paypalUuid" class="z-0 relative paypal-button" />
</template>

<script setup lang="ts">
import { orderGetters, cartGetters } from '@plentymarkets/shop-api';
import type { FUNDING_SOURCE, OnApproveData, OnInitActions, PayPalNamespace } from '@paypal/paypal-js';
import { v4 as uuid } from 'uuid';
import type { PayPalAddToCartCallback, PaypalButtonPropsType } from '~/components/PayPal/types';

const paypalButton = ref<HTMLElement | null>(null);
const { loadScript, createTransaction, approveOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { data: cart, clearCartItems } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const localePath = useLocalePath();
const emits = defineEmits<{
  (event: 'on-click', callback: PayPalAddToCartCallback): Promise<void>;
}>();

const props = withDefaults(defineProps<PaypalButtonPropsType>(), {
  disabled: false,
});
const { type, disabled } = toRefs(props);
const currentInstance = getCurrentInstance();

const TypeCartPreview = 'CartPreview';
const TypeSingleItem = 'SingleItem';
const TypeCheckout = 'Checkout';

const isCommit = type.value === TypeCheckout;
const paypalUuid = ref();
const paypalScript = ref<PayPalNamespace | null>(await loadScript(currency.value, isCommit));

const checkOnClickEvent = (): boolean => {
  const props = currentInstance?.vnode.props;

  return !!(props && props['onOnClick']);
};

const onInit = (actions: OnInitActions) => {
  if (type.value === TypeCheckout) {
    disabled.value ? actions.disable() : actions.enable();
    watch(disabled, () => (disabled.value ? actions.disable() : actions.enable()));
  } else {
    actions.enable();
  }
};

const onClick = async () => {
  return await new Promise<boolean>((resolve) => {
    if (!checkOnClickEvent()) {
      resolve(true);
    }
    emits('on-click', async (successfully) => {
      resolve(successfully);
    });
  });
};

const onApprove = async (data: OnApproveData) => {
  const result = await approveOrder(data.orderID, data.payerID ?? '');

  if ((type.value === TypeCartPreview || type.value === TypeSingleItem) && result?.url)
    navigateTo(localePath(paths.readonlyCheckout + `/?payerId=${data.payerID}&orderId=${data.orderID}`));

  if (type.value === TypeCheckout) {
    const order = await createOrder({
      paymentId: cart.value.methodOfPaymentId,
      shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    });

    await executeOrder({
      mode: 'paypal',
      plentyOrderId: Number.parseInt(orderGetters.getId(order)),
      paypalTransactionId: data.orderID,
    });

    clearCartItems();

    if (order?.order?.id)
      navigateTo(localePath(paths.thankYou + '/?orderId=' + order.order.id + '&accessKey=' + order.order.accessKey));
  }
};

const renderButton = (fundingSource: FUNDING_SOURCE) => {
  if (paypalScript.value?.Buttons && fundingSource) {
    const button = paypalScript.value?.Buttons({
      style: {
        layout: 'vertical',
        label: type.value === TypeCartPreview || type.value === TypeSingleItem ? 'checkout' : 'buynow',
        color: 'blue',
      },
      fundingSource: fundingSource,
      async onClick(data, actions) {
        const success = await onClick();
        if (!success) {
          return actions.reject();
        }
        return actions.resolve();
      },
      onInit(data, actions) {
        onInit(actions);
      },
      onError() {
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

    if (button.isEligible() && paypalButton.value) button.render('#' + paypalButton.value.id);
  }
};

const createButton = () => {
  if (paypalScript.value) {
    if (paypalButton.value) {
      paypalButton.value.innerHTML = '';
    }
    const FUNDING_SOURCES = [paypalScript.value.FUNDING?.PAYPAL, paypalScript.value.FUNDING?.PAYLATER];
    FUNDING_SOURCES.forEach((fundingSource) => renderButton(fundingSource as FUNDING_SOURCE));
  }
};

const bindUuid = async () => (paypalUuid.value = uuid());

onMounted(async () => await bindUuid().then(() => createButton()));

watch(currency, async () => {
  paypalScript.value = await loadScript(currency.value, isCommit);
  createButton();
});
</script>
