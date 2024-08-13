<template>
  <form
    @submit="submitForm"
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
  >
    <label>
      <UiFormLabel>{{ t('form.firstNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="firstName"
        autocomplete="given-name"
        v-model="firstName"
        v-bind="firstNameAttributes"
        :invalid="Boolean(errors['firstName'])"
      />
      <VeeErrorMessage as="span" name="firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.lastNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttributes"
        :invalid="Boolean(errors['lastName'])"
      />
      <VeeErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3">
      <SfLink href="#" class="" @click.prevent="toggleCompany">
        <span v-if="!hasCompany">{{ t('form.addCompany') }}</span>
        <span v-else>{{ t('form.removeCompany') }}</span>
      </SfLink>
    </div>

    <label v-if="hasCompany">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ t('form.companyLabel') }}</span>
        <UiFormHelperText>({{ t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        name="company"
        autocomplete="company"
        v-model="company"
        v-bind="companyAttributes"
        :invalid="Boolean(errors['company'])"
      />
      <VeeErrorMessage as="span" name="company" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="hasCompany" class="md:col-span-2">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ t('form.vatIdLabel') }}</span>
        <UiFormHelperText>({{ t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput autocomplete="vatId" v-model="vatId" v-bind="vatIdAttributes" :invalid="Boolean(errors['vatId'])" />
      <VeeErrorMessage as="span" name="vatId" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.streetNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetName"
        autocomplete="address-line1"
        v-model="streetName"
        v-bind="streetNameAttributes"
        :invalid="Boolean(errors['streetName'])"
      />
      <VeeErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.streetNumberLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetNumber"
        autocomplete="address-line2"
        v-model="apartment"
        v-bind="apartmentAttributes"
        :invalid="Boolean(errors['apartment'])"
      />
      <VeeErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.postalCodeLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="postal-code"
        v-model="zipCode"
        v-bind="zipCodeAttributes"
        :invalid="Boolean(errors['zipCode'])"
      />
      <VeeErrorMessage as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.cityLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="city"
        autocomplete="address-level2"
        v-model="city"
        v-bind="cityAttributes"
        :invalid="Boolean(errors['city'])"
      />
      <VeeErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="md:col-span-3">
      <UiFormLabel>{{ t('form.countryLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="country"
        v-bind="countryAttributes"
        :placeholder="t('form.selectPlaceholder')"
        autocomplete="country-name"
        :invalid="Boolean(errors['country'])"
      >
        <option v-for="(shippingCountry, index) in countries" :key="index" :value="shippingCountry.id.toString()">
          {{ shippingCountry.currLangName }}
        </option>
      </SfSelect>
      <VeeErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="flex items-center gap-2">
      <SfCheckbox name="combineShippingBilling" v-model="shippingAsBilling" />
      <span class="cursor-pointer select-none">{{ t('form.useAsBillingLabel') }}</span>
    </label>
  </form>
</template>

<script setup lang="ts">
import { SfInput, SfSelect, SfLink, SfCheckbox } from '@storefront-ui/vue';
import { object, string, boolean } from 'yup';
import { AddressFormProps } from './types';
import { Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';

const { address, addAddress } = withDefaults(defineProps<AddressFormProps>(), { addAddress: false });

const hasCompany = ref(false);
const { data: countries } = useActiveShippingCountries();
const { shippingAsBilling } = useShippingAsBilling();
const { addressToSave, save: saveAddress } = useAddressForm(AddressType.Shipping);
const { addresses: shippingAddresses } = useAddressStore(AddressType.Shipping);
const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
const { t } = useI18n();

const validationSchema = toTypedSchema(
  object({
    firstName: string().required(t('errorMessages.requiredField')).default(''),
    lastName: string().required(t('errorMessages.requiredField')).default(''),
    country: string().required(t('errorMessages.requiredField')).default(''),
    streetName: string().required(t('errorMessages.requiredField')).default(''),
    apartment: string().required(t('errorMessages.requiredField')).default(''),
    city: string().required(t('errorMessages.requiredField')).default(''),
    state: string().default('').optional(),
    zipCode: string().required(t('errorMessages.requiredField')).min(5),
    primary: boolean().default(false),
    company: string().optional(),
    vatId: string().optional(),
  }),
);

const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: validationSchema });

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [country, countryAttributes] = defineField('country');
const [streetName, streetNameAttributes] = defineField('streetName');
const [apartment, apartmentAttributes] = defineField('apartment');
const [city, cityAttributes] = defineField('city');
const [zipCode, zipCodeAttributes] = defineField('zipCode');
const [vatId, vatIdAttributes] = defineField('vatId');
const [company, companyAttributes] = defineField('company');

if (!addAddress) setValues(address as any);

const toggleCompany = () => {
  hasCompany.value = !hasCompany.value;
  if (!hasCompany.value) {
    company.value = '';
    vatId.value = '';
  }
};

const submitForm = handleSubmit((shippingAddressForm) => {
  addressToSave.value = shippingAddressForm;
  saveAddress()
    .then(() => {
      setCheckoutAddress(userAddressGetters.getDefault(shippingAddresses.value) as Address, true);
      return true;
    })
    .catch((error) => useHandleError(error));
});

defineExpose({ validate, submitForm });
</script>
