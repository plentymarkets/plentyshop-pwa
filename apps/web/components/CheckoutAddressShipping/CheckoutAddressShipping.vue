<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ heading }}
      </h2>
      <SfButton v-if="!disabled && addresses.length > 0 && !open" size="sm" variant="tertiary" @click="open = true">
        {{ t('contactInfo.edit') }}
      </SfButton>
    </div>
    <div v-if="displayAddress && !open" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="displayAddress" />
    </div>

    <div v-if="open">
      <AddressFormShipping/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { CheckoutShippingAddressProps } from './types';
import { AddressType } from '@plentymarkets/shop-api';
const { t } = useI18n();
const type = AddressType.Shipping;
const { disabled } = withDefaults(defineProps<CheckoutShippingAddressProps>(), {
  disabled: false,
});
const { combineShippingAndBilling } = useCheckout();
const { data: addresses, displayAddress } = useAddress(type);
const { open } = useAddressFormShipping();

const heading = ref('');

onMounted(() => {
  setHeading();
});

watch(
  () => combineShippingAndBilling.value,
  () => {
    setHeading();
  },
);

const setHeading = () => {
  if (combineShippingAndBilling.value) {
    heading.value = `${t('shipping.heading')} / ${t('billing.heading')}`;
  } else if (type === AddressType.Shipping) {
    heading.value = t('shipping.heading');
  } else {
    heading.value = t('billing.heading');
  }
};

</script>
