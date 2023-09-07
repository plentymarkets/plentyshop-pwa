<template>
  <form
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-save', defaultValues, useAsShippingAddress)"
  >
    <label>
      <UiFormLabel>{{ $t('form.firstNameLabel') }}</UiFormLabel>
      <SfInput name="firstName" autocomplete="given-name" v-model="defaultValues.firstName" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.lastNameLabel') }}</UiFormLabel>
      <SfInput name="lastName" autocomplete="family-name" v-model="defaultValues.lastName" required />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.phoneLabel') }}</UiFormLabel>
      <SfInput
        name="phone"
        type="tel"
        minlength="7"
        maxlength="18"
        autocomplete="tel"
        v-model="defaultValues.phoneNumber"
      />
      <UiFormHelperText>{{ $t('form.optional') }}</UiFormHelperText>
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="defaultValues.country"
        @change="defaultValues.state = ''"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="country-name"
        required
      >
        <option v-for="(country, index) in countries" :key="index" :value="country.id.toString()">
          {{ country.name }}
        </option>
      </SfSelect>
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }}</UiFormLabel>
      <SfInput name="streetName" autocomplete="address-line1" v-model="defaultValues.streetName" required />
    </label>
    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }}</UiFormLabel>
      <SfInput name="streetNumber" v-model="defaultValues.apartment" required />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.cityLabel') }}</UiFormLabel>
      <SfInput name="city" autocomplete="address-level2" v-model="defaultValues.city" required />
    </label>
    <label class="md:col-span-2" v-if="states.length > 0">
      <UiFormLabel>{{ $t('form.stateLabel') }}</UiFormLabel>
      <SfSelect
        v-model="defaultValues.state"
        name="state"
        autocomplete="address-level1"
        :placeholder="$t('form.selectPlaceholder')"
      >
        <option v-for="(state, index) in states" :key="index" :value="state.id.toString()">{{ state.name }}</option>
      </SfSelect>
      <UiFormHelperText>{{ $t('form.optional') }}</UiFormHelperText>
    </label>
    <label>
      <UiFormLabel>{{ $t('form.postalCodeLabel') }}</UiFormLabel>
      <SfInput name="postalCode" autocomplete="postal-code" v-model="defaultValues.zipCode" required />
    </label>

    <label v-if="type === AddressType.Billing" class="md:col-span-3 flex items-center gap-2">
      <SfCheckbox name="useAsShipping" v-model="useAsShippingAddress" />
      {{ $t('form.useAsShippingLabel') }}
    </label>

    <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4">
      <SfButton
        type="button"
        class="max-md:w-1/2"
        variant="secondary"
        :disabled="isCartUpdateLoading"
        @click="clearInputs"
      >
        {{ $t('contactInfo.clearAll') }}
      </SfButton>
      <SfButton type="submit" class="min-w-[120px]" :disabled="isCartUpdateLoading">
        <SfLoaderCircular v-if="isCartUpdateLoading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { AddressType } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfCheckbox, SfInput, SfLoaderCircular, SfSelect } from '@storefront-ui/vue';
import type { AddressFormProps } from './types';

const { loading: loadBilling } = useAddress(AddressType.Billing);
const { loading: loadShipping } = useAddress(AddressType.Shipping);
const props = defineProps<AddressFormProps>();
const isCartUpdateLoading = computed(() => loadBilling.value || loadShipping.value);

const { savedAddress } = toRefs(props);
const useAsShippingAddress = ref(false);

const defaultValues = ref({
  firstName: savedAddress?.value ? userAddressGetters.getFirstName(savedAddress?.value) ?? '' : '',
  lastName: savedAddress?.value ? userAddressGetters.getLastName(savedAddress?.value) ?? '' : '',
  phoneNumber: savedAddress?.value ? userAddressGetters.getPhone(savedAddress?.value) ?? '' : '',
  country: savedAddress?.value?.country ?? '',
  streetName: savedAddress?.value ? userAddressGetters.getStreetName(savedAddress?.value) ?? '' : '',
  apartment: savedAddress?.value ? userAddressGetters.getStreetNumber(savedAddress?.value) ?? '' : '',
  city: savedAddress?.value ? userAddressGetters.getCity(savedAddress?.value) ?? '' : '',
  state: savedAddress?.value ? userAddressGetters.getProvince(savedAddress?.value) ?? '' : '',
  zipCode: savedAddress?.value ? userAddressGetters.getPostCode(savedAddress?.value) ?? '' : '',
});

const clearInputs = () => {
  defaultValues.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    streetName: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
  };
};

const states = computed(() => {
  const selectedCountry = defaultValues.value.country;
  return props.countries.find((country) => country.id === Number(selectedCountry))?.states ?? [];
});

defineEmits(['on-save', 'on-close']);
</script>
