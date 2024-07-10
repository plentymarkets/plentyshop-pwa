<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ heading }}
      </h2>
      <label class="flex items-center gap-2" v-if="type === AddressType.Shipping">
        <SfCheckbox name="useAsShipping" v-model="combineShippingAndBilling" />
        <span>{{ t('form.useAsBillingLabel') }}</span>
      </label>
    </div>
    <div class="flex justify-between">
      <div>
        <div v-if="hasDisplayAddress && !edit" class="mt-2">
          <AddressDisplay :address="displayAddress" />
        </div>
      </div>
      <div>
        <SfButton v-if="!edit" size="sm" variant="tertiary">Switch</SfButton>
        <SfButton v-if="!disabled && hasDisplayAddress" size="sm" variant="tertiary" @click="editForm">
          <template v-if="!edit">{{ t('contactInfo.edit') }}</template>
          <template v-else>{{ t('back') }}</template>
        </SfButton>
      </div>
    </div>

    <div v-if="edit">
      <AddressFormShipping v-if="type === AddressType.Shipping" :address="displayAddress" />
      <AddressFormBilling v-if="type === AddressType.Billing" :address="displayAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfCheckbox } from '@storefront-ui/vue';
import { CheckoutShippingAddressProps } from './types';
import { AddressType } from '@plentymarkets/shop-api';
const { t } = useI18n();
const { disabled, type } = withDefaults(defineProps<CheckoutShippingAddressProps>(), {
  disabled: false,
});

const { combineShippingAndBilling, } = useCheckout();
const { data: addresses, displayAddress, hasDisplayAddress } = useAddress(type);
const { open: edit } = useAddressForm(type);
const heading = ref('');
const editForm = () => {
  edit.value = !edit.value;
};


onMounted(() => {
  setHeading();
});

watch(
  () => combineShippingAndBilling,
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
