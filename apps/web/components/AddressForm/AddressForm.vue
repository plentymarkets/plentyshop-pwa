<template>
  <form
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-save', defaultValues)"
  >
    <label>
      <UiFormLabel>{{ $t('form.firstNameLabel') }}</UiFormLabel>
      <SfInput name="firstName" auto-complete="given-name" v-model="defaultValues.firstName" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.lastNameLabel') }}</UiFormLabel>
      <SfInput name="lastName" auto-complete="family-name" v-model="defaultValues.lastName" required />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.phoneLabel') }}</UiFormLabel>
      <SfInput name="phone" type="tel" auto-complete="tel" v-model="defaultValues.phone" required />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }}</UiFormLabel>
      <SfSelect
        name="country"
        :placeholder="$t('form.selectPlaceholder')"
        auto-complete="country-name"
        required
      >
        <option v-for="country in countries" :key="country">{{ country }}</option>
      </SfSelect>
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }}</UiFormLabel>
      <SfInput name="streetName" auto-complete="address-line1" v-model="defaultValues.streetName" required />
      <UiFormHelperText>{{ $t('form.streetNameHelp') }}</UiFormHelperText>
    </label>
    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }}</UiFormLabel>
      <SfInput name="streetNumber" v-model="defaultValues.streetNumber" />
      <UiFormHelperText>{{ $t('form.streetNumberHelp') }}</UiFormHelperText>
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.cityLabel') }}</UiFormLabel>
      <SfInput name="city" auto-complete="address-level2" v-model="defaultValues.city" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.stateLabel') }}</UiFormLabel>
      <SfSelect
        v-model="defaultValues.state"
        name="state"
        auto-complete="address-level1"
        :placeholder="$t('form.selectPlaceholder')"
        required
      >
        <option v-for="state in states" :key="state">{{ state }}</option>
      </SfSelect>
    </label>
    <label>
      <UiFormLabel>{{ $t('form.postalCodeLabel') }}</UiFormLabel>
      <SfInput name="postalCode" auto-complete="postal-code" v-model="defaultValues.postalCode" required />
    </label>

    <label v-if="type === 'billingAddress'" class="md:col-span-3 flex items-center gap-2">
      <SfCheckbox name="useAsShipping" />
      {{ $t('form.useAsShippingLabel') }}
    </label>

    <div class="md:col-span-3 flex justify-end gap-4">
      <SfButton type="reset" class="max-md:w-1/2" variant="secondary" @click="$emit('on-close')">
        {{ $t('contactInfo.cancel') }}
      </SfButton>
      <SfButton type="submit" class="w-1/2 md:w-1/6" :disabled="isCartUpdateLoading">
        <SfLoaderCircular v-if="isCartUpdateLoading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { userAddressGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfButton, SfCheckbox, SfInput, SfLoaderCircular, SfSelect } from '@storefront-ui/vue';
import type { AddressFormProps } from './types';

const props = defineProps<AddressFormProps>();

const isCartUpdateLoading = false;

const { savedAddress } = toRefs(props);

// TODO: find a better way for this condition.
// TODO: fix the getter for countries.
const defaultValues = ref({
  firstName: savedAddress?.value ? userAddressGetters.getFirstName(savedAddress?.value) ?? '' : '',
  lastName: savedAddress?.value ? userAddressGetters.getLastName(savedAddress?.value) ?? '' : '',
  phone: savedAddress?.value ? userAddressGetters.getPhone(savedAddress?.value) ?? '' : '',
  country: '',
  streetName: savedAddress?.value ? userAddressGetters.getStreetName(savedAddress?.value) ?? '' : '',
  streetNumber: savedAddress?.value ? userAddressGetters.getStreetNumber(savedAddress?.value) ?? '' : '',
  city: savedAddress?.value ? userAddressGetters.getCity(savedAddress?.value) ?? '' : '',
  state: savedAddress?.value ? userAddressGetters.getProvince(savedAddress?.value) ?? '' : '',
  postalCode: savedAddress?.value ? userAddressGetters.getPostCode(savedAddress?.value) ?? '' : '',
});
const countries = ['US'];
const states = ['California'];
defineEmits(['on-save', 'on-close']);
</script>
