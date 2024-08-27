<template>
  <SfTooltip :label="tooltipLabel">
    <UiButton variant="secondary" @click="handleAddressButtonTrigger">
      {{ buttonLabel }}
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
      <UiButton @click="close" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </UiButton>
      <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold">
        {{ t('pickSavedAddress') }}
      </h3>
      <h1 class="my-2 mb-6 font-semibold">{{ t('pickSavedAddressSubtitle') }}</h1>
    </header>

    <Address
      v-for="(address, index) in addresses"
      :key="`${type}-${index}`"
      :address="address"
      :is-selected="Number(userAddressGetters.getId(checkoutAddress)) === Number(userAddressGetters.getId(address))"
      :is-default="primaryAddressId === Number(userAddressGetters.getId(address))"
      :show-divider="Number(userAddressGetters.getId(checkoutAddress)) !== Number(userAddressGetters.getId(address))"
      @click="handleSetCheckoutAddress(address)"
      @on-delete="handleDeleteAddress(address)"
      @make-default="handleSetDefaultAddress(address)"
      @on-edit="emitEditAddressEvent(address)"
      class="group hover:bg-primary-50 cursor-pointer"
    >
      <UiDivider class="col-span-3 mx-4 !w-auto md:mx-0 group-hover:opacity-0" />
    </Address>

    <div class="flex justify-end w-full">
      <UiButton variant="secondary" class="mt-10" @click="emitNewAddressEvent">
        {{ type === AddressType.Shipping ? t('newShippingAddress') : t('newBillingAddress') }}
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { type AddressSelectProps } from './types';
import { AddressType, shippingProviderGetters, userAddressGetters } from '@plentymarkets/shop-api';
import { type Address } from '@plentymarkets/shop-api';
import { SfIconClose, useDisclosure, SfTooltip } from '@storefront-ui/vue';

const { type } = defineProps<AddressSelectProps>();

const { t } = useI18n();
const { addresses, get: getAddress } = useAddressStore(type);
const { deleteAddress } = useDeleteAddress(type);
const { primaryAddressId, set: setPrimaryAddress } = usePrimaryAddress(type);
const { checkoutAddress, set: setCheckoutAddress, clear: clearCheckoutAddress } = useCheckoutAddress(type);
const { isOpen, open, close } = useDisclosure();
const { data: customerData, getSession } = useCustomer();
const { data: cartData } = useCart();
const { selectedMethod } = useCartShippingMethods();
const { send } = useNotification();

const emit = defineEmits<{
  (event: 'edit', address: Address): void;
  (event: 'new'): void;
}>();

const tooltipLabel = computed(() =>
  addresses.value.length > 0
    ? t('manageAddresses')
    : type === AddressType.Shipping
      ? t('shipping.addButton')
      : t('billing.addButton'),
);

const buttonLabel = computed(() =>
  addresses.value.length > 0
    ? t('pickSavedAddress')
    : t(type === AddressType.Shipping ? 'newShippingAddress' : 'newBillingAddress'),
);

const emitNewAddressEvent = () => {
  emit('new');
  close();
};

const emitEditAddressEvent = (address: Address) => {
  emit('edit', address);
  close();
};

const handleAddressButtonTrigger = () => {
  if (addresses.value.length > 0) {
    open();
    return;
  }

  emitNewAddressEvent();
};

const notifyIfShippingChanged = () => {
  if (
    selectedMethod.value &&
    shippingProviderGetters.getShippingProfileId(cartData.value).toString() !==
      shippingProviderGetters.getParcelServicePresetId(selectedMethod.value)
  ) {
    send({ message: t('shipping.methodChanged'), type: 'warning' });
  }
};

const notifyIfBillingChanged = () => {
  if (cartData.value.methodOfPaymentId !== customerData.value.basket.methodOfPaymentId) {
    send({ message: t('billing.methodChanged'), type: 'warning' });
    cartData.value.methodOfPaymentId = customerData.value.basket.methodOfPaymentId;
  }
};

const refreshAddressDependencies = async () => {
  if (type === AddressType.Shipping) {
    await Promise.all([
      getSession(),
      useCartShippingMethods().getShippingMethods(),
      usePaymentMethods().fetchPaymentMethods(),
    ]);

    notifyIfShippingChanged();
    notifyIfBillingChanged();
  }
};

const persistCheckoutAddress = async (address: Address) => {
  if (checkoutAddress.value?.id === address.id) return;

  await setCheckoutAddress(address).then(() => refreshAddressDependencies());
};

const handleSetCheckoutAddress = async (address: Address) => {
  isOpen.value = false;
  persistCheckoutAddress(address);
};

const handleDeleteAddress = async (address: Address) => {
  await deleteAddress(Number(userAddressGetters.getId(address)));

  const upgradedAddress =
    primaryAddressId.value === address.id
      ? addresses.value.length > 0
        ? addresses.value[0]
        : null
      : (getAddress(primaryAddressId.value) as Address);

  upgradedAddress === null ? clearCheckoutAddress() : persistCheckoutAddress(upgradedAddress as Address);
};

const handleSetDefaultAddress = (address: Address) => {
  setPrimaryAddress(address);
  isOpen.value = false;
};
</script>
