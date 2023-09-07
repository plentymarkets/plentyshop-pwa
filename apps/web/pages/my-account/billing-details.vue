<template>
  <div class="col-span-3 relative" :class="{ 'pointer-events-none opacity-50': loading }">
    <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto" size="sm" />
    <Address
      v-for="billingAddress in billingAddresses"
      :key="userAddressGetters.getId(billingAddress)"
      :address="billingAddress"
      :is-default="defaultAddressId === Number(userAddressGetters.getId(billingAddress))"
      @on-edit="editAddress(billingAddress)"
      @on-delete="onDelete(billingAddress)"
      @make-default="makeDefault(billingAddress)"
    />

    <div class="flex justify-end">
      <SfButton class="mt-4 w-auto" variant="secondary" @click="editAddress">
        {{ $t('account.accountSettings.billingDetails.newAddress') }}
      </SfButton>
    </div>
  </div>

  <UiModal
    v-model="isOpen"
    tag="section"
    role="dialog"
    class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
    aria-labelledby="address-modal-title"
  >
    <header>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </SfButton>
      <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
        <span v-if="Object.keys(selectedAddress) > 0">
          {{ $t('account.accountSettings.billingDetails.billingAddress') }}
        </span>
        <span v-else>{{ $t('account.accountSettings.billingDetails.newAddress') }}</span>
      </h3>
    </header>
    <AddressForm
      :countries="activeShippingCountries"
      :saved-address="selectedAddress"
      :type="AddressType.Billing"
      @on-save="onSave"
      @on-close="close"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import type { Address } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfIconClose, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import { useBillingAddress } from '~/composables/useBillingAddress';

definePageMeta({
  layout: 'account',
});
const { isOpen, open, close } = useDisclosure();

const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const {
  data: billingAddresses,
  getBillingAddresses,
  saveBillingAddress,
  setDefault,
  deleteAddress,
  defaultAddressId,
  loading,
} = useBillingAddress();
const { saveShippingAddress } = useShippingAddress();
await getActiveShippingCountries();
await getBillingAddresses();

const selectedAddress = ref();

const editAddress = (address: Address) => {
  selectedAddress.value = address;
  open();
};
const onDelete = (address: Address) => {
  deleteAddress(Number(userAddressGetters.getId(address)));
};

const onSave = async (data, useAsShippingAddress) => {
  await saveBillingAddress(data);
  close();

  if (useAsShippingAddress) {
    await saveShippingAddress(data);
  }
};

const makeDefault = (address) => {
  setDefault(Number(userAddressGetters.getId(address)));
};
</script>
