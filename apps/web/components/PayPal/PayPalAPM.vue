<template>
  <div v-if="paypalUuid" :id="'paypal-' + paypalUuid" ref="paypalButton" class="z-0 relative paypal-button" />

  <div
    v-if="processingOrder"
    class="fixed top-0 left-0 bg-black bg-opacity-75 bottom-0 right-0 !z-50 flex items-center justify-center flex-col"
  >
    <div class="text-white mb-4">{{ t('googlePay.paymentInProgress') }}</div>
    <SfLoaderCircular class="flex justify-center items-center" size="lg" />
  </div>
</template>

<script setup lang="ts">
import { cartGetters, paymentProviderGetters } from '@plentymarkets/shop-api';
import type { PayPalNamespace, FUNDING_SOURCE, OnApproveData, OnInitActions } from '@paypal/paypal-js';
import { v4 as uuid } from 'uuid';
import type { PayPalAddToCartCallback, PaypalAPMPropsType } from '~/components/PayPal/types';
import { PayPalAlternativeFundingSourceMapper } from '~/composables';
import { SfLoaderCircular } from '@storefront-ui/vue';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = ref(uuid());
const paypalScript = ref<PayPalNamespace | null>(null);
const { t } = useI18n();

const { processingOrder } = useProcessingOrder();
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
const { data: paymentMethods } = usePaymentMethods();
const { emit } = usePlentyEvent();

const successPaymentStatuses = ['APPROVED', 'COMPLETED'];
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const selectedPayment = computed(() => {
  return paymentProviderGetters.getPaymentMethodById(
    paymentMethods.value.list,
    parseInt(paymentProviderGetters.getMethodOfPaymentId(cart.value)),
  );
});
const localePath = useLocalePath();

const emits = defineEmits<{
  (event: 'validation-callback', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-approved'): void;
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

  if (payPalOrder?.result?.status && successPaymentStatuses.includes(payPalOrder.result.status)) {
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
        message: t('errorMessages.paymentFailed'),
        type: 'negative',
      });
    }
  } else {
    processingOrder.value = false;
    useNotification().send({
      message: t('errorMessages.paymentFailed'),
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
      onError(error) {
        if (showError.value) {
          useNotification().send({
            message: error?.toString() || t('errorMessages.paymentFailed'),
            type: 'negative',
          });
        }
      },
      onCancel() {
        useNotification().send({
          message: t('errorMessages.paymentCancelled'),
          type: 'negative',
        });
      },
      async createOrder() {
        showError.value = true;
        const order = await createTransaction({
          type: 'basket',
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

    if (selectedPayment.value) {
      const paymentKey = selectedPayment.value.paymentKey as keyof typeof PayPalAlternativeFundingSourceMapper;
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

watch(selectedPayment, () => {
  if (paypalScript.value) {
    createButton();
  }
});
</script>
