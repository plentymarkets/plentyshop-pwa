<template>
  <div v-if="paypalUuid" ref="paypalButton" :id="'paypal-' + paypalUuid" class="z-0 relative paypal-button" />
</template>

<script setup lang="ts">
import { OnApproveData, OnInitActions } from '@paypal/paypal-js';
import { orderGetters, productGetters, cartGetters } from '@plentymarkets/shop-sdk';
import { v4 as uuid } from 'uuid';
import { PaypalButtonPropsType } from '~/components/PayPal/types';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = uuid();
const { loadScript, createTransaction, approveOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { data: cart, addToCart, clearCartItems } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const localePath = useLocalePath();
const emits = defineEmits(['on-click']);

const props = withDefaults(defineProps<PaypalButtonPropsType>(), {
  disabled: false,
});

const TypeCartPreview = 'CartPreview';
const TypeSingleItem = 'SingleItem';
const TypeCheckout = 'Checkout';

const isCommit = props.type === TypeCheckout;
const paypal = await loadScript(currency.value, isCommit);

const onInit = (actions: OnInitActions) => {
  if (props.type === TypeCheckout) {
    if (props.disabled) {
      actions.disable();
    } else {
      actions.enable();
    }

    watch(props, (watchProps) => {
      if (watchProps.disabled) {
        actions.disable();
      } else {
        actions.enable();
      }
    });
  } else {
    actions.enable();
  }
};

const onClick = async () => {
  if (props.type === TypeSingleItem && props.value) {
    await addToCart({
      productId: Number(productGetters.getId(props.value.product)),
      quantity: props.value.quantity,
      basketItemOrderParams: props.value.basketItemOrderParams,
    });
  }
};

const onApprove = async (data: OnApproveData) => {
  const result = await approveOrder(data.orderID, data.payerID ?? '');

  if (result?.url && (props.type === TypeCartPreview || props.type === TypeSingleItem)) {
    navigateTo(localePath(paths.readonlyCheckout + `/?payerId=${data.payerID}&orderId=${data.orderID}`));
  } else if (props.type === TypeCheckout) {
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

    if (order?.order?.id) {
      navigateTo(localePath(paths.thankYou + '/?orderId=' + order.order.id + '&accessKey=' + order.order.accessKey));
    }
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const renderButton = () => {
  if (paypal) {
    const FUNDING_SOURCES = [paypal.FUNDING?.PAYPAL, paypal.FUNDING?.PAYLATER];

    FUNDING_SOURCES.forEach((fundingSource) => {
      if (paypal?.Buttons && fundingSource) {
        const button = paypal.Buttons({
          style: {
            layout: 'vertical',
            label: props.type === TypeCartPreview || props.type === TypeSingleItem ? 'checkout' : 'buynow',
            color: 'blue',
          },
          fundingSource: fundingSource,
          async onClick() {
            await onClick();
            emits('on-click');
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

        if (button.isEligible() && paypalButton.value) {
          button.render('#' + paypalButton.value?.id);
        }
      }
    });
  }
};

onMounted(() => {
  renderButton();
});
</script>
