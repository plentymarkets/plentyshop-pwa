<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <h2 class="w-full text-neutral-900 text-lg font-bold mb-4">
      {{ t('contactInfo.heading') }}
    </h2>

    <div v-if="customerEmail && isAuthorized" class="w-full">{{ t('contactInfo.email') }}: {{ customerEmail }}</div>

    <form v-if="(!isAuthorized && !isGuest) || isGuest" data-testid="contact-information-form" novalidate>
      <label>
        <UiFormLabel>{{ t('contactInfo.email') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput
          v-model="customerEmail"
          wrapper-class="focus:outline focus:outline-offset-1 focus:outline-1 focus-within:outline focus-within:outline-offset-1 focus-within:outline-1"
          :autofocus="!customerEmail"
          v-bind="customerEmailAttributes"
          :invalid="Boolean(errors['customerEmail'])"
          :disabled="disabled"
          name="customerEmail"
          type="email"
          autocomplete="email"
          @blur="validateAndSubmitEmail"
        />
        <ErrorMessage
          id="customerEmailError"
          as="span"
          name="customerEmail"
          class="flex text-negative-700 text-sm mt-2"
        />
      </label>
    </form>

    <div v-if="!disabled && (isGuest || (!isAuthorized && !isGuest))" class="w-full flex flex-col sm:flex-row mt-4">
      <div>{{ t('auth.signup.alreadyHaveAccount') }}</div>
      <SfLink class="select-none hover:cursor-pointer sm:ml-2" @click="openAuthentication">
        {{ t('auth.signup.logInLinkLabel') }}
      </SfLink>
    </div>

    <UiModal
      v-if="isAuthenticationOpen"
      v-model="isAuthenticationOpen"
      tag="section"
      class="h-full w-full overflow-auto md:w-[500px] md:h-fit"
    >
      <header>
        <UiButton
          :aria-label="t('closeDialog')"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeAuthentication"
        >
          <SfIconClose />
        </UiButton>
      </header>
      <LoginComponent :is-soft-login="true" :is-modal="true" @logged-in="handleSuccessfulLogin" />
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { AddressType } from '@plentymarkets/shop-api';
import { SfIconClose, SfInput, SfLink, useDisclosure } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { ContactInformationProps } from './types';
import { useFetchAddressesData } from '~/composables/useAddressV2/useFetchAddressesData';

const { disabled = false } = defineProps<ContactInformationProps>();

const { t } = useI18n();
const { user, loginAsGuest, isAuthorized, isGuest, validGuestEmail, emailValidationSchema } = useCustomer();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { persistShippingAddress, persistBillingAddress } = useCheckout();

const { errors, defineField, validate } = useForm({ validationSchema: emailValidationSchema });
const [customerEmail, customerEmailAttributes] = defineField('customerEmail');

watch(isAuthorized, (updatedStatus) => {
  customerEmail.value = updatedStatus ? (user.value?.email ?? '') : (user.value?.guestMail ?? '');
});

watch(isGuest, (isGuestStatus) => {
  if (isGuestStatus) {
    customerEmail.value = user.value?.guestMail ?? '';
  }
});

const validateAndSubmitEmail = async () => {
  const formData = await validate();

  validGuestEmail.value = formData.valid;
  if (!validGuestEmail.value) return;

  const guestEmail = customerEmail.value as string;

  const shouldUpdateEmail =
    user.value?.guestMail && user.value.guestMail.trim().toLowerCase() !== guestEmail.trim().toLowerCase();

  shouldUpdateEmail ? await handleGuestEmailChange(guestEmail) : await saveContactInformation(guestEmail);
};

const handleGuestEmailChange = async (updatedEmail: string) => {
  await saveContactInformation(updatedEmail);

  useCheckoutAddress(AddressType.Shipping).clear();
  useCheckoutAddress(AddressType.Billing).clear();

  await useFetchAddressesData()
    .fetchServer()
    .then(() => persistShippingAddress());

  await useFetchAddressesData()
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await checkPayPalPaymentsEligible();
};

const saveContactInformation = async (email: string) => {
  await loginAsGuest(email);
};

const checkPayPalPaymentsEligible = async () => {
  if (import.meta.client) {
    const googlePayAvailable = await useGooglePay().checkIsEligible();
    const applePayAvailable = await useApplePay().checkIsEligible();

    if (googlePayAvailable || applePayAvailable) {
      await usePaymentMethods().fetchPaymentMethods();
    }
  }
};

const handleSuccessfulLogin = async () => {
  await useFetchAddressesData()
    .fetchServer()
    .then(() => persistShippingAddress());

  await useFetchAddressesData()
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await checkPayPalPaymentsEligible();
  closeAuthentication();
};
</script>
