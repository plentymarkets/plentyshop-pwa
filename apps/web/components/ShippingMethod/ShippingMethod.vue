<template>
  <div data-testid="shipping-method" class="md:px-4 my-6">
    <h3 class="text-neutral-900 text-lg font-bold">{{ t('shippingMethod.heading') }}</h3>
    <div class="mt-4">
      <ul
        v-if="shippingMethods && shippingMethods.length > 0"
        class="grid gap-y-4 md:grid-cols-2 md:gap-x-4"
        role="radiogroup"
        data-testid="shipping-method-list"
      >
        <SfListItem
          v-for="(method, index) in shippingMethods"
          :key="`shipping-method-${index}`"
          :disabled="disabled"
          tag="label"
          children-tag="div"
          class="border rounded-md items-start select-none"
          @click.prevent="updateShippingMethod(shippingProviderGetters.getParcelServicePresetId(method))"
        >
          <template #prefix>
            <SfRadio
              v-model="radioModel"
              :checked="
                shippingProviderGetters.getShippingProfileId(cart).toString() ===
                shippingProviderGetters.getParcelServicePresetId(method)
              "
              :value="shippingProviderGetters.getParcelServicePresetId(method)"
              class="flex items-center"
            />
          </template>
          <div class="flex items-center flex-row gap-2">
            <span>{{ shippingProviderGetters.getShippingMethodName(method) }}</span>
            <span class="ml-auto">{{ getShippingAmount(shippingProviderGetters.getShippingAmount(method)) }}</span>
          </div>
          <div v-if="getDeliveryDays(shippingProviderGetters.getParcelServicePresetId(method))">
            <span class="text-sm">
              {{
                t('shippingMethod.maxDeliveryDays', {
                  days: getDeliveryDays(shippingProviderGetters.getParcelServicePresetId(method)),
                })
              }}</span
            >
          </div>
        </SfListItem>
      </ul>

      <div
        v-else
        class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md"
        data-testid="no-shipping-method-available"
      >
        <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
        <div class="py-2 mr-2">
          <p v-if="hasCheckoutAddress">{{ t('shippingMethod.noMethodsAvailable') }}</p>
          <p v-else>{{ t('shippingMethod.description') }}</p>
        </div>
      </div>
    </div>

    <ShippingPrivacy v-if="showShippingPrivacy" />
  </div>
</template>

<script setup lang="ts">
import { AddressType, shippingProviderGetters, cartGetters } from '@plentymarkets/shop-api';
import { SfIconWarning, SfListItem, SfRadio } from '@storefront-ui/vue';
import type { CheckoutShippingEmits, ShippingMethodProps } from './types';

const { disabled = false } = defineProps<ShippingMethodProps>();
const { hasCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
const emit = defineEmits<CheckoutShippingEmits>();

const { data: cart } = useCart();
const { t, n } = useI18n();
const { selectedMethod } = useCartShippingMethods();
const { shippingMethods } = useCheckoutPagePaymentAndShipping();
const radioModel = ref(shippingProviderGetters.getShippingProfileId(cart.value));

const showShippingPrivacy = computed(
  () =>
    shippingMethods.value.length > 0 &&
    selectedMethod.value &&
    shippingProviderGetters.getDataPrivacyAgreementHint(selectedMethod.value),
);

const getDeliveryDays = (method: string) => {
  return cartGetters.getMaxDeliveryDays(cart.value, Number(method));
};

const updateShippingMethod = (shippingId: string) => {
  if (disabled) return;
  radioModel.value = shippingId;
  emit('update:shippingMethod', radioModel.value);
};

const getShippingAmount = (amount: string) => {
  return amount === '0' ? t('shippingMethod.free') : n(Number(amount), 'currency');
};
</script>
