<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div
      v-if="addressLoading || formIsLoading || initialFetchingAddress"
      class="flex flex-col sm:flex-row sm:items-center justify-between"
    >
      <div class="relative w-full">
        <h2 class="text-neutral-900 text-lg font-bold mb-5 mt-2">
          {{ isShipping ? t('shipping.heading') : t('billing.heading') }}
        </h2>
        <AddressDisplaySkeleton v-if="isAuthorized || (!isAuthorized && type !== AddressType.Shipping) || isGuest" />
        <AddressFormSkeleton v-else />
        <div class="absolute inset-0 z-[999] flex items-center justify-center bg-white/30">
          <SfLoaderCircular size="2xl" />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 class="text-neutral-900 text-lg font-bold">
          {{ isShipping ? t('shipping.heading') : t('billing.heading') }}
        </h2>

        <div class="flex mt-4 sm:justify-center sm:mt-0">
          <AddressSelect
            v-if="showAdressSelection"
            :type="type"
            :disabled="disabled"
            @new="showNewForm = true"
            @edit="edit"
          />

          <SfTooltip v-if="showEditAddressTooltip" :class="{ 'ml-2': showAdressSelection }" :label="t('editAddress')">
            <UiButton
              :disabled="!hasCheckoutAddress || formIsLoading || disabled"
              variant="secondary"
              :data-testid="'edit-address-' + type"
              @click="edit(checkoutAddress)"
            >
              {{ t('contactInfo.edit') }}
            </UiButton>
          </SfTooltip>
        </div>
      </div>

      <div class="mt-2">
        <template v-if="isShipping">
          <AddressFormShipping v-if="showNewForm" :disabled="disabled" add-address />
          <template v-else-if="hasCheckoutAddress">
            <AddressFormShipping v-if="editing" :disabled="disabled" :address="addressToEdit" />
            <AddressDisplay v-else :address="checkoutAddress" />
          </template>
          <div v-else class="mt-2">{{ t('account.accountSettings.noAddresses') }}</div>
        </template>

        <template v-if="isBilling">
          <AddressFormBilling v-if="showNewForm" :disabled="disabled" add-address />
          <template v-else-if="hasCheckoutAddress && !showSameAsShippingText">
            <AddressFormBilling v-if="editing" :disabled="disabled" :address="addressToEdit" />
            <AddressDisplay v-else :address="checkoutAddress" />
          </template>
          <div v-if="showDynamicAddressText" :data-testid="'address-info-text-' + type" class="mt-2">
            {{ dynamicAddressText }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfTooltip, SfLoaderCircular } from '@storefront-ui/vue';
import type { AddressContainerProps } from './types';
import { type Address, AddressType } from '@plentymarkets/shop-api';

const { disabled = false, type } = defineProps<AddressContainerProps>();

const { t } = useI18n();
const isBilling = type === AddressType.Billing;
const isShipping = type === AddressType.Shipping;
const { loading: addressLoading, checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
const { isLoading: formIsLoading, addressToEdit, add: showNewForm, open: editing } = useAddressForm(type);
const { shippingAsBilling } = useShippingAsBilling();
const { isAuthorized, isGuest } = useCustomer();
const { loading: fetchingAddress } = useFetchAddress(type);
const initialFetchingAddress = ref(true);

onMounted(() => {
  const stop = watch(fetchingAddress, (val) => {
    if (val === false) {
      initialFetchingAddress.value = false;
      stop();
    }
  });
});

const showAdressSelection = computed(() => isAuthorized.value && !editing.value && !showNewForm.value);

const sameAsShippingAddress = computed(() =>
  isBilling
    ? checkoutAddress.value?.id !== undefined &&
      checkoutAddress.value?.id === useCheckoutAddress(AddressType.Shipping).checkoutAddress.value?.id
    : false,
);

const showSameAsShippingText = computed(
  () => sameAsShippingAddress.value && !showNewForm.value && !editing.value && shippingAsBilling.value,
);

const showDynamicAddressText = computed(
  () =>
    showSameAsShippingText.value || (!hasCheckoutAddress.value && !showSameAsShippingText.value && !showNewForm.value),
);

const showEditAddressTooltip = computed(
  () => !editing.value && hasCheckoutAddress.value && !showNewForm.value && !disabled,
);

const dynamicAddressText = computed(() =>
  t(showSameAsShippingText.value ? 'addressContainer.sameAsShippingAddress' : 'account.accountSettings.noAddresses'),
);

const edit = (address: Address) => {
  if (disabled) return;
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
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
