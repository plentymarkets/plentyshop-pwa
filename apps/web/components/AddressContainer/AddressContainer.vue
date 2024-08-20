<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex md:items-center flex-col md:flex-row justify-between mb-4">
      <h2 class="text-neutral-900 text-lg font-bold">
        {{ type === AddressType.Shipping ? $t('shipping.heading') : $t('billing.heading') }}
      </h2>

      <div class="flex justify-center">
        <AddressSelect v-if="!editing && !showNewForm" :type="type" @new="showNewForm = true" @edit="edit" />
        <UiButton v-else @click="validateAndSubmitForm" size="sm" variant="tertiary">
          {{ $t('saveAddress') }}
        </UiButton>

        <span v-if="showNewForm || hasCheckoutAddress" class="mx-2 self-center">|</span>

        <SfTooltip v-if="showNewForm || hasCheckoutAddress" :label="!editing && !showNewForm ? $t('editAddress') : ''">
          <UiButton
            v-if="(!disabled && checkoutAddress) || (!checkoutAddress && showNewForm)"
            @click="edit(checkoutAddress)"
            size="sm"
            variant="tertiary"
          >
            <template v-if="!editing && !showNewForm">
              {{ $t('contactInfo.edit') }}
            </template>
            <SfIconClose v-else size="sm" />
          </UiButton>
        </SfTooltip>
      </div>
    </div>

    <div class="mt-2">
      <template v-if="isShipping">
        <AddressFormShipping v-if="showNewForm" ref="addressFormShipping" add-address />
        <template v-else-if="hasCheckoutAddress">
          <AddressFormShipping v-if="editing" ref="addressFormShipping" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
        <div v-else class="mt-2">
          {{ $t('account.accountSettings.noAddresses') }}
        </div>
      </template>

      <template v-if="isBilling">
        <AddressFormBilling v-if="showNewForm" ref="addressFormBilling" add-address />
        <template v-else-if="hasCheckoutAddress && !showSameAsShippingText">
          <AddressFormBilling v-if="editing" ref="addressFormBilling" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
        <div v-if="showSameAsShippingText || (!hasCheckoutAddress && !showSameAsShippingText)" class="mt-2">
          {{
            $t(
              showSameAsShippingText ? 'addressContainer.sameAsShippingAddress' : 'account.accountSettings.noAddresses',
            )
          }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfTooltip } from '@storefront-ui/vue';
import { type AddressContainerProps } from './types';
import { type Address, AddressType } from '@plentymarkets/shop-api';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });

const isBilling = type === AddressType.Billing;
const isShipping = type === AddressType.Shipping;
const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);
const { shippingAsBilling } = useShippingAsBilling();
const addressToEdit = ref({} as Address);
const showNewForm = ref(false);
const addressFormShipping = ref(null as any);
const addressFormBilling = ref(null as any);

const sameAsShippingAddress = computed(() =>
  isBilling ? checkoutAddress.value?.id === useCheckoutAddress(AddressType.Shipping).checkoutAddress.value?.id : false,
);

const showSameAsShippingText = computed(
  () => sameAsShippingAddress.value && !showNewForm.value && !editing.value && shippingAsBilling.value,
);

const edit = (address: Address) => {
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
};

const validateAndSubmitForm = async () => {
  const formData = isShipping
    ? await addressFormShipping.value?.validate()
    : await addressFormBilling.value?.validate();

  if (formData.valid) {
    isShipping ? await addressFormShipping.value?.submitForm() : await addressFormBilling.value?.submitForm();
    if (showNewForm.value) showNewForm.value = false;
  }
};

watch(shippingAsBilling, () => {
  if (isBilling && !hasCheckoutAddress.value) showNewForm.value = !shippingAsBilling.value;
});

watch(
  sameAsShippingAddress,
  () => {
    if (sameAsShippingAddress.value) shippingAsBilling.value = true;
  },
  { immediate: true },
);
</script>
