<template>
  <SfTooltip label="Manage your addresses">
    <SfButton size="sm" variant="tertiary" @click="open">
      <SfIconViewList></SfIconViewList>
    </SfButton>
  </SfTooltip>

  <UiModal
    v-model="isOpen"
    tag="section"
    class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
    aria-labelledby="address-modal-title"
    data-testid="checkout-pick-address-modal"
  >
    <header>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </SfButton>
      <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold">
        {{ $t('pickSavedAddress') }}
      </h3>
      <h1 class="my-2 mb-6 font-semibold">{{ $t('pickSavedAddressSubtitle') }}</h1>
    </header>
    <div class="hover:bg-primary-50" v-for="address in addresses" :key="userAddressGetters.getId(address)">
      <Address
        :address="address"
        :is-selected="Number(userAddressGetters.getId(displayAddress)) === Number(userAddressGetters.getId(address))"
        :is-default="defaultAddressId === Number(userAddressGetters.getId(address))"
        @click="setDisplayAddress(address, true)"
        @on-delete="deleteAddress(Number(userAddressGetters.getId(address)))"
        @make-default="setDefault(address)"
        @on-edit="openForm(address)"
      />
    </div>
    <div class="flex justify-end w-full">
      <SfButton variant="secondary" class="mt-10" @click="openForm({})">
        <template v-if="type === AddressType.Shipping">{{ $t('newShippingAddress') }}</template>
        <template v-else>{{ $t('newBillingAddress') }}</template>
      </SfButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { type AddressSelectEvents, type AddressSelectProps } from './types';
import { AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { type Address } from '@plentymarkets/shop-api';
import { SfIconClose, SfButton, useDisclosure, SfIconViewList, SfTooltip } from '@storefront-ui/vue';
const { type } = defineProps<AddressSelectProps>();
const {
  data: addresses,
  displayAddress,
  setDefault,
  deleteAddress,
  defaultAddressId,
  setDisplayAddress,
} = useAddress(type);
const { isOpen, open, close } = useDisclosure();
const emit = defineEmits<AddressSelectEvents>();

const openForm = (address: Address | {}) => {
  emit('edit', address as Address);
  close();
};
</script>
