<template>
  <div
    class="addresses-list relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
    :data-testid="`account-billing-addresses-${props.type}`"
  >
    <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto" size="2xl" />
    <Address
      v-for="address in addresses"
      :key="userAddressGetters.getId(address)"
      :address="address"
      :is-default="defaultAddressId === Number(userAddressGetters.getId(address))"
      :is-selected="defaultAddressId === Number(userAddressGetters.getId(address))"
      @on-edit="editAddress(address)"
      @on-delete="onDelete(address)"
      @make-default="makeDefault(address)"
    />

    <div class="col-span-3 text-center">
      <h3 class="typography-headline-3 font-bold mt-6 mb-4" v-if="addresses.length === 0">
        {{ $t('account.accountSettings.noAddresses') }}
      </h3>
      <SfButton class="!block mt-6 ml-auto mr-auto w-auto" variant="secondary" @click="editAddress">
        {{ addAddressText }}
      </SfButton>
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
          <span v-if="userAddressGetters.getId(selectedAddress)">
            {{ editAddressText }}
          </span>
          <span v-else>{{ addAddressText }}</span>
        </h3>
      </header>
      <AddressForm
        :countries="activeShippingCountries"
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
import { SfButton, SfIconClose, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import type { AddressesListProps } from '~/components/AddressesList/types';

const props = defineProps<AddressesListProps>();

const { isOpen, open, close } = useDisclosure();

const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const {
  data: addresses,
  getAddresses,
  saveAddress,
  setDefault,
  deleteAddress,
  defaultAddressId,
  loading,
} = useAddress(props.type);
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
await getActiveShippingCountries();
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

  if (useAsShippingAddress) {
    await saveShippingAddress(address);
  }
  getAddresses();
};

const makeDefault = (address: Address) => {
  setDefault(address);
};
</script>
