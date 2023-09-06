<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <Address
    v-for="billingAddress in billingAddresses"
    :address="billingAddress"
    class="col-span-3"
    @on-click="editAddress(billingAddress)"
  />
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />

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
        {{ $t('account.accountSettings.billingDetails.billingAddress') }}
      </h3>
    </header>
    <AddressForm
      :countries="activeShippingCountries"
      :saved-address="selectedAddress"
      :type="AddressType.Billing"
      @on-save="close"
      @on-close="close"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import type { Address } from '@plentymarkets/shop-api';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import { useBillingAddress } from '~/composables/useBillingAddress';

definePageMeta({
  layout: 'account',
});
const { isOpen, open, close } = useDisclosure();

const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const { data: billingAddresses, getBillingAddresses } = useBillingAddress();
await getActiveShippingCountries();
await getBillingAddresses();

const selectedAddress = ref();

const editAddress = (address: Address) => {
  selectedAddress.value = address;
  open();
};
</script>
