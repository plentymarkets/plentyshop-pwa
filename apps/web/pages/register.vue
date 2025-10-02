<template>
  <NuxtLayout name="auth" :heading="''">
    <div class="w-full max-w-full md:max-w-4xl lg:max-w-3xl xl:max-w-4xl mx-auto md:px-6 lg:px-8">
      <div class="text-center mb-8">
        <div class="text-2xl font-semibold mb-2">{{ t('auth.signup.heading') }}</div>
        <div class="text-lg text-gray-600 mb-6">{{ t('auth.signup.subheading') }}</div>
      </div>

      <form
        novalidate
        class="max-w-2xl mx-auto bg-white rounded-lg md:shadow-sm md:border md:border-gray-100 md:p-6 lg:p-8 space-y-4 mb-8"
        @submit.prevent="onSubmit"
      >
        <label class="w-full">
          <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
          <SfInput
            v-model="formFields.email.value"
            v-bind="formFieldsAttributes.email"
            :invalid="!!errors['email']"
            name="customerEmail"
            type="email"
            autocomplete="email"
          />
          <ErrorMessage as="span" name="email" class="flex text-negative-700 text-sm mt-2" />
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <UiFormLabel>{{ t('form.passwordLabel') }} {{ t('form.required') }}</UiFormLabel>
            <UiFormPasswordInput
              v-model="formFields.password.value"
              :title="t('invalidPassword')"
              name="password"
              autocomplete="current-password"
              v-bind="formFieldsAttributes.password"
              :invalid="!!errors['password']"
            />
          </label>

          <label>
            <UiFormLabel>{{ t('form.repeatPasswordLabel') }} {{ t('form.required') }}</UiFormLabel>
            <UiFormPasswordInput
              v-model="formFields.repeatPassword.value"
              :title="t('invalidPassword')"
              name="password"
              autocomplete="current-password"
              v-bind="formFieldsAttributes.repeatPassword"
              :invalid="!!errors['repeatPassword']"
            />
            <ErrorMessage as="span" name="repeatPassword" class="flex text-negative-700 text-sm mt-2" />
          </label>
        </div>

        <div class="select-none bg-gray-50 p-4 rounded-lg my-4 space-y-1 text-xs">
          <div
            class="flex items-center"
            :class="{ 'text-green-600': passwordValidationLength, 'text-gray-500': !passwordValidationLength }"
          >
            <SfIconCheck v-if="passwordValidationLength" size="sm" class="mr-2" />
            <SfIconClose v-else size="sm" class="mr-2" />
            {{ t('auth.signup.passwordValidation.characters') }}
          </div>
          <div
            class="flex items-center"
            :class="{ 'text-green-600': passwordValidationOneDigit, 'text-gray-500': !passwordValidationOneDigit }"
          >
            <SfIconCheck v-if="passwordValidationOneDigit" size="sm" class="mr-2" />
            <SfIconClose v-else size="sm" class="mr-2" />
            {{ t('auth.signup.passwordValidation.numbers') }}
          </div>
          <div
            class="flex items-center"
            :class="{
              'text-green-600': passwordValidationOneLetter,
              'text-gray-500': !passwordValidationOneLetter,
            }"
          >
            <SfIconCheck v-if="passwordValidationOneLetter" size="sm" class="mr-2" />
            <SfIconClose v-else size="sm" class="mr-2" />
            {{ t('auth.signup.passwordValidation.letters') }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <UiFormLabel>
              {{ hasCompany ? t('form.firstNameLabel') : `${t('form.firstNameLabel')} ${t('form.required')}` }}
            </UiFormLabel>
            <SfInput
              v-model="formFields.firstName.value"
              name="firstName"
              autocomplete="given-name"
              v-bind="formFieldsAttributes.firstName"
              :invalid="!!errors['firstName']"
            />
            <ErrorMessage as="span" name="firstName" class="flex text-negative-700 text-sm mt-2" />
          </label>

          <label>
            <UiFormLabel>
              {{ hasCompany ? t('form.lastNameLabel') : `${t('form.lastNameLabel')} ${t('form.required')}` }}
            </UiFormLabel>
            <SfInput
              v-model="formFields.lastName.value"
              name="lastName"
              autocomplete="family-name"
              v-bind="formFieldsAttributes.lastName"
              :invalid="!!errors['lastName']"
            />
            <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
          </label>
        </div>

        <div class="grid grid-cols-1">
          <SfLink class="select-none hover:cursor-pointer" @click="hasCompany = !hasCompany">
            {{ !hasCompany ? t('form.addCompany') : t('form.removeCompany') }}
          </SfLink>
        </div>

        <div v-if="hasCompany" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <UiFormLabel>{{ t('form.companyLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-model="formFields.companyName.value"
              name="companyName"
              autocomplete="company"
              v-bind="formFieldsAttributes.companyName"
              :invalid="!!errors['companyName']"
            />
            <ErrorMessage as="span" name="companyName" class="flex text-negative-700 text-sm mt-2" />
          </label>

          <label>
            <UiFormLabel>{{ t('form.vatIdLabel') }}</UiFormLabel>
            <SfInput
              v-model="formFields.vatNumber.value"
              autocomplete="vatNumber"
              v-bind="formFieldsAttributes.vatNumber"
              :invalid="invalidVAT"
              @input="clearInvalidVAT"
            />
            <span v-if="invalidVAT" class="flex text-negative-700 text-sm mt-2">
              {{ t('storefrontError.address.vatInvalid') }}
            </span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <UiFormLabel>{{ t('form.streetNameLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-model="formFields.streetName.value"
              name="streetName"
              autocomplete="address-line1"
              v-bind="formFieldsAttributes.streetName"
              :invalid="!!errors['streetName']"
            />
            <ErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
          </label>

          <label>
            <UiFormLabel>{{ t('form.streetNumberLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-model="formFields.apartment.value"
              name="streetNumber"
              autocomplete="address-line2"
              v-bind="formFieldsAttributes.apartment"
              :invalid="!!errors['apartment']"
            />
            <ErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <UiFormLabel>{{ t('form.cityLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-model="formFields.city.value"
              name="city"
              autocomplete="address-level2"
              v-bind="formFieldsAttributes.city"
              :invalid="!!errors['city']"
            />
            <ErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
          </label>

          <label>
            <UiFormLabel>{{ t('form.postalCodeLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-model="formFields.zipCode.value"
              name="zipCode"
              autocomplete="postal-code"
              v-bind="formFieldsAttributes.zipCode"
              :invalid="!!errors['zipCode']"
            />
            <ErrorMessage as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
          </label>
        </div>

        <div class="grid grid-cols-1">
          <label class="w-full">
            <UiFormLabel>{{ t('form.countryLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfSelect
              v-model="formFields.country.value"
              name="country"
              v-bind="formFieldsAttributes.country"
              :placeholder="t('form.selectPlaceholder')"
              :invalid="!!errors['country']"
              wrapper-class-name="bg-white"
              class="!ring-1 !ring-neutral-200"
              autocomplete="country-name"
            >
              <option
                v-for="(shippingCountry, index) in shippingCountries"
                :key="`shipping-country-${index}`"
                :value="shippingCountry.id.toString()"
              >
                {{ shippingCountry.currLangName }}
              </option>
            </SfSelect>
            <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
          </label>
        </div>

        <div class="flex items-start space-x-3">
          <SfCheckbox
            id="privacyPolicy"
            v-model="formFields.privacyPolicy.value"
            v-bind="formFieldsAttributes.privacyPolicy"
            value="value"
            class="mt-1 peer"
          />
          <label
            class="text-sm text-neutral-900 cursor-pointer peer-disabled:text-disabled-900 select-none leading-relaxed"
            for="privacyPolicy"
          >
            <i18n-t keypath="form.privacyPolicyLabel" scope="global">
              <template #privacyPolicy>
                <SfLink
                  :href="localePath(paths.privacyPolicy)"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-700 underline focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ t('privacyPolicy') }}
                </SfLink>
              </template>
            </i18n-t>
            {{ t('form.required') }}
          </label>
        </div>
        <ErrorMessage as="div" name="privacyPolicy" class="text-negative-700 text-left text-sm -mt-2" />

        <NuxtTurnstile
          v-if="turnstileSiteKey.length > 0 && turnstileLoad"
          v-bind="formFieldsAttributes.turnstile"
          :site-key="turnstileSiteKey"
          ref="turnstileElement"
          v-model="formFields.turnstile.value"
          :options="{ theme: 'light' }"
          class="flex justify-center"
        />
        <ErrorMessage as="div" name="turnstile" class="text-negative-700 text-center text-sm -mt-2" />

        <div class="grid grid-cols-1 gap-4">
          <UiButton type="submit" class="py-3 text-base font-medium" :disabled="loading">
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
            <template v-else>{{ t('auth.signup.submitLabel') }}</template>
          </UiButton>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ErrorMessage } from 'vee-validate';
import { paths } from '~/utils/paths';
import { useRegisterForm } from '~/composables/useRegisterForm';
import { SfLink, SfInput, SfLoaderCircular, SfCheckbox, SfIconCheck, SfIconClose, SfSelect } from '@storefront-ui/vue';

const { default: shippingCountries, fetchAggregatedCountries } = useAggregatedCountries();
const localePath = useLocalePath();
const { loading } = useCustomer();
const { t } = useI18n();
const { send: _send } = useNotification();
definePageMeta({ layout: false, middleware: ['guest-guard'] });
usePageMeta().setPageMeta(t('auth.signup.submitLabel'), 'page');
const turnstileLoad = ref(false);
const {
  hasCompany,
  invalidVAT,
  turnstileElement,
  errors,
  onSubmit,
  passwordValidationLength,
  passwordValidationOneDigit,
  passwordValidationOneLetter,
  turnstileSiteKey,
  formFields,
  formFieldsAttributes,
} = useRegisterForm();

onNuxtReady(async () => {
  if (!shippingCountries.value?.length) await fetchAggregatedCountries();
});

const clearInvalidVAT = () => (invalidVAT.value = false);

if (turnstileSiteKey.length > 0) {
  const turnstileWatcher = watch(Object.values(formFields), (data) => {
    if (data.some((field) => field && typeof (field) === "string" && field.length > 0)) {
      turnstileLoad.value = true;
      turnstileWatcher();
    }
  });
}
</script>
