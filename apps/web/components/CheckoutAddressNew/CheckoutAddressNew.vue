<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ heading }}
      </h2>
      <SfButton v-if="!disabled && addresses.length > 0 && !editMode" size="sm" variant="tertiary" @click="edit">
        {{ t('contactInfo.edit') }}
      </SfButton>
    </div>
    <div v-if="displayAddress && !editMode" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="displayAddress" />
    </div>

    <div v-if="editMode">
      <AddressFormNew
        ref="addressFormNewReference"
        :countries="activeShippingCountries"
        :saved-address="
          editMode ? addresses.find((address) => address.id?.toString() === displayAddress?.id?.toString()) : undefined
        "
        :type="type"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AddressFormNew from '~/components/AddressFormNew/AddressFormNew.vue';
import { SfButton } from '@storefront-ui/vue';
import { CheckoutAddressNewProps } from './types';

const { t } = useI18n();
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const { type, asShippingAddress, disabled } = withDefaults(defineProps<CheckoutAddressNewProps>(), {
  disabled: false,
});
const { data: addresses, displayAddress } = useAddress(type);
const noPreviousAddressWasSet = computed(() => addresses.value.length === 0);

const editMode = ref(noPreviousAddressWasSet.value);
const addressFormNewReference = ref<InstanceType<typeof AddressFormNew> | null>(null);
const heading = ref('');

getActiveShippingCountries();

const edit = () => {
  editMode.value = !editMode.value;
};

const disableEditMode = async () => {
  if (addressFormNewReference.value && editMode.value) addressFormNewReference.value.emitFormValues();
};

onMounted(() => {
  heading.value = asShippingAddress ? `${t('billing.heading')} / ${t('shipping.heading')}` : t('billing.heading');
});

defineExpose({ disableEditMode });
</script>
