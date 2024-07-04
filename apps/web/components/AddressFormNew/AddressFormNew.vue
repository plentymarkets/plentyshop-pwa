<template>
  <form ref="formRef" class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4" data-testid="address-form">
    <label>
      <UiFormLabel>{{ $t('form.firstNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="given-name"
        v-model="form.firstName"
        v-bind="attributes.firstNameAttribures"
        :invalid="Boolean(errors['form.firstName'])"
      />
      <VeeErrorMessage as="span" name="form.firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.lastNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="family-name"
        v-model="form.lastName"
        v-bind="attributes.lastNameAttribures"
        :invalid="Boolean(errors['form.lastName'])"
      />
      <VeeErrorMessage as="span" name="form.lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ $t('form.phoneLabel') }}</span>
        <UiFormHelperText>({{ $t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        name="phone"
        type="tel"
        minlength="7"
        maxlength="18"
        autocomplete="tel"
        v-model="form.phoneNumber"
        v-bind="attributes.phoneNumberAttribures"
        :invalid="Boolean(errors['form.phoneNumber'])"
      />
      <VeeErrorMessage as="span" name="form.phoneNumber" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="form.country"
        v-bind="attributes.countryAttribures"
        @change="form.state = ''"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="country-name"
        :invalid="Boolean(errors['form.country'])"
      >
        <option v-for="(country, index) in shippingCountries" :key="index" :value="country.id.toString()">
          {{ country.currLangName }}
        </option>
      </SfSelect>
      <VeeErrorMessage as="span" name="form.country" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetName"
        autocomplete="address-line1"
        v-model="form.streetName"
        v-bind="attributes.streetNameAttribures"
        :invalid="Boolean(errors['form.streetName'])"
      />
      <VeeErrorMessage as="span" name="form.streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="streetNumber" autocomplete="address-line2" v-model="form.apartment" v-bind="attributes.apartmentAttribures" :invalid="Boolean(errors['form.apartment'])" />
      <VeeErrorMessage as="span" name="form.apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-1">
      <UiFormLabel>{{ $t('form.postalCodeLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput autocomplete="postal-code" v-model="form.zipCode" v-bind="attributes.zipCodeAttribures" :invalid="Boolean(errors['form.zipCode'])" />
      <VeeErrorMessage as="span" name="form.zipCode" class="flex text-negative-700 text-sm mt-2" />

    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.cityLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="city" autocomplete="address-level2" v-model="form.city" v-bind="attributes.cityAttribures" :invalid="Boolean(errors['form.city'])" />
      <VeeErrorMessage as="span" name="form.city" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3" v-if="states.length > 0">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ $t('form.stateLabel') }}</span>
        <UiFormHelperText>({{ $t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfSelect
        v-model="form.state"
        v-bind="attributes.stateAttribures"
        name="state"
        autocomplete="address-level1"
        :placeholder="$t('form.selectPlaceholder')"
        :invalid="Boolean(errors['form.state'])"
      >
        <option v-for="(state, index) in states" :key="index" :value="state.id.toString()">{{ state.name }}</option>
      </SfSelect>
      <VeeErrorMessage as="span" name="form.state" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3 flex">
      <label v-if="type === AddressType.Shipping" class="md:col-span-3 flex items-center gap-2">
        <SfCheckbox name="useAsShipping" v-model="combineShippingAndBilling" />
        {{ $t('form.useAsBillingLabel') }}
      </label>
      <SfButton type="button" class="max-md:w-1/2 ml-auto" variant="secondary" :disabled="isLoading" @click="reset">
        {{ $t('contactInfo.clearAll') }}
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import { SfButton, SfCheckbox, SfInput, SfSelect } from '@storefront-ui/vue';
import type { AddressFormProps } from '~/components/AddressFormNew/types';

const { combineShippingAndBilling } = useCheckout();
const { type } = withDefaults(defineProps<AddressFormProps>(), {});
const { states, shippingCountries, isLoading, reset, errors, form, attributes } = useAddressForm(type);
</script>
