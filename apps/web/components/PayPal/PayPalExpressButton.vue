<template>
  <div v-if="paypalUuid" :id="'paypal-' + paypalUuid" ref="paypalButton" class="z-0 relative paypal-button" />
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type { PayPalNamespace, FUNDING_SOURCE, OnApproveData, OnInitActions } from '@paypal/paypal-js';
import { v4 as uuid } from 'uuid';
import type { PayPalAddToCartCallback, PaypalButtonPropsType } from '~/components/PayPal/types';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = ref(uuid());
const paypalScript = ref<PayPalNamespace | null>(null);

const {
  order: paypalOrder,
  getScript,
  createTransaction,
  captureOrder,
  createPlentyOrder,
  createPlentyPaymentFromPayPalOrder,
} = usePayPal();
const { data: cart, clearCartItems } = useCart();
const { emit } = usePlentyEvent();

const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const localePath = useLocalePath();

const emits = defineEmits<{
  (event: 'validation-callback', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-approved'): void;
}>();

const props = defineProps<PaypalButtonPropsType>();
const currentInstance = getCurrentInstance();

const TypeCartPreview = 'CartPreview';
const TypeSingleItem = 'SingleItem';
const TypeCheckout = 'Checkout';

const isCommit = props.type === TypeCheckout;

const checkonValidationCallbackEvent = (): boolean => {
  const props = currentInstance?.vnode.props;

  return !!(props && props['onValidationCallback']);
};

const onInit = (actions: OnInitActions) => {
  if (props.type === TypeCheckout) {
    props.disabled ? actions.disable() : actions.enable();
    watch(props, (propertyValues) => {
      if (propertyValues.disabled) {
        actions.disable();
      } else {
        actions.enable();
      }
    });
  } else {
    actions.enable();
  }
};

const onValidationCallback = async () => {
  return await new Promise<boolean>((resolve) => {
    if (!checkonValidationCallbackEvent()) {
      resolve(true);
    }
    emits('validation-callback', async (successfully) => {
      resolve(successfully);
    });
  });
};

const onApprove = async (data: OnApproveData) => {
  emits('on-approved');

  if (props.type === TypeCartPreview || props.type === TypeSingleItem)
    navigateTo(localePath(paths.readonlyCheckout + `/?payerId=${data.payerID}&orderId=${data.orderID}`));

  if (props.type === TypeCheckout) {
    useProcessingOrder().processingOrder.value = true;
    const order = await createPlentyOrder();

    if (order) {
      if (!paypalOrder.value?.isAutocaptured) {
        await captureOrder(data.orderID);
      }
      await createPlentyPaymentFromPayPalOrder(data.orderID, order.order.id);
    }

    emit('module:clearCart', null);
    clearCartItems();

    if (order?.order?.id) {
      emit('frontend:orderCreated', order);
      navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
    }
  }
};

const renderButton = (fundingSource: FUNDING_SOURCE) => {
  if (paypalScript.value?.Buttons && fundingSource) {
    const button = paypalScript.value?.Buttons({
      style: {
        layout: 'vertical',
        label: props.type === TypeCartPreview || props.type === TypeSingleItem ? 'checkout' : 'buynow',
        color: 'gold',
      },
      fundingSource: fundingSource,
      async onClick(data, actions) {
        const success = await onValidationCallback();
        if (!success) {
          return actions.reject();
        }
        return actions.resolve();
      },
      onInit(data, actions) {
        onInit(actions);
      },
      onError() {
        // TODO: handle error
      },
      async createOrder() {
        const order = await createTransaction({
          type: isCommit ? 'basket' : 'express',
        });
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

onNuxtReady(async () => {
  paypalScript.value = await getScript(currency.value, isCommit);
  createButton();
});

watch(currency, async () => {
  paypalScript.value = await getScript(currency.value, isCommit);
  createButton();
});
</script>
