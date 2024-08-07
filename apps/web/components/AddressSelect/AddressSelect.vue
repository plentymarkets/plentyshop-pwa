<template>
  <SfTooltip label="Manage your addresses">
    <SfButton size="sm" variant="tertiary" @click="open">
      {{ $t('pickSavedAddress') }}
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
        :is-selected="Number(userAddressGetters.getId(checkoutAddress)) === Number(userAddressGetters.getId(address))"
        :is-default="primaryAddressId === Number(userAddressGetters.getId(address))"
        @click="setCheckoutAddress(address), (isOpen = false)"
        @on-delete="deleteAddress(Number(userAddressGetters.getId(address)))"
        @make-default="setPrimaryAddress(address), (isOpen = false)"
        @on-edit="
          emit('edit', address);
          close();
        "
      />
    </div>
    <div class="flex justify-end w-full">
      <SfButton
        variant="secondary"
        class="mt-10"
        @click="
          emit('new');
          close();
        "
      >
        {{ type === AddressType.Shipping ? $t('newShippingAddress') : $t('newBillingAddress') }}
      </SfButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { type AddressSelectProps } from './types';
import { AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { type Address } from '@plentymarkets/shop-api';
import { SfIconClose, SfButton, useDisclosure, SfTooltip } from '@storefront-ui/vue';
const { type } = defineProps<AddressSelectProps>();
const { addresses } = useAddressStore(type);
const { deleteAddress } = useDeleteAddress(type);
const { primaryAddressId, set: setPrimaryAddress } = usePrimaryAddress(type);
const { set: setCheckoutAddress } = useCheckoutAddress(type);
const { checkoutAddress } = useCheckoutAddress(type);
const { isOpen, open, close } = useDisclosure();

const emit = defineEmits<{
  (event: 'edit', address: Address): void;
  (event: 'new'): void;
}>();
</script>
