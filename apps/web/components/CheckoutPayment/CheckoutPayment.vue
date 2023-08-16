<template>
  <div data-testid="checkout-payment" class="md:px-4 py-6">
    <fieldset>
      <legend class="text-neutral-900 text-lg font-bold mb-4">{{ $t('checkoutPayment.heading') }}</legend>
      <div class="grid gap-4 grid-cols-2">
        <label v-for="{ id, icon, name, isSelectable } in paymentMethodList" :key="id" class="relative">
          <input
            type="radio"
            name="payment_method"
            class="peer sr-only"
            :value="id"
            :checked="id === selectedId"
            :disabled="!isSelectable"
            @change="$emit('update:activePayment', id)"
          />
          <span
            class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 active:border-primary-300 active:bg-primary-200 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-700 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
          >
            <span v-if="id === -1">
              <SfIconCreditCard class="mr-2" />
              <span class="font-medium">{{ $t('checkoutPayment.creditCard') }}</span>
            </span>
            <NuxtImg v-else :src="icon" :alt="name" width="50" height="40" />
            <p class="text-xs mt-2 text-neutral-500">{{ name }}</p>
          </span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { SfIconCreditCard } from '@storefront-ui/vue';
import { CheckoutPaymentEmits, CheckoutPaymentProps } from '~/components/CheckoutPayment/types';

const props = defineProps<CheckoutPaymentProps>();
const { data: cart } = useCart();
const selectedId = cart.value.methodOfPaymentId;
defineEmits<CheckoutPaymentEmits>();

const paymentMethodList = computed(() => {
  return [
    ...props.paymentMethods.list,
    {
      id: -1,
      name: 'CreditCard',
      fee: 0,
      icon: '',
      description: '',
      sourceUrl: '',
      isSelectable: false,
      key: '',
    },
  ];
});
</script>
