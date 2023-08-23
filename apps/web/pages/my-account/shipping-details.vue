<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <AccountData
    class="col-span-3"
    :header="$t('account.accountSettings.shippingDetails.shippingAddress')"
    :button-text="$t('account.accountSettings.personalData.edit')"
    @on-click="open"
  >
    <p>
      {{
        `${userAddressGetters.getFirstName(userShippingAddress)} ${userAddressGetters.getLastName(userShippingAddress)}`
      }}
    </p>
    <p>{{ userAddressGetters.getPhone(userShippingAddress) }}</p>
    <p>
      {{ userAddressGetters.getStreetName(userShippingAddress) }}
      {{ userAddressGetters.getStreetNumber(userShippingAddress) }}
    </p>
    <p>
      {{ `${userAddressGetters.getCity(userShippingAddress)} ${userAddressGetters.getPostCode(userShippingAddress)}` }}
    </p>
  </AccountData>
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
        {{ $t('account.accountSettings.shippingDetails.shippingAddress') }}
      </h3>
    </header>
    <AddressForm
      :countries="activeShippingCountries"
      :saved-address="userShippingAddress"
      :type="AddressType.Shipping"
      @on-save="close"
      @on-close="close"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { userAddressGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
});
const { isOpen, open, close } = useDisclosure();

const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
await getActiveShippingCountries();

const userShippingAddress = ref({
  id: 0,
  firstName: '',
  lastName: '',
  streetName: '',
  apartment: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  phoneNumber: '',
  email: '',
  primary: 1,
});
</script>
