<template>
  <div
    class="addresses-list relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
    :data-testid="`account-billing-addresses-${type}`"
  >
    <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto" size="2xl" />
    <Address
      v-for="address in addresses"
      :key="userAddressGetters.getId(address)"
      :address="address"
      :is-default="defaultAddressId === Number(userAddressGetters.getId(address))"
      :is-selected="defaultAddressId === Number(userAddressGetters.getId(address))"
      :show-divider="!(defaultAddressId === Number(userAddressGetters.getId(address)))"
      @on-edit="editAddress(address)"
      @on-delete="onDelete(address)"
      @make-default="makeDefault(address)"
    />

    <div class="col-span-3 text-center">
      <h3 v-if="addresses.length === 0" class="typography-headline-3 font-bold mt-6 mb-4">
        {{ $t('account.accountSettings.noAddresses') }}
      </h3>
      <UiButton class="!block mt-6 ml-auto mr-auto w-auto" variant="secondary" @click="editAddress">
        {{ addAddressText }}
      </UiButton>
    </div>

    <UiModal
      v-if="isOpen"
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <UiButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
          <SfIconClose />
        </UiButton>
        <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
          <span v-if="userAddressGetters.getId(selectedAddress)">
            {{ editAddressText }}
          </span>
          <span v-else>{{ addAddressText }}</span>
        </h3>
      </header>
      <AddressForm
        :saved-address="selectedAddress"
        :use-as-shipping-default="false"
        :type="type"
        @on-save="onSave"
        @on-close="close"
      />
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { SfIconClose, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import type { AddressesListProps } from './types';

const { type, editAddressText, addAddressText } = defineProps<AddressesListProps>();

const { isOpen, open, close } = useDisclosure();
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
const {
  data: addresses,
  getAddresses,
  saveAddress,
  setDefault,
  deleteAddress,
  defaultAddressId,
  loading,
} = useAddress(type);

await useAggregatedCountries().fetchAggregatedCountries();
await getAddresses();

const selectedAddress = ref();

const editAddress = (address: Address) => {
  selectedAddress.value = address;
  open();
};

const onDelete = (address: Address) => {
  deleteAddress(Number(userAddressGetters.getId(address)));
};

const onSave = async (address: Address, useAsShippingAddress: boolean) => {
  await saveAddress(address);
  close();
  if (useAsShippingAddress) await saveShippingAddress(address);
  await getAddresses();
};

const makeDefault = (address: Address) => setDefault(address);
</script>
