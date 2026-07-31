<template>
  <UiModal
    v-model="changePaymentMethodModalOpen"
    :disable-click-away="true"
    tag="section"
    class="w-full h-full @sm:h-fit m-0 p-0 @sm:w-[600px] overflow-y-auto"
  >
    <header>
      <h2 class="font-bold text-lg leading-6 @md:text-2xl">
        <span>{{ t('account.ordersAndReturns.changePaymentMethod.heading') }}</span>
      </h2>
      <div class="absolute right-2 top-2 flex items-center">
        <UiButton
          :aria-label="t('account.ordersAndReturns.changePaymentMethod.cancel')"
          square
          variant="tertiary"
          :disabled="loading"
          @click="close()"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </header>
    <div class="w-full">
      <div class="mt-3 mb-5">
        <i18n-t keypath="account.ordersAndReturns.changePaymentMethod.subHeading" scope="global">
          <template #paymentMethod>
            <b>{{ order.paymentMethodName }}</b>
          </template>
        </i18n-t>
      </div>

      <div class="grid gap-3 grid-cols-1 @sm:grid-cols-2">
        <label
          v-for="paymentMethod in order.paymentMethodListForSwitch"
          :key="paymentMethod.id"
          class="relative col-span-1"
          @click="selectedPaymentMethodId = paymentMethod.id"
        >
          <input
            type="radio"
            name="payment_method"
            class="peer sr-only"
            :value="paymentMethod.id"
            :data-testid="`payment-method-${paymentMethod.id}`"
            :checked="selectedPaymentMethodId === paymentMethod.id"
          />
          <span
            class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-50 hover:bg-primary-50 active:border-primary-100 active:bg-primary-50 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-500 peer-disabled:opacity-50"
          >
            <NuxtImg :src="paymentMethod.icon" :alt="paymentMethod.name" class="!h-[40px]" loading="lazy" />
            <span class="text-xs mt-2 text-neutral-500">{{ paymentMethod.name }}</span>
          </span>
        </label>
      </div>

      <div
        v-if="selectedPaymentMethod && !selectedPaymentMethod.isSwitchableFrom"
        class="mt-5 flex items-center gap-2 text-sm text-neutral-600"
      >
        <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
        <span>{{ t('account.ordersAndReturns.changePaymentMethod.notChangeableAfterHint') }}</span>
      </div>
    </div>

    <div class="flex justify-end items-center mt-5">
      <UiButton variant="secondary" class="mr-2" size="lg" :disabled="loading" @click="close()">
        {{ t('account.ordersAndReturns.changePaymentMethod.cancel') }}
      </UiButton>
      <UiButton
        data-testid="change-payment-method-submit-button"
        size="lg"
        variant="primary"
        :disabled="!selectedPaymentMethodId || loading"
        @click="change()"
      >
        <SfLoaderCircular v-if="loading" />
        <span v-else>{{ t('account.ordersAndReturns.changePaymentMethod.change') }}</span>
      </UiButton>
    </div>
  </UiModal>
</template>

<script lang="ts" setup>
import type { OrderPaymentMethodModalProps } from './types';
import { SfIconClose, SfIconWarning, SfLoaderCircular } from '@storefront-ui/vue';

const props = defineProps<OrderPaymentMethodModalProps>();
const loading = ref(false);
const selectedPaymentMethodId = ref<number | null>(null);

const { changePaymentMethod, changePaymentMethodModalOpen } = useCustomerOrder('soft-login');

const selectedPaymentMethod = computed(() => {
  return props.order.paymentMethodListForSwitch.find((method) => method.id === selectedPaymentMethodId.value);
});

const close = () => {
  if (loading.value) return;
  changePaymentMethodModalOpen.value = false;
  selectedPaymentMethodId.value = null;
};

const change = async () => {
  if (loading.value || !selectedPaymentMethodId.value) {
    return;
  }

  try {
    loading.value = true;
    if (await changePaymentMethod(selectedPaymentMethodId.value)) {
      changePaymentMethodModalOpen.value = false;
    }
  } finally {
    loading.value = false;
  }
};
</script>
