<template>
  <NuxtLayout name="auth" :heading="t('auth.setNewPassword.heading')">
    <form
      novalidate
      class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md"
      @submit.prevent="executeResetPassword"
    >
      <p class="mb-6">{{ t('auth.setNewPassword.description') }}</p>

      <label class="block mb-4">
        <UiFormLabel>{{ t('auth.setNewPassword.password') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="password"
          name="password"
          autocomplete="current-password"
          :invalid="passwordTouched && !isPasswordFormatValid"
          @input="stripSpaces('password')"
          @blur="passwordTouched = true"
        />
        <span v-if="passwordTouched && passwordErrorMessage" class="flex text-negative-700 text-sm mt-2">
          {{ passwordErrorMessage }}
        </span>
      </label>

      <div class="select-none bg-gray-50 p-4 rounded-lg mt-4 mb-3 space-y-1 text-xs">
        <div
          class="flex items-center"
          :class="{ 'text-green-600': passwordValidationLength, 'text-gray-500': !passwordValidationLength }"
        >
          <SfIconCheck v-if="passwordValidationLength" size="sm" class="mr-2" />
          <SfIconClose v-else size="sm" class="mr-2" />
          {{ t('auth.signup.passwordValidation.characters', { min: passwordMinLength, max: passwordMaxLength }) }}
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

      <label>
        <UiFormLabel>{{ t('auth.setNewPassword.repeatPassword') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="repeatPassword"
          name="repeatedPassword"
          autocomplete="current-password"
          :invalid="repeatPasswordTouched && !isRepeatPasswordValid"
          @input="stripSpaces('repeatPassword')"
          @blur="repeatPasswordTouched = true"
        />
        <span v-if="repeatPasswordTouched && repeatPasswordErrorMessage" class="flex text-negative-700 text-sm mt-2">
          {{ repeatPasswordErrorMessage }}
        </span>
      </label>

      <div class="text-center mt-6">
        <UiButton type="submit" class="w-1/2" :disabled="loading">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <span v-else>
            {{ t('auth.setNewPassword.button') }}
          </span>
        </UiButton>
      </div>

      <div class="text-center mt-2">
        <span class="my-5 mr-1">{{ t('auth.setNewPassword.rememberPassword') }}</span>
        <SfLink variant="primary" class="cursor-pointer" @click="openAuthentication">
          {{ t('account.navBottomHeadingLogin') }}
        </SfLink>
      </div>
    </form>

    <UiModal
      v-if="isAuthenticationOpen"
      v-model="isAuthenticationOpen"
      tag="section"
      class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
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
      <LoginComponent :is-soft-login="true" :is-modal="true" @logged-in="navigateAfterAuth" />
    </UiModal>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { ApiError } from '@plentymarkets/shop-api';
import { SfLink, SfLoaderCircular, useDisclosure, SfIconClose, SfIconCheck } from '@storefront-ui/vue';

const { resetPassword, loading } = useResetPassword();
const { t } = useI18n();
const route = useRoute();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const localePath = useLocalePath();
const { send } = useNotification();
const { fetchSession } = useFetchSession();
const runtimeConfig = useRuntimeConfig();

const password = ref('');
const repeatPassword = ref('');
const passwordTouched = ref(false);
const repeatPasswordTouched = ref(false);

const hash = route.params.hash as string;
const contactId = Number(route.params.contactId);
const passwordMinLength = runtimeConfig.public.passwordMinLength;
const passwordMaxLength = runtimeConfig.public.passwordMaxLength;

definePageMeta({ layout: false, middleware: ['guest-guard'] });

const passwordsMatch = computed(() => password.value === repeatPassword.value);

const passwordValidationLength = computed(() => {
  const val = password?.value || '';
  return val.length >= passwordMinLength && val.length <= passwordMaxLength;
});

const passwordValidationOneDigit = computed(() => /\d/.test(password?.value || ''));
const passwordValidationOneLetter = computed(() => /[A-Za-z]/.test(password?.value || ''));

const isPasswordFormatValid = computed(() => {
  return passwordValidationLength.value && passwordValidationOneDigit.value && passwordValidationOneLetter.value;
});

const repeatPasswordValidationLength = computed(() => {
  const val = repeatPassword?.value || '';
  return val.length >= passwordMinLength && val.length <= passwordMaxLength;
});

const repeatPasswordValidationOneDigit = computed(() => /\d/.test(repeatPassword?.value || ''));
const repeatPasswordValidationOneLetter = computed(() => /[A-Za-z]/.test(repeatPassword?.value || ''));

const isRepeatPasswordFormatValid = computed(() => {
  return (
    repeatPasswordValidationLength.value &&
    repeatPasswordValidationOneDigit.value &&
    repeatPasswordValidationOneLetter.value
  );
});

const isRepeatPasswordValid = computed(() => {
  return isRepeatPasswordFormatValid.value && passwordsMatch.value;
});

const isPasswordValid = computed(() => {
  return password.value !== '' && repeatPassword.value !== '' && isPasswordFormatValid.value && passwordsMatch.value;
});

const passwordErrorMessage = computed(() => {
  if (!password.value) {
    return t('errorMessages.password.required');
  }

  if (password.value.length < passwordMinLength) {
    return t('errorMessages.password.minLength', { min: passwordMinLength });
  }

  if (password.value.length > passwordMaxLength) {
    return t('errorMessages.password.maxLength', { max: passwordMaxLength });
  }

  if (!passwordValidationOneDigit.value || !passwordValidationOneLetter.value) {
    return t('errorMessages.password.valid');
  }

  return '';
});

const repeatPasswordErrorMessage = computed(() => {
  if (!repeatPassword.value) {
    return t('errorMessages.password.required');
  }

  if (repeatPassword.value.length < passwordMinLength) {
    return t('errorMessages.password.minLength', { min: passwordMinLength });
  }

  if (repeatPassword.value.length > passwordMaxLength) {
    return t('errorMessages.password.maxLength', { max: passwordMaxLength });
  }

  if (!/\d/.test(repeatPassword.value) || !/[A-Za-z]/.test(repeatPassword.value)) {
    return t('errorMessages.password.valid');
  }

  if (!passwordsMatch.value) {
    return t('errorMessages.password.match');
  }

  return '';
});

const stripSpaces = (fieldName: 'password' | 'repeatPassword') => {
  const field = fieldName === 'password' ? password : repeatPassword;
  field.value = field.value.replace(/\s/g, '');
};

const navigateAfterAuth = () => {
  closeAuthentication();
  window.location.href = localePath(paths.home);
};

const executeResetPassword = async () => {
  if (!isPasswordValid.value) {
    passwordTouched.value = true;
    repeatPasswordTouched.value = true;
    return;
  }

  try {
    await resetPassword({
      password: password.value,
      password2: repeatPassword.value,
      hash: hash,
      contactId: contactId,
    });

    await fetchSession();
    send({ message: t('auth.setNewPassword.resetSucceded'), type: 'positive' });
    await navigateTo(localePath(paths.home));
  } catch (error) {
    useHandleError(error as ApiError);
  }
};
</script>
