<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <div v-if="!disabled && addresses.length > 0" class="flex items-center">
        <SfButton v-if="type === AddressType.Billing" size="sm" variant="tertiary" @click="pick">
          {{ $t('savedBillingAddress') }}
        </SfButton>
        <SfButton v-if="type === AddressType.Shipping" size="sm" variant="tertiary" @click="pick">
          {{ $t('savedShippingAddress') }}
        </SfButton>
        <div class="h-5 w-px bg-primary-700 mx-2"></div>
        <SfButton size="sm" variant="tertiary" @click="edit">
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
      v-model="isOpenPick"
      tag="section"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closePick">
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
          :is-selected="selectedAddress.id === Number(userAddressGetters.getId(address))"
          :is-default="defaultAddressId === Number(userAddressGetters.getId(address))"
          @click="setNewSelectedAddress(address)"
          @on-delete="onDelete(address)"
          @make-default="makeDefault(address)"
          @on-edit="edit"
        />
      </div>
      <div class="flex justify-end w-full">
        <SfButton variant="secondary" v-if="type === AddressType.Billing" class="mt-10" @click="create">
          {{ $t('newBillingAddress') }}
        </SfButton>
        <SfButton variant="secondary" v-if="type === AddressType.Shipping" class="mt-10" @click="create">
          {{ $t('newShippingAddress') }}
        </SfButton>
      </div>
    </UiModal>

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
const { data: addresses, setDefault, deleteAddress, defaultAddressId } = useAddress(props.type);

const cartAddress = computed(() =>
  props.type === AddressType.Billing
    ? cartGetters.getCustomerInvoiceAddressId(cart.value)
    : cartGetters.getCustomerShippingAddressId(cart.value),
);

const defaultAddress = computed(
  () =>
    props.addresses.find((address) => userAddressGetters.getId(address) === cartAddress?.value?.toString()) ??
    ({} as Address),
);

let selectedAddress = ref(defaultAddress.value);

const setNewSelectedAddress = (selectedAddressNew: Address) => {
  selectedAddress.value = selectedAddressNew;
};

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

const onDelete = (address: Address) => {
  deleteAddress(Number(userAddressGetters.getId(address)));
};

const makeDefault = (address: Address) => {
  setDefault(address);
};
</script>
