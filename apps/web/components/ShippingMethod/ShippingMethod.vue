<template>
  <div data-testid="shipping-method" class="md:px-4 my-6">
    <h3 class="text-neutral-900 text-lg font-bold">{{ t('shippingMethod.heading') }}</h3>
    <div class="mt-4">
      <ul v-if="shippingMethods" class="grid gap-y-4 md:grid-cols-2 md:gap-x-4" role="radiogroup">
        <SfListItem
          v-for="(method, index) in shippingMethods"
          :key="`shipping-method-${index}`"
          :disabled="disabled"
          @click.prevent="updateShippingMethod(shippingProviderGetters.getParcelServicePresetId(method))"
          tag="label"
          children-tag="div"
          class="border rounded-md items-start select-none"
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
        </SfListItem>
      </ul>

      <div v-else class="flex mb-6">
        <SfIconBlock class="mr-2 text-neutral-500" />
        <p>{{ t('shippingMethod.description') }}</p>
      </div>
    </div>

    <ShippingPrivacy v-if="showShippingPrivacy" />
  </div>
</template>

<script setup lang="ts">
import { shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfIconBlock, SfListItem, SfRadio } from '@storefront-ui/vue';
import { type CheckoutShippingEmits, type ShippingMethodProps } from './types';

const { shippingMethods, disabled = false } = defineProps<ShippingMethodProps>();

const emit = defineEmits<CheckoutShippingEmits>();

const { data: cart } = useCart();
const { t, n } = useI18n();
const { selectedMethod } = useCartShippingMethods();
const radioModel = ref(shippingProviderGetters.getShippingProfileId(cart.value));

const showShippingPrivacy = computed(
  () =>
    shippingMethods.length > 0 &&
    selectedMethod.value &&
    shippingProviderGetters.getDataPrivacyAgreementHint(selectedMethod.value),
);

const updateShippingMethod = (shippingId: string) => {
  radioModel.value = shippingId;
  emit('update:shippingMethod', radioModel.value);
};

const getShippingAmount = (amount: string) => {
  return amount === '0' ? t('shippingMethod.free') : n(Number(amount), 'currency');
};
</script>
