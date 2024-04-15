<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <SfButton v-if="!disabled && addresses.length > 0 && !editMode" size="sm" variant="tertiary" @click="edit">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>
    <div v-if="selectedAddress && !editMode" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="selectedAddress" />
    </div>

    <div v-if="editMode">
      <AddressFormNew
        :countries="activeShippingCountries"
        :saved-address="
          editMode ? addresses.find((address) => address.id?.toString() === selectedAddress?.id?.toString()) : undefined
        "
        :type="type"
        @on-save="saveAddress"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { type Address, AddressType } from '@plentymarkets/shop-api';
import { cartGetters, userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from '~/components/CheckoutAddress/types';

const { saveAddress: saveBillingAddress } = useAddress(AddressType.Billing);
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const props = withDefaults(defineProps<CheckoutAddressProps>(), {
  disabled: false,
});
const { data: cart } = useCart();
const noPreviousAddressWasSet = computed(() => props.addresses.length === 0);

const editMode = ref(noPreviousAddressWasSet.value);

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

const edit = () => {
  editMode.value = !editMode.value;
};

const saveAddress = async (address: Address, useAsShippingAddress: boolean = false) => {
  // see if checbox is set, and if yes overwrite please
  // console.log('saveing');
  // console.log(useAsShippingAddress);
  if (props.type === AddressType.Billing) {
    await saveBillingAddress(address);
    if (useAsShippingAddress) {
      await saveShippingAddress(address);
    }
  }
  if (props.type === AddressType.Shipping || useAsShippingAddress) {
    await saveShippingAddress(address);
  }
  emit('on-saved');
  editMode.value = false;
};
</script>
