<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <div class="flex items-center">
        <SfButton v-if="!disabled && addresses.length > 0" size="sm" variant="tertiary" @click="pick">
          Pick saved address
        </SfButton>
        <div class="h-5 w-px bg-blue-400 mx-2"></div>
        <SfButton v-if="!disabled && addresses.length > 0" size="sm" variant="tertiary" @click="edit">
          {{ $t('contactInfo.edit') }}
        </SfButton>
      </div>
    </div>

    <div v-if="selectedAddress" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="selectedAddress" />
    </div>

    <div class="w-full md:max-w-[520px]" v-if="!disabled && (isAuthorized || addresses.length === 0)">
      <p v-if="addresses.length === 0">{{ description }}</p>
      <SfButton :data-testid="`add-${type}-button`" class="mt-4 w-full md:w-auto" variant="secondary" @click="create">
        {{ buttonText }}
      </SfButton>
    </div>

    <UiModal
      v-if="!disabled"
      v-model="isOpenEdit"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeEdit">
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
        @on-close="closeEdit"
      />
    </UiModal>

    <UiModal
      v-if="!disabled"
      v-model="isOpenPick"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closePick">
          <SfIconClose />
        </SfButton>
        <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold">
          Saved addresses
        </h3>
        <h1 class="my-2 mb-6 font-semibold">Select one of your saved addresses</h1>
      </header>
      <!-- <Address
        v-for="address in addresses"
        :address="address"
      /> -->

      <Address
        v-for="address in addresses"
        :key="userAddressGetters.getId(address)"
        :address="address"
        :is-default="defaultAddressId === Number(userAddressGetters.getId(address))"
        @click="setAdress(address)"
      />
    </UiModal>
  </div>
</template>
<script setup lang="ts">
import { type Address, AddressType } from '@plentymarkets/shop-api';
import { cartGetters, userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from '~/components/CheckoutAddress/types';

const { isOpen: isOpenEdit, open: openEdit, close: closeEdit } = useDisclosure();
const { isOpen: isOpenPick, open: openPick, close: closePick } = useDisclosure();
const { isAuthorized } = useCustomer();
const { saveAddress: saveBillingAddress } = useAddress(AddressType.Billing);
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const props = withDefaults(defineProps<CheckoutAddressProps>(), {
  disabled: false,
});
const { data: cart } = useCart();
const editMode = ref(false);
const {
  data: addresses,
  getAddresses,
  setDefault,
  deleteAddress,
  defaultAddressId,
  loading,
} = useAddress(props.type);

const cartAddress = computed(() =>
  props.type === AddressType.Billing
    ? cartGetters.getCustomerInvoiceAddressId(cart.value)
    : cartGetters.getCustomerShippingAddressId(cart.value),
);

const selectedAddress = computed(
  () =>
    props.addresses.find((address) => userAddressGetters.getId(address) === cartAddress?.value?.toString()) ??
    ({} as Address),
);

const emit = defineEmits(['on-saved']);

getActiveShippingCountries();

const create = () => {
  editMode.value = false;
  openEdit();
};

const edit = () => {
  editMode.value = true;
  openEdit();
};

const pick = () => {
  editMode.value = true;
  openPick();
};

const setAdress = (address: Address) => {
  console.log(address);
}

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
