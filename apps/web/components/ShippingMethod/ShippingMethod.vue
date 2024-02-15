<template>
  <div data-testid="shipping-method" class="md:px-4 my-6">
    <div class="flex justify-between items-center">
      <h3 class="text-neutral-900 text-lg font-bold">{{ t('shippingMethod.heading') }}</h3>
    </div>
    <div class="mt-4">
      <ul v-if="shippingMethods" class="grid gap-y-4 md:grid-cols-2 md:gap-x-4" role="radiogroup">
        <SfListItem
          v-for="method in shippingMethods"
          tag="label"
          :key="shippingProviderGetters.getParcelServicePresetId(method)"
          class="border rounded-md items-start"
          @click="updateShippingMethod(shippingProviderGetters.getParcelServicePresetId(method))"
          :disabled="disabled"
        >
          <div class="flex gap-2">
            <SfRadio
              v-model="radioModel"
              :checked="
                shippingProviderGetters.getShippingProfileId(cart).toString() ===
                shippingProviderGetters.getParcelServicePresetId(method)
              "
              :value="shippingProviderGetters.getParcelServicePresetId(method)"
            />
            <p>{{ shippingProviderGetters.getShippingMethodName(method) }}</p>
            <p class="ml-auto">{{ getShippingAmount(shippingProviderGetters.getShippingAmount(method)) }}</p>
          </div>
        </SfListItem>
      </ul>

      <div v-else class="flex mb-6">
        <SfIconBlock class="mr-2 text-neutral-500" />
        <p>{{ t('shippingMethod.description') }}</p>
      </div>
    </div>

    <ShippingPrivacy v-if="shippingMethods" />
  </div>
</template>
<script setup lang="ts">
import { shippingProviderGetters } from '@plentymarkets/shop-sdk';
import { SfIconBlock, SfListItem, SfRadio } from '@storefront-ui/vue';
import { CheckoutShippingEmits, ShippingMethodProps } from './types';

withDefaults(defineProps<ShippingMethodProps>(), {
  disabled: false,
});
const emit = defineEmits<CheckoutShippingEmits>();
const { data: cart } = useCart();
const radioModel = ref(shippingProviderGetters.getShippingProfileId(cart.value));
const { t, n } = useI18n();

const updateShippingMethod = (shippingId: string) => {
  radioModel.value = shippingId;
  emit('update:shippingMethod', radioModel.value);
};

const getShippingAmount = (amount: string) => {
  return amount === '0' ? t('shippingMethod.free') : n(Number(amount), 'currency');
};
</script>
