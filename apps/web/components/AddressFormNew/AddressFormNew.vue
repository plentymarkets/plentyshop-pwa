<template>
  <form
    ref="formRef"
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-save', form)"
  >
    <label>
      <UiFormLabel>{{ $t('form.firstNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="firstName" autocomplete="given-name" v-model="form.firstName" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.lastNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="lastName" autocomplete="family-name" v-model="form.lastName" required />
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
      />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ $t('form.countryLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="form.country"
        @change="form.state = ''"
        :placeholder="$t('form.selectPlaceholder')"
        autocomplete="country-name"
        required
      >
        <option v-for="(country, index) in shippingCountries" :key="index" :value="country.id.toString()">
          {{ country.currLangName }}
        </option>
      </SfSelect>
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.streetNameLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="streetName" autocomplete="address-line1" v-model="form.streetName" required />
    </label>
    <label>
      <UiFormLabel>{{ $t('form.streetNumberLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="streetNumber" v-model="form.apartment" required />
    </label>
    <label class="md:col-span-1">
      <UiFormLabel>{{ $t('form.postalCodeLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="postalCode" autocomplete="postal-code" v-model="form.zipCode" required />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ $t('form.cityLabel') }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput name="city" autocomplete="address-level2" v-model="form.city" required />
    </label>
    <label class="md:col-span-3" v-if="states.length > 0">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ $t('form.stateLabel') }}</span>
        <UiFormHelperText>({{ $t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfSelect
        v-model="form.state"
        name="state"
        autocomplete="address-level1"
        :placeholder="$t('form.selectPlaceholder')"
      >
        <option v-for="(state, index) in states" :key="index" :value="state.id.toString()">{{ state.name }}</option>
      </SfSelect>
    </label>

    <label v-if="type === AddressType.Shipping" class="md:col-span-3 flex items-center gap-2">
      <SfCheckbox name="useAsShipping" v-model="combineShippingAndBilling" />
      {{ $t('form.useAsBillingLabel') }}
    </label>

    <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4">
      <SfButton
        type="button"
        class="max-md:w-1/2"
        variant="secondary"
        :disabled="isLoading"
        @click="reset"
      >
        {{ $t('contactInfo.clearAll') }}
      </SfButton>
      <SfButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isLoading">
        <SfLoaderCircular v-if="isLoading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import { SfButton, SfCheckbox, SfInput, SfLoaderCircular, SfSelect } from '@storefront-ui/vue';
import type { AddressFormProps } from '~/components/AddressForm/types';

const { loading: loadShipping } = useAddress(AddressType.Shipping);
const { loading: loadBilling } = useAddress(AddressType.Billing);
const { combineShippingAndBilling } = useCheckout();
const { type } = withDefaults(defineProps<AddressFormProps>(), {});
const { form, reset, states, shippingCountries } = await useAddressForm(type);
const isLoading = computed(() => loadBilling.value || loadShipping.value);

const emit = defineEmits(['on-save', 'on-close']);
const emitFormValues = () => {
  emit('on-save', form);
};
defineExpose({ emitFormValues });
</script>
