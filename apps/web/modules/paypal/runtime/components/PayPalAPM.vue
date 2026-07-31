<template>
  <div v-if="paypalUuid" :id="'paypal-' + paypalUuid" ref="paypalButton" class="z-base relative paypal-button" />

  <div
    v-if="processingOrder"
    class="fixed top-0 left-0 bg-black bg-opacity-75 bottom-0 right-0 !z-dropdown flex items-center justify-center flex-col"
  >
    <div class="text-white mb-4">{{ t('checkout.googlePay.paymentInProgress') }}</div>
    <SfLoaderCircular class="flex justify-center items-center" size="lg" />
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type { PayPalNamespace, FUNDING_SOURCE, OnApproveData, OnInitActions } from '@paypal/paypal-js';
import type { PayPalAddToCartCallback, PaypalAPMPropsType } from '../types';
import { PayPalAlternativeFundingSourceMapper } from '../types';
import { SfLoaderCircular } from '@storefront-ui/vue';
import { usePayPal } from '../composables/usePayPal';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = ref(useId());
const paypalScript = ref<PayPalNamespace | null>(null);

const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
const {
  order: paypalOrder,
  getScript,
  createTransaction,
  captureOrder,
  createPlentyOrder,
  createPlentyPaymentFromPayPalOrder,
  getOrder,
} = usePayPal();
const { data: cart, clearCartItems } = useCart();
const { emit } = usePlentyEvent();

const successPaymentStatuses = new Set(['APPROVED', 'COMPLETED']);
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const localePath = useLocalizedPath();

const emits = defineEmits<{
  (event: 'validation-callback', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-approved' | 'on-payed'): void;
}>();

const props = defineProps<PaypalAPMPropsType>();
const currentInstance = getCurrentInstance();
const showError = ref(false);

const checkonValidationCallbackEvent = (): boolean => {
  const props = currentInstance?.vnode.props;

  return !!(props && props['onValidationCallback']);
};

const onInit = (actions: OnInitActions) => {
  props.disabled ? actions.disable() : actions.enable();
  watch(props, (propertyValues) => {
    if (propertyValues.disabled) {
      actions.disable();
    } else {
      actions.enable();
    }
  });
};

const createOrderFlow = async (data: OnApproveData) => {
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
    await navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
  } else {
    processingOrder.value = false;
    useNotification().send({
      message: t('error.paymentFailed'),
      type: 'negative',
    });
  }
};

const orderExistingFlow = async (data: OnApproveData) => {
  if (!paypalOrder.value?.isAutocaptured) {
    await captureOrder(data.orderID);
  }
  await createPlentyPaymentFromPayPalOrder(data.orderID, props.order!.order.id);
  emits('on-payed');
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
  processingOrder.value = true;
  emits('on-approved');

  const payPalOrder = await getOrder(data.orderID);

  if (payPalOrder?.result?.status && successPaymentStatuses.has(payPalOrder.result.status)) {
    if (props.order) {
      await orderExistingFlow(data);
    } else {
      await createOrderFlow(data);
    }
  } else {
    processingOrder.value = false;
    useNotification().send({
      message: t('error.paymentFailed'),
      type: 'negative',
    });
  }
};

const renderButton = (fundingSource: FUNDING_SOURCE) => {
  if (paypalScript.value?.Buttons && fundingSource) {
    const button = paypalScript.value?.Buttons({
      fundingSource: fundingSource,
      style: {
        label: 'buynow',
      },
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
      async onError(error) {
        if (showError.value) {
          useNotification().send({
            message: error?.toString() || t('error.paymentFailed'),
            type: 'negative',
          });
          await useCartStockReservation().unreserve();
        }
      },
      async onCancel() {
        useNotification().send({
          message: t('error.paymentCancelled'),
          type: 'negative',
        });
        await useCartStockReservation().unreserve();
      },
      async createOrder() {
        showError.value = true;
        const order = await createTransaction({
          type: props.order ? 'order' : 'basket',
          plentyOrderId: props.order?.order?.id,
        });

        if (order?.id) {
          if (!props.order) {
            if (!(await useCartStockReservation().reserve())) {
              return '';
            }
          }

          return order.id;
        }
        return '';
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

    if (props.paymentKey) {
      const paymentKey = props.paymentKey as keyof typeof PayPalAlternativeFundingSourceMapper;
      const fundingSourceValue = PayPalAlternativeFundingSourceMapper[paymentKey];
      if (!fundingSourceValue) {
        return;
      }
      const FUNDING_SOURCES = [fundingSourceValue] as FUNDING_SOURCE[];
      FUNDING_SOURCES.forEach((fundingSource) => renderButton(fundingSource));
    }
  }
};

onNuxtReady(async () => {
  paypalScript.value = await getScript(currency.value, true);
  createButton();
});

watch(currency, async () => {
  paypalScript.value = await getScript(currency.value, true);
  createButton();
});
</script>
