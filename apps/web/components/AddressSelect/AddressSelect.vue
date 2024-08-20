<template>
  <SfTooltip :label="$t('manageAddresses')">
    <UiButton size="sm" variant="tertiary" @click="open">
      {{ $t('pickSavedAddress') }}
    </UiButton>
  </SfTooltip>

  <UiModal
    v-model="isOpen"
    tag="section"
    class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
    aria-labelledby="address-modal-title"
    data-testid="checkout-pick-address-modal"
  >
    <header>
      <UiButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </UiButton>
      <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold">
        {{ $t('pickSavedAddress') }}
      </h3>
      <h1 class="my-2 mb-6 font-semibold">{{ $t('pickSavedAddressSubtitle') }}</h1>
    </header>

    <Address
      v-for="address in addresses"
      :key="userAddressGetters.getId(address)"
      :address="address"
      :is-selected="Number(userAddressGetters.getId(checkoutAddress)) === Number(userAddressGetters.getId(address))"
      :is-default="primaryAddressId === Number(userAddressGetters.getId(address))"
      :show-divider="Number(userAddressGetters.getId(checkoutAddress)) !== Number(userAddressGetters.getId(address))"
      @click="handleSetCheckoutAddress(address)"
      @on-delete="deleteAddress(Number(userAddressGetters.getId(address)))"
      @make-default="setPrimaryAddress(address), (isOpen = false)"
      @on-edit="
        emit('edit', address);
        close();
      "
      class="group hover:bg-primary-50"
    >
      <UiDivider class="col-span-3 mx-4 !w-auto md:mx-0 group-hover:opacity-0" />
    </Address>

    <div class="flex justify-end w-full">
      <UiButton
        variant="secondary"
        class="mt-10"
        @click="
          emit('new');
          close();
        "
      >
        {{ type === AddressType.Shipping ? $t('newShippingAddress') : $t('newBillingAddress') }}
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { type AddressSelectProps } from './types';
import { AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { type Address } from '@plentymarkets/shop-api';
import { SfIconClose, useDisclosure, SfTooltip } from '@storefront-ui/vue';

const { type } = defineProps<AddressSelectProps>();

const { addresses } = useAddressStore(type);
const { deleteAddress } = useDeleteAddress(type);
const { primaryAddressId, set: setPrimaryAddress } = usePrimaryAddress(type);
const { checkoutAddress, set: setCheckoutAddress } = useCheckoutAddress(type);
const { isOpen, open, close } = useDisclosure();

const handleSetCheckoutAddress = async (address: Address) => {
  isOpen.value = false;

  await setCheckoutAddress(address).then(() => {
    if (type === AddressType.Shipping) {
      useCartShippingMethods().getShippingMethods();
      usePaymentMethods().fetchPaymentMethods();
    }
    return true;
  });
};

const emit = defineEmits<{
  (event: 'edit', address: Address): void;
  (event: 'new'): void;
}>();
</script>
