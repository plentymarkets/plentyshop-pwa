<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <SfButton v-if="addresses.length > 0" size="sm" variant="tertiary" @click="edit">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>

    <div v-if="addresses.length > 0 && isAuth" class="mt-2 md:w-[520px]">
      <SfSelect v-model="selectedAddress">
        <option v-for="(address, index) in addresses" :key="index" :value="address.id?.toString()">
          {{ `${userAddressGetters.getFirstName(address)} ${userAddressGetters.getLastName(address)}` }}
        </option>
      </SfSelect>
    </div>

    <div v-if="addresses.length === 1 && !isAuth" class="mt-2 md:w-[520px]">
      <p>{{ `${userAddressGetters.getFirstName(addresses[0])} ${userAddressGetters.getLastName(addresses[0])}` }}</p>
      <p>{{ userAddressGetters.getPhone(addresses[0]) }}</p>
      <p>{{ userAddressGetters.getStreetName(addresses[0]) }} {{ userAddressGetters.getStreetNumber(addresses[0]) }}</p>
      <p>{{ `${userAddressGetters.getProvince(addresses[0])} ${userAddressGetters.getPostCode(addresses[0])}` }}</p>
    </div>

    <div class="w-full md:max-w-[520px]" v-if="isAuth || addresses.length === 0">
      <p v-if="addresses.length === 0">{{ description }}</p>
      <SfButton class="mt-4 w-full md:w-auto" variant="secondary" @click="create">
        {{ buttonText }}
      </SfButton>
    </div>

    <UiOverlay v-if="isOpen" :visible="isOpen">
      <SfModal
        v-model="isOpen"
        as="section"
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
            editMode ? addresses.find((address) => address.id?.toString() === selectedAddress) : undefined
          "
          :type="type"
          @on-save="saveAddress"
          @on-close="close"
        />
      </SfModal>
    </UiOverlay>
  </div>
</template>
<script lang="ts" setup>
import { Address, AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { userAddressGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfSelect, SfButton, SfIconClose, SfModal, useDisclosure } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from './types';

const { isOpen, open, close } = useDisclosure();
const isAuth = false;
const { saveBillingAddress } = useBillingAddress();
const { saveShippingAddress } = useShippingAddress();
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
await getActiveShippingCountries();

const props = defineProps<CheckoutAddressProps>();
const editMode = ref(false);
const selectedAddress = computed(() => props.addresses?.[0]?.id?.toString() || '');
const emit = defineEmits(['on-saved']);

function create() {
  editMode.value = false;
  open();
}

function edit() {
  editMode.value = true;
  open();
}

async function saveAddress(address: Address, useAsShippingAddress: boolean = false) {
  if (props.type === AddressType.Billing) {
    await saveBillingAddress(address);
  }
  if (props.type === AddressType.Shipping || useAsShippingAddress) {
    await saveShippingAddress(address);
  }
  emit('on-saved');
  close();
}
</script>
