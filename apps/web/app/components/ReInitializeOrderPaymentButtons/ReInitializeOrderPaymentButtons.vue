<template>
  <component
    :is="component.componentName"
    v-for="(component, index) in filteredComponents"
    :key="index"
    :payment-key="order.paymentMethodKey"
    :disabled="disableBuyButton"
    :order="order"
    @click="validateOnClickComponents($event, component)"
  />
</template>

<script setup lang="ts">
import type { Order } from '@plentymarkets/shop-api';
import type { PaymentButtonComponent } from '@plentymarkets/shop-core';

const props = defineProps<{
  order: Order;
}>();

const { reInitializeComponents } = useDynamicPaymentButtons();
const disableBuyButton = ref(false);

const renderPaymentComponent = (component: PaymentButtonComponent) => {
  if (component.key && props.order?.paymentKey !== component.key) {
    return false;
  }
  if (component.paymentKey && props.order?.paymentMethodKey !== component.paymentKey) {
    return false;
  }
  if (component.excludeKeys && component.excludeKeys.includes(props.order?.paymentKey)) {
    return false;
  }
  return !(component.excludePaymentKeys && component.excludePaymentKeys.includes(props.order?.paymentMethodKey));
};
const filteredComponents = computed(() =>
  reInitializeComponents.value.filter((component) => renderPaymentComponent(component)),
);
const validateOnClickComponents = async (event: MouseEvent, component: PaymentButtonComponent) => {
  if (component.disableClickEvent) {
    return;
  }
  if (event.target) event.target.dispatchEvent(new CustomEvent('validated-click'));
};
</script>
