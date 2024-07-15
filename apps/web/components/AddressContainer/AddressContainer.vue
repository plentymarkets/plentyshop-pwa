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
        <AddressSelect v-if="!edit" @edit="editForm($event)" :type="type"></AddressSelect>
        <SfTooltip label="Edit address">
          <SfButton v-if="!disabled && hasDisplayAddress" size="sm" variant="tertiary" @click="editForm(displayAddress)">
            <SfIconBase v-if="!edit" viewBox="0 0 38 38" class="fill-primary-900 cursor-pointer">
              <path
                d="M31.25 7.003c0-0 0-0.001 0-0.001 0-0.346-0.14-0.659-0.365-0.886l-5-5c-0.227-0.226-0.539-0.366-0.885-0.366s-0.658 0.14-0.885 0.366v0l-20.999 20.999c-0.146 0.146-0.256 0.329-0.316 0.532l-0.002 0.009-2 7c-0.030 0.102-0.048 0.22-0.048 0.342 0 0.691 0.559 1.251 1.25 1.252h0c0.126-0 0.248-0.019 0.363-0.053l-0.009 0.002 6.788-2c0.206-0.063 0.383-0.17 0.527-0.311l-0 0 21.211-21c0.229-0.226 0.37-0.539 0.371-0.886v-0zM8.133 26.891l-4.307 1.268 1.287-4.504 14.891-14.891 3.219 3.187zM25 10.191l-3.228-3.196 3.228-3.228 3.229 3.228z"
              />
            </SfIconBase>
            <SfIconClose v-else></SfIconClose>
          </SfButton>
        </SfTooltip>
      </div>
    </div>

    <div v-if="edit">
      <AddressFormShipping v-if="type === AddressType.Shipping" :address="formAddress" />
      <AddressFormBilling v-if="type === AddressType.Billing" :address="formAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfCheckbox, SfIconBase, SfIconClose, SfTooltip } from '@storefront-ui/vue';
import { AddressContainerProps } from './types';
import { Address, AddressType } from '@plentymarkets/shop-api';
const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), {
  disabled: false,
});
const { t } = useI18n();
const { combineShippingAndBilling } = useCheckout();
const { displayAddress, hasDisplayAddress } = useAddress(type);
const { open: edit } = useAddressForm(type);
const heading = ref('');
const formAddress = ref();

const setFormAddress = (address: Address) => {
  formAddress.value = address;
};

const setFormToDisplayAddress = () => {
  setFormAddress(displayAddress.value);
};

onNuxtReady(() => {
  if (hasDisplayAddress.value) {
    setFormToDisplayAddress();
  }
});

const editForm = (address: Address) => {
  if (edit.value) {
    edit.value = false;
    setFormToDisplayAddress();
    return;
  }
  setFormAddress(address);
  edit.value = true;
}

watch(displayAddress, () => {
  setFormToDisplayAddress();
});


const setHeading = () => {
  if (combineShippingAndBilling.value) {
    heading.value = `${t('shipping.heading')} / ${t('billing.heading')}`;
  } else if (type === AddressType.Shipping) {
    heading.value = t('shipping.heading');
  } else {
    heading.value = t('billing.heading');
  }
};

watch(combineShippingAndBilling, () => {
  setHeading();
}, { immediate: true });
</script>
