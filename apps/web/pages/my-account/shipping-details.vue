<template>
  <div class="col-span-3 relative" :class="{ 'pointer-events-none opacity-50': loading }">
    <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto" size="sm" />
    <Address
      v-for="shippingAddress in shippingAddresses"
      :key="userAddressGetters.getId(shippingAddress)"
      :address="shippingAddress"
      :is-default="defaultAddressId === Number(userAddressGetters.getId(shippingAddress))"
      @on-edit="editAddress(shippingAddress)"
      @on-delete="onDelete(shippingAddress)"
      @make-default="makeDefault(shippingAddress)"
    />

    <div class="flex justify-end">
      <SfButton class="mt-4 w-auto" variant="secondary" @click="editAddress">
        {{ $t('account.accountSettings.shippingDetails.newAddress') }}
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
          {{ $t('account.accountSettings.shippingDetails.shippingAddress') }}
        </span>
        <span v-else>{{ $t('account.accountSettings.shippingDetails.newAddress') }}</span>
      </h3>
    </header>
    <AddressForm
      :countries="activeShippingCountries"
      :saved-address="selectedAddress"
      :type="AddressType.Shipping"
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

definePageMeta({
  layout: 'account',
});
const { isOpen, open, close } = useDisclosure();

const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const {
  data: shippingAddresses,
  getShippingAddresses,
  saveShippingAddress,
  setDefault,
  deleteAddress,
  defaultAddressId,
  loading,
} = useShippingAddress();
await getActiveShippingCountries();
await getShippingAddresses();

const selectedAddress = ref({});

const editAddress = (address: Address) => {
  selectedAddress.value = address;
  open();
};
const onDelete = (address: Address) => {
  deleteAddress(Number(userAddressGetters.getId(address)));
};

const onSave = async (data) => {
  await saveShippingAddress(data);
  close();
};

const makeDefault = (address) => {
  setDefault(Number(userAddressGetters.getId(address)));
};
</script>
