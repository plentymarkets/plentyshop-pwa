<template>
  <header>
    <UiButton
      :aria-label="t('closeDialog')"
      type="button"
      square
      variant="tertiary"
      class="absolute right-2 top-2"
      @click="$emit('confirmCancel')"
    >
      <SfIconClose />
    </UiButton>

    <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
      {{ t('checkoutPayment.payUponInvoice') }}
    </h3>
  </header>

  <div class="grid grid-cols-1 gap-4">
    <label>
      <UiFormLabel class="flex">{{ t('checkoutPayment.birthdateLabel') }} *</UiFormLabel>
      <SfInput name="birthdate" label="Phone Number" type="date" autocomplete="bday" />
    </label>

    <UiTelephoneInput
      v-model="phone"
      :label="`${t('checkoutPayment.phoneLabel')} *`"
      :only-countries="onlyCountries"
      :default-country="defaultCountry"
      @valid-phone-number="handlePhoneNumberValidation"
    />

    <div class="text-sm text-neutral-500 mt-2">* {{ t('contact.form.asterixHint') }}</div>

    <div class="flex justify-end gap-x-4">
      <UiButton type="button" variant="secondary" @click="$emit('confirmCancel')">{{
        t('paypal.unbrandedCancel')
      }}</UiButton>
      <UiButton type="submit" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ t('paypal.unbrandedPay') }}
        </span>
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AddressType } from '@plentymarkets/shop-api';
import { SfIconClose, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { PhoneValidationResult } from '~/components/ui/TelephoneInput/types';

defineEmits(['confirmPayment', 'confirmCancel']);

const { t } = useI18n();
const { billingCountries, getCountryIsoCode } = useAggregatedCountries();
const { checkoutAddress: billingAddress } = useCheckoutAddress(AddressType.Billing);

const loading = ref(false);
const phone = ref('');

const onlyCountries = billingCountries.value.map((country) => country.isoCode2.toLowerCase());
const defaultCountry = billingAddress.value?.country ? getCountryIsoCode(billingAddress.value.country) : '';

const handlePhoneNumberValidation = (validation: PhoneValidationResult) => {
  console.log('Phone number object:', validation);
};
</script>
