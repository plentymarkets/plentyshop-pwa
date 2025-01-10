<template>
  <div class="relative pb-4">
    <h1 class="font-bold text-lg ml-4 mt-6">{{ t('checkoutPayment.heading') }}</h1>
    <div class="w-auto max-w-[400px] min-w-[250px] m-2 pl-1">
      <input
        type="radio"
        name="payment_method"
        class="peer sr-only"
        :data-testid="`payment-method-hier noch id`"
        :checked="props.checked"
        :disabled="props.disabled"
      />
      <span
        class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-50 hover:bg-primary-50 peer-focus:border-primary-50 peer-focus:bg-primary-50 active:border-primary-100 active:bg-primary-50 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-500 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
      >
        <NuxtImg :src="props.paymentMethodIconPath" :alt="props.paymentMethodName" class="!h-[40px]" loading="lazy" />
        <span class="text-xs mt-2 text-neutral-500">{{ props.paymentMethodName }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentOptionItemProps } from './types';
const { t } = useI18n();

const props = defineProps<PaymentOptionItemProps>();
</script>
