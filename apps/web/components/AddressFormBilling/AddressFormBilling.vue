<template>
  <form ref="billingForm" class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4" data-testid="address-form">
    <label>
      <UiFormLabel>{{ t('form.firstNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="firstName"
        autocomplete="given-name"
        v-model="firstName"
        v-bind="firstNameAttribures"
        :invalid="Boolean(errors['form.firstName'])"
      />
      <VeeErrorMessage as="span" name="form.firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.lastNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttribures"
        :invalid="Boolean(errors['form.lastName'])"
      />
      <VeeErrorMessage as="span" name="form.lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ t('form.phoneLabel') }}</span>
        <UiFormHelperText>({{ t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        name="phone"
        type="tel"
        minlength="7"
        maxlength="18"
        autocomplete="tel"
        v-model="phoneNumber"
        v-bind="phoneNumberAttribures"
        :invalid="Boolean(errors['form.phoneNumber'])"
      />
      <VeeErrorMessage as="span" name="form.phoneNumber" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3">
      <UiFormLabel>{{ t('form.countryLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfSelect
        name="country"
        v-model="country"
        v-bind="countryAttribures"
        @change="state = ''"
        :placeholder="t('form.selectPlaceholder')"
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
      <UiFormLabel>{{ t('form.streetNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetName"
        autocomplete="address-line1"
        v-model="streetName"
        v-bind="streetNameAttribures"
        :invalid="Boolean(errors['form.streetName'])"
      />
      <VeeErrorMessage as="span" name="form.streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label>
      <UiFormLabel>{{ t('form.streetNumberLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="streetNumber"
        autocomplete="address-line2"
        v-model="apartment"
        v-bind="apartmentAttribures"
        :invalid="Boolean(errors['form.apartment'])"
      />
      <VeeErrorMessage as="span" name="form.apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-1">
      <UiFormLabel>{{ t('form.postalCodeLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        autocomplete="postal-code"
        v-model="zipCode"
        v-bind="zipCodeAttribures"
        :invalid="Boolean(errors['form.zipCode'])"
      />
      <VeeErrorMessage as="span" name="form.zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-2">
      <UiFormLabel>{{ t('form.cityLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        name="city"
        autocomplete="address-level2"
        v-model="city"
        v-bind="cityAttribures"
        :invalid="Boolean(errors['form.city'])"
      />
      <VeeErrorMessage as="span" name="form.city" class="flex text-negative-700 text-sm mt-2" />
    </label>
    <label class="md:col-span-3" v-if="states.length > 0">
      <UiFormLabel class="flex">
        <span class="mr-1">{{ t('form.stateLabel') }}</span>
        <UiFormHelperText>({{ t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfSelect
        v-model="state"
        v-bind="stateAttribures"
        name="state"
        autocomplete="address-level1"
        :placeholder="t('form.selectPlaceholder')"
        :invalid="Boolean(errors['form.state'])"
      >
        <option v-for="(state, index) in states" :key="index" :value="state.id.toString()">{{ state.name }}</option>
      </SfSelect>
      <VeeErrorMessage as="span" name="form.state" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="md:col-span-3 flex">
      <SfButton type="button" class="max-md:w-1/2 ml-auto" variant="secondary" :disabled="isLoading" @click="resetForm">
        {{ t('contactInfo.clearAll') }}
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Address, AddressType } from '@plentymarkets/shop-api';
import { SfButton, SfInput, SfSelect } from '@storefront-ui/vue';
import { object, string, boolean, number } from 'yup';

const { isLoading, onValidationStart, onValidationEnd, setFormAddress } = useAddressForm(AddressType.Billing);
const { data: shippingCountries } = useActiveShippingCountries();

const { t } = useI18n();
const validationSchema = toTypedSchema(
  object({
    form: object({
      firstName: string().required(t('errorMessages.requiredField')).default(''),
      lastName: string().required(t('errorMessages.requiredField')).default(''),
      phoneNumber: number().optional(),
      country: string().required(t('errorMessages.requiredField')).default(''),
      streetName: string().required(t('errorMessages.requiredField')).default(''),
      apartment: string().required(t('errorMessages.requiredField')).default(''),
      city: string().required(t('errorMessages.requiredField')).default(''),
      state: string().default('').optional(),
      zipCode: string().required(t('errorMessages.requiredField')).default(''),
      primary: boolean().default(false),
    }),
  }),
);

const { defineField, errors, values, resetForm, validate } = useForm({
  validationSchema: validationSchema,
});

watch(setFormAddress, (newAddress) => {
  if (newAddress) {
    values.form = newAddress;
  }
});

watch(onValidationStart, async (startValidation) => {
  if (startValidation) {
    const validation = await validate();
    onValidationEnd.value = {
      address: values.form as Address,
      validation
    };
  }
});

const [firstName, firstNameAttribures] = defineField('form.firstName');
const [lastName, lastNameAttribures] = defineField('form.lastName');
const [phoneNumber, phoneNumberAttribures] = defineField('form.phoneNumber');
const [country, countryAttribures] = defineField('form.country');
const [streetName, streetNameAttribures] = defineField('form.streetName');
const [apartment, apartmentAttribures] = defineField('form.apartment');
const [city, cityAttribures] = defineField('form.city');
const [state, stateAttribures] = defineField('form.state');
const [zipCode, zipCodeAttribures] = defineField('form.zipCode');

const states = computed(() => {
  const selectedCountry = values.form?.country;
  return shippingCountries.value.find((country) => country.id === Number(selectedCountry))?.states ?? [];
});
</script>
