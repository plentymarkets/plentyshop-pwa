<template>
  <form
    novalidate
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="billing-address-form"
    @submit.prevent="validateAndSubmitForm"
  >
    <label>
      <UiFormLabel>
        {{ hasCompany ? t('form.firstNameLabel') : `${t('form.firstNameLabel')} ${t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        v-model="firstName"
        name="firstName"
        autocomplete="given-name"
        v-bind="firstNameAttributes"
        :invalid="Boolean(errors['firstName'])"
      />
      <ErrorMessage as="span" name="firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>
        {{ hasCompany ? t('form.lastNameLabel') : `${t('form.lastNameLabel')} ${t('form.required')}` }}
      </UiFormLabel>
      <SfInput
        v-model="lastName"
        name="lastName"
        autocomplete="family-name"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink class="select-none hover:cursor-pointer" @click="hasCompany = !hasCompany">
        {{ !hasCompany ? t('form.addCompany') : t('form.removeCompany') }}
      </SfLink>
    </div>

    <label v-if="hasCompany">
      <UiFormLabel>{{ t('form.companyLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="companyName"
        name="companyName"
        autocomplete="company"
        v-bind="companyNameAttributes"
        :invalid="Boolean(errors['companyName'])"
      />
      <ErrorMessage as="span" name="companyName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="hasCompany" class="md:col-span-2">
      <UiFormLabel>{{ t('form.vatIdLabel') }}</UiFormLabel>
      <SfInput
        v-model="vatNumber"
        autocomplete="vatNumber"
        v-bind="vatNumberAttributes"
        :invalid="invalidVAT"
        @input="clearInvalidVAT"
      />
      <span v-if="invalidVAT" class="flex text-negative-700 text-sm mt-2">
        {{ t('storefrontError.address.vatInvalid') }}
      </span>
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.streetNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="streetName"
        name="streetName"
        autocomplete="address-line1"
        v-bind="streetNameAttributes"
        :invalid="Boolean(errors['streetName'])"
      />
      <ErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.streetNumberLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="apartment"
        name="streetNumber"
        autocomplete="address-line2"
        v-bind="apartmentAttributes"
        :invalid="Boolean(errors['apartment'])"
      />
      <ErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.postalCodeLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="zipCode"
        name="zipCode"
        autocomplete="postal-code"
        v-bind="zipCodeAttributes"
        :invalid="Boolean(errors['zipCode'])"
      />
      <ErrorMessage id="billingZipCodeError" as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.cityLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="city"
        name="city"
        autocomplete="address-level2"
        v-bind="cityAttributes"
        :invalid="Boolean(errors['city'])"
      />
      <ErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-3">
      <UiFormLabel>{{ t('form.countryLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfSelect
        v-model="country"
        name="country"
        v-bind="countryAttributes"
        :placeholder="t('form.selectPlaceholder')"
        :invalid="Boolean(errors['country'])"
        wrapper-class-name="bg-white"
        class="!ring-1 !ring-neutral-200"
        autocomplete="country-name"
      >
        <option
          v-for="(billingCountry, index) in billingCountries"
          :key="`billing-country-${index}`"
          :value="billingCountry.id.toString()"
        >
          {{ billingCountry.currLangName }}
        </option>
      </SfSelect>
      <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div
      v-if="!restrictedAddresses || showAddressSaveButton"
      class="md:col-span-3 flex flex-col sm:flex-row sm:justify-end sm:items-center"
    >
      <div v-if="showAddressSaveButton" class="flex items-center">
        <UiButton
          :data-testid="`save-address-${AddressType.Billing}`"
          :disabled="formIsLoading"
          variant="secondary"
          type="submit"
        >
          {{ t('saveAddress') }}
        </UiButton>

        <UiButton
          v-if="hasCheckoutAddress"
          :disabled="formIsLoading || disabled"
          variant="secondary"
          class="ml-2"
          :data-testid="`close-address-${AddressType.Billing}`"
          :aria-label="t('closeAddressForm')"
          @click="edit"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { type Address, AddressType, ApiError, userAddressGetters } from '@plentymarkets/shop-api';
import { SfIconClose, SfInput, SfLink, SfSelect } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { AddressFormBillingProps } from './types';

const { disabled, address, addAddress = false } = defineProps<AddressFormBillingProps>();

const { isGuest, missingGuestCheckoutEmail, backToContactInformation } = useCustomer();
const { getSession } = useFetchSession();
const { shippingAsBilling } = useShippingAsBilling();
const {
  isLoading: formIsLoading,
  hasCompany,
  addressToSave,
  open: editing,
  addressToEdit,
  defaultFormValues,
  add: showNewForm,
  save: saveAddress,
  validationSchema: billingSchema,
  refreshAddressDependencies,
} = useAddressForm(AddressType.Billing);
const { invalidVAT, clearInvalidVAT } = useCreateAddress(AddressType.Billing);
const { t } = useI18n();
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setCheckoutAddress, hasCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: billingSchema });
const { billingCountries } = useAggregatedCountries();
const { restrictedAddresses } = useRestrictedAddress();
const { setBillingSkeleton } = useCheckout();

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [country, countryAttributes] = defineField('country');
const [streetName, streetNameAttributes] = defineField('streetName');
const [apartment, apartmentAttributes] = defineField('apartment');
const [city, cityAttributes] = defineField('city');
const [zipCode, zipCodeAttributes] = defineField('zipCode');
const [companyName, companyNameAttributes] = defineField('companyName');
const [vatNumber, vatNumberAttributes] = defineField('vatNumber');

const showAddressSaveButton = computed(() => editing.value || showNewForm.value);
const guestHasShippingAsBilling = computed(() => isGuest.value && shippingAsBilling.value);

if (!addAddress && address) {
  hasCompany.value = addressToSave.value?.companyName
    ? true
    : Boolean(userAddressGetters.getCompanyName(address as Address));

  const addressSource = invalidVAT.value ? addressToSave.value : address;

  setValues({
    ...address,
    firstName: addressSource?.firstName || '',
    lastName: addressSource?.lastName || '',
    country: addressSource?.country || '',
    streetName: addressSource?.streetName || '',
    apartment: addressSource?.apartment || '',
    city: addressSource?.city || '',
    zipCode: addressSource?.zipCode || '',
    companyName: addressSource.companyName || '',
    vatNumber: addressSource.vatNumber || '',
  } as unknown as Record<string, string>);

  if (!hasCompany.value) {
    companyName.value = '';
    vatNumber.value = '';
  }
}

const setDefaultFormValues = () => {
  defaultFormValues.value = {
    firstName: firstName.value,
    lastName: lastName.value,
    country: country.value,
    streetName: streetName.value,
    apartment: apartment.value,
    city: city.value,
    zipCode: zipCode.value,
    companyName: companyName.value,
    vatNumber: vatNumber.value,
  };
};

const syncCheckoutAddress = async () => {
  await setCheckoutAddress(
    addAddress || isGuest.value
      ? (billingAddresses.value[0] as Address)
      : (userAddressGetters.getDefault(billingAddresses.value) as Address),
    !addAddress,
  );

  if (guestHasShippingAsBilling.value) shippingAsBilling.value = false;
};

const validateAndSubmitForm = async () => {
  const formData = await validate();

  if (formIsLoading.value) return;
  if (missingGuestCheckoutEmail.value) return backToContactInformation();

  if (formData.valid) {
    if (hasCompany.value) setDefaultFormValues();

    try {
      setBillingSkeleton(true);
      await submitForm();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === getErrorCode('1400')) {
          await getSession();
          await submitForm();
        }
      } else if (error instanceof ApiError) {
        useHandleError(error);
      }
    } finally {
      setBillingSkeleton(false);
      formIsLoading.value = false;
    }
    if (showNewForm.value && !invalidVAT.value) showNewForm.value = false;
  }
};

const submitForm = handleSubmit((billingAddressForm) => {
  addressToSave.value = billingAddressForm as Address;

  if (guestHasShippingAsBilling.value && !addAddress) delete addressToSave.value?.id;
  if (addAddress) addressToSave.value.primary = true;
  if (!hasCompany.value) {
    addressToSave.value.companyName = '';
    addressToSave.value.vatNumber = '';
  }

  return saveAddress()
    .then(() => syncCheckoutAddress())
    .then(() => refreshAddressDependencies());
});

const edit = (address: Address) => {
  if (disabled) return;
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
};
</script>
