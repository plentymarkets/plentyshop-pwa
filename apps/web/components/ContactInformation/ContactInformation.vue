<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <h2 class="w-full text-neutral-900 text-lg font-bold">
      {{ t('contactInfo.heading') }}
    </h2>

    <div v-if="!disabled && (isGuest || (!isAuthorized && !isGuest))" class="w-full flex flex-col sm:flex-row mb-4">
      <div>{{ t('auth.signup.alreadyHaveAccount') }}</div>
      <SfLink class="select-none hover:cursor-pointer sm:ml-2" @click="openAuthentication">
        {{ t('auth.signup.logInLinkLabel') }}
      </SfLink>
    </div>

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
          name="customerEmail"
          type="email"
          autocomplete="email"
          @blur="validateAndSubmitEmail"
        />
        <ErrorMessage as="span" name="customerEmail" class="flex text-negative-700 text-sm mt-2" />
      </label>
    </form>

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
import { toTypedSchema } from '@vee-validate/yup';
import { ErrorMessage, useForm } from 'vee-validate';
import { object, string } from 'yup';
import type { ContactInformationProps } from './types';

const { disabled = false } = defineProps<ContactInformationProps>();

const { t } = useI18n();
const { data: sessionData, loginAsGuest, getSession, isAuthorized, isGuest } = useCustomer();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { persistShippingAddress, persistBillingAddress } = useCheckout();
const guestEmail = ref(sessionData.value?.user?.guestMail ?? '');

const emailSchema = toTypedSchema(
  object({
    customerEmail: string()
      .email(t('errorMessages.email.valid'))
      .required(t('errorMessages.email.required'))
      .default(sessionData.value?.user?.email ?? guestEmail.value),
  }),
);

const { errors, defineField, validate } = useForm({ validationSchema: emailSchema });
const [customerEmail, customerEmailAttributes] = defineField('customerEmail');

const validateAndSubmitEmail = async () => {
  const formData = await validate();
  const updatedEmail = customerEmail.value as string;
  const shouldSaveEmail = updatedEmail.trim().toLowerCase() !== guestEmail.value.trim().toLowerCase();

  if (formData.valid && shouldSaveEmail) {
    await saveContactInformation(updatedEmail);
    guestEmail.value = updatedEmail;
  }
};

const saveContactInformation = async (email: string) => {
  await loginAsGuest(email);
  await getSession();
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
  await useFetchAddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress());

  await useFetchAddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await checkPayPalPaymentsEligible();
  closeAuthentication();
};
</script>
