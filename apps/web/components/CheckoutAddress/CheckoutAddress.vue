<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <SfButton v-if="!disabled && addresses.length > 0" size="sm" variant="tertiary" @click="edit">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>

    <div v-if="selectedAddress" class="mt-2 md:w-[520px]">
      <p>
        {{ `${userAddressGetters.getFirstName(selectedAddress)} ${userAddressGetters.getLastName(selectedAddress)}` }}
      </p>
      <p>{{ userAddressGetters.getPhone(selectedAddress) }}</p>
      <p>
        {{ userAddressGetters.getStreetName(selectedAddress) }}
        {{ userAddressGetters.getStreetNumber(selectedAddress) }}
      </p>
      <p>{{ `${userAddressGetters.getCity(selectedAddress)} ${userAddressGetters.getPostCode(selectedAddress)}` }}</p>
    </div>

    <div class="w-full md:max-w-[520px]" v-if="!disabled && (isAuthorized || addresses.length === 0)">
      <p v-if="addresses.length === 0">{{ description }}</p>
      <SfButton class="mt-4 w-full md:w-auto" variant="secondary" @click="create">
        {{ buttonText }}
      </SfButton>
    </div>

    <UiModal
      v-if="!disabled"
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
          {{ heading }}
        </h3>
      </header>
      <AddressForm
        :countries="activeShippingCountries"
        :saved-address="
          editMode ? addresses.find((address) => address.id?.toString() === selectedAddress?.id?.toString()) : undefined
        "
        :type="type"
        @on-save="saveAddress"
        @on-close="close"
      />
    </UiModal>
  </div>
</template>
<script lang="ts" setup>
import { Address, AddressType } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from './types';

const { isOpen, open, close } = useDisclosure();
const { isAuthorized } = useCustomer();
const { saveAddress: saveBillingAddress } = useAddress(AddressType.Billing);
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
await getActiveShippingCountries();

const props = withDefaults(defineProps<CheckoutAddressProps>(), {
  disabled: false,
});
const editMode = ref(false);
const selectedAddress = computed(() => props.addresses?.[0] ?? ({} as Address));
const emit = defineEmits(['on-saved']);

const create = () => {
  editMode.value = false;
  open();
};

const edit = () => {
  editMode.value = true;
  open();
};

const saveAddress = async (address: Address, useAsShippingAddress: boolean = false) => {
  if (props.type === AddressType.Billing) {
    await saveBillingAddress(address);
  }
  if (props.type === AddressType.Shipping || useAsShippingAddress) {
    await saveShippingAddress(address);
  }
  emit('on-saved');
  close();
};
</script>
